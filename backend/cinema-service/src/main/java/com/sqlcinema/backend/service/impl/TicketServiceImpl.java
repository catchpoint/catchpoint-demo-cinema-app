package com.sqlcinema.backend.service.impl;

import com.amazonaws.services.sqs.AmazonSQS;
import com.amazonaws.services.sqs.model.MessageAttributeValue;
import com.amazonaws.services.sqs.model.SendMessageRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sqlcinema.backend.model.*;
import com.sqlcinema.backend.model.movie.Movie;
import com.sqlcinema.backend.model.request.ReservationRequest;
import com.sqlcinema.backend.model.response.SeatResponse;
import com.sqlcinema.backend.model.response.TicketResponse;
import com.sqlcinema.backend.repository.CouponRepository;
import com.sqlcinema.backend.repository.MovieRepository;
import com.sqlcinema.backend.repository.TheatreRepository;
import com.sqlcinema.backend.repository.TicketRepository;
import com.sqlcinema.backend.service.TicketService;
import com.sqlcinema.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService {
    private final TicketRepository ticketRepository;
    private final CouponRepository couponRepository;
    private final MovieRepository movieRepository;
    private final TheatreRepository theatreRepository;

    private final Logger logger = LogManager.getLogger(getClass());

    private final UserService userService;

    private final AmazonSQS sqsClient;
    private final ObjectMapper objectMapper;

    @Value("${sqs.queue.url}")
    private String queueUrl;

    @Override
    public List<TicketResponse> getTickets(int movieId) {
        return ticketRepository.getTickets(movieId);
    }

    @Override
    public List<SeatResponse> getSeats(int ticketId) {
        return ticketRepository.getSeats(ticketId);
    }

    @Override
    public Reservation reserveSeats(int userId, ReservationRequest reservation, String traceparent) {

        checkReservation(reservation);

        Reservation newReservation = ticketRepository.reserveSeats(userId, reservation);
        if (newReservation == null) {
            return null;
        }
        try {
            checkCreditCard(reservation.getPaymentInfo().getCardNumber());
            float price = calculatePrice(reservation);

            if (price < 0) {
                throw new IllegalArgumentException("The price must be greater than 0");
            }

            ticketRepository.approvePayment(newReservation.getReservationId(), getPaymentType(reservation), price);

            if (reservation.getPaymentInfo().getCouponCode() != null) {
                couponRepository.useCoupon(reservation.getPaymentInfo().getCouponCode());
            }

            Ticket ticket = ticketRepository.getTicket(reservation.getTicketId());
            Movie movie = movieRepository.getMovieById(ticket.getMovieId());

            Map<String, Object> message = new HashMap<>();
            message.put("reservationId", newReservation.getReservationId());
            message.put("userEmail", userService.getUserById(userId).getEmail());
            message.put("movieTitle", movie.getTitle());
            message.put("theatreName", theatreRepository.getTheatreById(ticket.getTheatreId()).getName());
            message.put("showtime", ticket.getShowTime().getTime());
            message.put("seatCode", String.join(", ", reservation.getSeatCodes()));
            message.put("appliedCouponCode", reservation.getPaymentInfo().getCouponCode());
            message.put("creditCardNumber", reservation.getPaymentInfo().getCardNumber());

            String messageAsString;
            try {
                messageAsString = objectMapper.writeValueAsString(message);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }

            MessageAttributeValue traceparentAttribute = new MessageAttributeValue()
                    .withDataType("String")
                    .withStringValue(traceparent);
            SendMessageRequest sendMessageRequest = new SendMessageRequest()
                    .withQueueUrl(queueUrl)
                    .withMessageAttributes(Collections.singletonMap("traceparent", traceparentAttribute))
                    .withMessageBody(messageAsString);
            sqsClient.sendMessage(sendMessageRequest);

        } catch (Exception e) {
            ticketRepository.cancelPayment(newReservation.getReservationId());
            throw e;
        }

        return newReservation;
    }

    public void checkReservation(ReservationRequest reservation) {
        ticketRepository.checkReservation(reservation);
    }

    public float calculatePrice(ReservationRequest reservation) {
        float price = 0;

        for (String seat : reservation.getSeatCodes()) {
            price += ticketRepository.getSeatPrice(reservation.getTicketId(), seat);
        }

        if (reservation.getPaymentInfo().getCouponCode() != null) {
            Coupon coupon = couponRepository.getCouponByCode(reservation.getPaymentInfo().getCouponCode());

            if (coupon == null || !coupon.isValid()) {
                return price;
            }

            if (coupon instanceof AmountCoupon) {
                AmountCoupon amountCoupon = (AmountCoupon) coupon;
                price = amountCoupon.getMinPrice() <= price ? price - amountCoupon.getAmount() : price;
            } else if (coupon instanceof PercentCoupon) {
                PercentCoupon percentCoupon = (PercentCoupon) coupon;
                price *= percentCoupon.getUpTo() >= price ? 1 - (percentCoupon.getRate() / 100) : 1;
            }
        }

        return price;
    }


    public void checkCreditCard(String creditCardNumber) {
        if (creditCardNumber.length() != 16) {
            throw new IllegalArgumentException("Credit card number must be 16 digits long");
        }

        if (!creditCardNumber.matches("[0-9]+")) {
            throw new IllegalArgumentException("Credit card number must only contain digits");
        }

        int sum = 0;
        for (int i = 0; i < creditCardNumber.length(); i++) {
            int digit = Character.getNumericValue(creditCardNumber.charAt(i));
            if (i % 2 == 0) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            sum += digit;
        }

        if (sum % 10 != 0) {
            throw new IllegalArgumentException("Invalid credit card number");
        }


    }

    private String getPaymentType(ReservationRequest reservation) {
        if (reservation.getPaymentInfo().getCardNumber().startsWith("4")) {
            return "Visa";
        } else if (reservation.getPaymentInfo().getCardNumber().startsWith("5")) {
            return "MasterCard";
        } else {
            return "American Express";
        }
    }


    // every one hour
    @Scheduled(fixedRate = 3600000)
    public void deleteExpiredReservations() {
        logger.info("Deleting expired reservations: " + new Date());
        ticketRepository.deleteExpiredReservations();
    }
}
