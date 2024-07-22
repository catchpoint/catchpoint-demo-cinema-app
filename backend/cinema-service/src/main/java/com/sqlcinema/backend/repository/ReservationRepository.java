package com.sqlcinema.backend.repository;

import com.sqlcinema.backend.common.CustomLogger;
import com.sqlcinema.backend.model.Reservation;
import lombok.AllArgsConstructor;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import static com.sqlcinema.backend.common.Constants.createObjectArray;

@Repository
@AllArgsConstructor
public class ReservationRepository {
    private final JdbcTemplate jdbcTemplate;
    private final CustomLogger logger;

    public List<Reservation> getReservations(Map<String, Object> filter) {
        String query = "SELECT r.reservation_id, t.ticket_id, ua.username, m.title as movie_title, th.name as theatre_name," +
                " p.payment_amount as price, t.show_time, p.payment_type " +
                "FROM Reservation r " +
                "INNER JOIN Ticket t ON r.ticket_id = t.ticket_id " +
                "INNER JOIN Payment p ON r.reservation_id = p.reservation_id " +
                "INNER JOIN Movie m ON t.movie_id = m.movie_id " +
                "INNER JOIN Theatre th ON t.theatre_id = th.theatre_id " +
                "INNER JOIN UserAccount ua ON r.user_id = ua.user_id ";

        if (filter.containsKey("userId")) {
            query += "WHERE r.user_id = " + filter.get("userId") + " ";
        }

        if (filter.containsKey("reservationId")) {
            query += "WHERE r.reservation_id = " + filter.get("reservationId") + " ";
        }


        if (filter.containsKey("sort")) {
            query += "ORDER BY " + filter.get("sort") + " ";
        } else {
            query += "ORDER BY r.reservation_id DESC ";
        }


        if (filter.containsKey("size")) {
            query += "LIMIT " + filter.get("size") + " ";
        }

        if (filter.containsKey("page")) {
            query += "OFFSET " + filter.get("page") + " ";
        }

        try {
            List<Reservation> reservations = jdbcTemplate.query(query,
                    BeanPropertyRowMapper.newInstance(Reservation.class));

            logger.sqlLog(query, filter.values().toArray());

            for (Reservation reservation : reservations) {
                query = "SELECT seat_code FROM ReservationSeat WHERE reservation_id = ?";
                reservation.setSeatCodes(List.of
                        (jdbcTemplate.queryForList
                                (query, String.class, reservation.getReservationId()).toArray(new String[0])));
            }

            return reservations;
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    public List<Reservation> getAllReservations(int page, int size) {
        return getReservations(Map.of("page", (page - 1) * size, "size", size));
    }

    public List<Reservation> getReservationsByUserId(int userId, int page, int size) {
        return getReservations(Map.of("userId", userId, "page", (page - 1) * size, "size", size));
    }

    public void deleteReservation(int reservationId) {
        String query = "DELETE FROM Reservation WHERE reservation_id = ?";
        logger.sqlLog(query, createObjectArray(reservationId));

        jdbcTemplate.update(query, reservationId);
    }


    public int getReservationCount(Object userId) {
        String query = "SELECT COUNT(*) FROM Reservation";
        logger.sqlLog(query, createObjectArray(""));

        if (userId != null) {
            query += " WHERE user_id = ?";

            userId = Integer.parseInt(userId.toString());

            logger.sqlLog(query, createObjectArray(userId));
            try {
                return jdbcTemplate.queryForObject(query, Integer.class, userId);
            } catch (Exception e) {
                return 0;
            }
        } else {
            try {
                return jdbcTemplate.queryForObject(query, Integer.class);
            } catch (Exception e) {
                return 0;
            }
        }

    }

    public Reservation getReservationById(int reservationId) {
        return getReservations(Map.of("reservationId", reservationId)).get(0);
    }

    public float getRevenue() {
        String query = "SELECT SUM(payment_amount) FROM Payment";
        logger.sqlLog(query, createObjectArray(""));

        try {
            return jdbcTemplate.queryForObject(query, Float.class);
        } catch (Exception e) {
            return 0;
        }
    }

    public float getDailyRevenue() {
        String query = "SELECT SUM(Payment.payment_amount) FROM Payment " +
                "INNER JOIN Reservation ON Payment.reservation_id = Reservation.reservation_id " +
                "WHERE DATE(Reservation.created_at) = CURDATE()";

        logger.sqlLog(query, createObjectArray(""));

        try {
            return jdbcTemplate.queryForObject(query, Float.class);
        } catch (Exception e) {
            return 0;
        }
    }

    public int getSoldTickets() {
        String query = "SELECT COUNT(*) FROM ReservationSeat ";
        logger.sqlLog(query, createObjectArray(""));

        try {
            return jdbcTemplate.queryForObject(query, Integer.class);
        } catch (Exception e) {
            return 0;
        }
    }

    public int getAllTicketCount() {
        String query = "SELECT COUNT(*) FROM Ticket INNER JOIN Seat ON Ticket.theatre_id = Seat.theatre_id";
        logger.sqlLog(query, createObjectArray(""));

        try {
            return jdbcTemplate.queryForObject(query, Integer.class);
        } catch (Exception e) {
            return 0;
        }
    }

    public String getMostSoldMovie() {
        String query = "SELECT Movie.title FROM Movie " +
                "INNER JOIN Ticket ON Movie.movie_id = Ticket.movie_id " +
                "INNER JOIN Reservation ON Ticket.ticket_id = Reservation.ticket_id " +
                "GROUP BY Movie.movie_id " +
                "ORDER BY COUNT(*) DESC " +
                "LIMIT 1";

        logger.sqlLog(query, createObjectArray(""));

        try {
            return jdbcTemplate.queryForObject(query, String.class);
        } catch (Exception e) {
            return "";
        }
    }

    public String getLeastSoldMovie() {
        String query = "SELECT Movie.title FROM Movie " +
                "INNER JOIN Ticket ON Movie.movie_id = Ticket.movie_id " +
                "INNER JOIN Reservation ON Ticket.ticket_id = Reservation.ticket_id " +
                "GROUP BY Movie.movie_id " +
                "ORDER BY COUNT(*) ASC " +
                "LIMIT 1";

        logger.sqlLog(query, createObjectArray(""));

        try {
            return jdbcTemplate.queryForObject(query, String.class);
        } catch (Exception e) {
            return "";
        }
    }
}
