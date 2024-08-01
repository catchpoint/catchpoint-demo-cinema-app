package com.sqlcinema.backend.repository;

import com.sqlcinema.backend.model.Reservation;
import com.sqlcinema.backend.model.Ticket;
import com.sqlcinema.backend.model.request.ReservationRequest;
import com.sqlcinema.backend.model.response.SeatResponse;
import com.sqlcinema.backend.model.response.TicketResponse;
import lombok.AllArgsConstructor;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
@AllArgsConstructor
public class TicketRepository {
    private final JdbcTemplate jdbcTemplate;
    private static final BeanPropertyRowMapper<Ticket> TICKET_BEAN_MAPPER =
            BeanPropertyRowMapper.newInstance(Ticket.class);
    private static final BeanPropertyRowMapper<TicketResponse> TICKET_RESPONSE_BEAN_MAPPER =
            BeanPropertyRowMapper.newInstance(TicketResponse.class);
    private static final BeanPropertyRowMapper<Reservation> RESERVATION_BEAN_MAPPER =
            BeanPropertyRowMapper.newInstance(Reservation.class);

    private static final BeanPropertyRowMapper<SeatResponse> SEAT_RESPONSE_BEAN_MAPPER =
            BeanPropertyRowMapper.newInstance(SeatResponse.class);


    public Ticket getTicket(int ticketId) {
        String query = "SELECT * FROM Ticket WHERE ticket_id = ?";
        return jdbcTemplate.queryForObject(query, TICKET_BEAN_MAPPER, ticketId);
    }

    public List<TicketResponse> getTickets(int movieId) {
        String query = "SELECT * FROM Ticket WHERE movie_id = ? ORDER BY show_time";
        return jdbcTemplate.query(query, TICKET_RESPONSE_BEAN_MAPPER, movieId);
    }

    public List<SeatResponse> getSeats(int ticketId) {
        String query = "SELECT s.* FROM Seat s INNER JOIN Ticket t ON s.theatre_id = t.theatre_id AND t.ticket_id = ?";
        List<SeatResponse> seats = jdbcTemplate.query(query,
                SEAT_RESPONSE_BEAN_MAPPER, ticketId);

        for (SeatResponse seat : seats) {
            query = "SELECT COUNT(*) FROM available_seats WHERE seat_code = ? AND ticket_id = ?";
            seat.setAvailable(jdbcTemplate.queryForObject(query, Integer.class, seat.getSeatCode(), ticketId) != 0);
        }

        return seats;
    }

    public Reservation reserveSeats(int userId, ReservationRequest reservation) {
        String query = "CALL create_reservation(?, ?, ?)";
        String firstSeat = reservation.getSeatCodes()[0];

        jdbcTemplate.update(query, userId, reservation.getTicketId(), firstSeat);
        query = "SELECT Reservation.* FROM Reservation INNER JOIN ReservationSeat " +
                "ON Reservation.reservation_id = ReservationSeat.reservation_id WHERE Reservation.user_id = ? " +
                "AND Reservation.ticket_id = ? AND ReservationSeat.seat_code = ?" +
                " ORDER BY Reservation.reservation_id DESC LIMIT 1";

        Reservation createdReservation = jdbcTemplate.queryForObject(query,
                RESERVATION_BEAN_MAPPER, userId, reservation.getTicketId(), firstSeat);

        if (createdReservation == null) {
            return null;
        }


        for (int i = 1; i < reservation.getSeatCodes().length; i++) {
            String seatCode = reservation.getSeatCodes()[i];
            query = "CALL add_seat_to_reservation(?, ?, ?)";
            jdbcTemplate.update(query, createdReservation.getReservationId(), reservation.getTicketId(), seatCode);
        }

        return createdReservation;

    }

    public void approvePayment(int reservationId, String paymentType, float paymentAmount) {
        String query = "CALL approve_payment(?, ?, ?)";
        jdbcTemplate.update(query, reservationId, paymentType, paymentAmount);
    }

    public float getSeatPrice(int ticketId, String seat) {
        String query = "SELECT IF(Seat.seat_type = 'VIP', Ticket.price * 2, Ticket.price) " +
                "FROM Ticket INNER JOIN Seat ON Ticket.theatre_id = Seat.theatre_id " +
                "WHERE Ticket.ticket_id = ? AND Seat.seat_code = ?";

        return jdbcTemplate.queryForObject(query, Float.class, ticketId, seat);
    }

    public void cancelPayment(int reservationId) {
        String query = "DELETE FROM Reservation WHERE reservation_id = ?";
        jdbcTemplate.update(query, reservationId);
    }

    public void checkReservation(ReservationRequest reservation) {
        String query = "SELECT COUNT(*) FROM Reservation INNER JOIN ReservationSeat " +
                "ON Reservation.reservation_id = ReservationSeat.reservation_id WHERE Reservation.ticket_id = ? " +
                "AND ReservationSeat.seat_code = ?";

        for (String seatCode : reservation.getSeatCodes()) {
            if (jdbcTemplate.queryForObject(query, Integer.class, reservation.getTicketId(), seatCode) != 0) {
                throw new IllegalArgumentException("Seat " + seatCode + " is already reserved");
            }
        }
    }

    public void deleteExpiredReservations() {
        String query = "DELETE FROM Reservation WHERE TIMESTAMPDIFF(MINUTE, created_at, NOW()) > 15";
        jdbcTemplate.update(query);
    }
}

