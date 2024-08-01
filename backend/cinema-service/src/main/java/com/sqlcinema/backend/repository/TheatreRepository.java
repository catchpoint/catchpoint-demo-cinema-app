package com.sqlcinema.backend.repository;

import com.sqlcinema.backend.common.CustomLogger;
import com.sqlcinema.backend.model.Seat;
import com.sqlcinema.backend.model.Theatre;

import java.util.Collections;

import lombok.AllArgsConstructor;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.sqlcinema.backend.common.Constants.createObjectArray;

@Repository
@AllArgsConstructor
public class TheatreRepository {
    private final JdbcTemplate jdbcTemplate;
    private final CustomLogger logger;

    public List<Theatre> getTheatres() {
        String query = "SELECT * FROM Theatre";
        logger.sqlLog(query, createObjectArray(""));

        List<Theatre> theatres = jdbcTemplate.query(query,
                BeanPropertyRowMapper.newInstance(Theatre.class));

        for (Theatre theatre : theatres) {
            query = "SELECT * FROM Seat WHERE theatre_id = ?";
            logger.sqlLog(query, createObjectArray(theatre.getTheatreId()));

            List<Seat> seats = jdbcTemplate.query(query, BeanPropertyRowMapper.newInstance(Seat.class), theatre.getTheatreId());
            theatre.setSeats(seats);
        }

        return theatres;
    }

    public Theatre getTheatreById(int theatreId) {
        String query = "SELECT * FROM Theatre WHERE theatre_id = ?";
        logger.sqlLog(query, createObjectArray(theatreId));

        try {
            Theatre theatre = jdbcTemplate.queryForObject(query,
                    BeanPropertyRowMapper.newInstance(Theatre.class), theatreId);

            if (theatre == null) {
                return null;
            }

            query = "SELECT * FROM Seat WHERE theatre_id = ?";
            logger.sqlLog(query, createObjectArray(theatreId));

            List<Seat> seats = jdbcTemplate.query(query, BeanPropertyRowMapper.newInstance(Seat.class), theatreId);
            theatre.setSeats(seats);

            return theatre;

        } catch (Exception e) {
            return null;
        }
    }

    public Theatre createTheatre(Theatre theatreRequest) {
        logger.info("Creating theatre" + theatreRequest.getName());
        String query = "CALL create_theatre(?, ?)";

        logger.sqlLog(query, createObjectArray(theatreRequest.getName(), theatreRequest.isAvailable()));
        jdbcTemplate.update(query, theatreRequest.getName(), theatreRequest.isAvailable());

        return jdbcTemplate.queryForObject("SELECT * FROM Theatre WHERE name = ?",
                BeanPropertyRowMapper.newInstance(Theatre.class), theatreRequest.getName());
    }

    public Theatre updateTheatre(int theatreId, Theatre theatreRequest) {
        String updateQuery = "CALL update_theatre(?, ?, ?)";
        jdbcTemplate.update(updateQuery, theatreId, theatreRequest.getName(), theatreRequest.isAvailable());
        logger.sqlLog(updateQuery, createObjectArray(theatreId, theatreRequest.getName(), theatreRequest.isAvailable()));
        return getTheatreById(theatreId);
    }

    public void deleteTheatre(int theatreId) {
        String deleteQuery = "CALL delete_theatre(?);";
        jdbcTemplate.update(deleteQuery, theatreId);
        logger.sqlLog(deleteQuery, createObjectArray(theatreId));
    }

    public List<Seat> getSeats(int theatreId) {
        String query = "SELECT * FROM Seat WHERE theatre_id=?";
        logger.sqlLog(query, createObjectArray(""));
        try {
            return jdbcTemplate.query(query, BeanPropertyRowMapper.newInstance(Seat.class), theatreId);
        } catch (Exception E) {
            return Collections.emptyList();
        }
    }

    public List<Seat> getAvailableSeats(int ticketId) {
        String query = "SELECT * FROM available_seats WHERE ticket_id = ?";
        logger.sqlLog(query, createObjectArray(""));
        try {
            return jdbcTemplate.query(query, BeanPropertyRowMapper.newInstance(Seat.class), ticketId);
        } catch (Exception E) {
            return Collections.emptyList();
        }
    }

    public void deleteSeat(int theatreId, String seatCode) {
        String deleteQuery = "CALL delete_seat(?, ?);";
        jdbcTemplate.update(deleteQuery, theatreId, seatCode);
        logger.sqlLog(deleteQuery, createObjectArray(theatreId, seatCode));
    }


    public Seat updateSeat(int theatreId, Seat seatRequest) {
        String updateQuery = "CALL update_seat(?, ?, ?)";
        jdbcTemplate.update(updateQuery, theatreId, seatRequest.getSeatCode(), seatRequest.getSeatType());
        logger.sqlLog(updateQuery, createObjectArray(theatreId, seatRequest.getSeatCode(), seatRequest.getSeatType()));
        return getSeatById(theatreId, seatRequest.getSeatCode());
    }

    public Seat getSeatById(int theatreId, String seatCode) {
        String query = "SELECT * FROM Seat WHERE theatre_id = ? AND seat_code = ?";
        logger.sqlLog(query, createObjectArray(theatreId, seatCode));

        try {
            return jdbcTemplate.queryForObject(query,
                    BeanPropertyRowMapper.newInstance(Seat.class), theatreId, seatCode);
        } catch (Exception e) {
            return null;
        }
    }

    public Seat createSeat(int theatreId, Seat seatRequest) {
        logger.info("Creating seat" + seatRequest.getSeatCode());
        String query = "CALL create_seat(?, ?, ?)";

        logger.sqlLog(query, createObjectArray(theatreId, seatRequest.getSeatCode(), seatRequest.getSeatType()));
        jdbcTemplate.update(query, theatreId, seatRequest.getSeatCode(), seatRequest.getSeatType());

        return jdbcTemplate.queryForObject("SELECT * FROM Seat WHERE theatre_id = ? AND seat_code = ?",
                BeanPropertyRowMapper.newInstance(Seat.class), theatreId, seatRequest.getSeatCode());
    }

    public boolean checkAvailability(int theatreId, int ticketId, String seatCode, long showTime) {
        String query = "SELECT * FROM available_seats WHERE ticket_id = ? AND seat_code = ? AND show_time = ?";
        logger.sqlLog(query, createObjectArray(theatreId, seatCode, showTime));

        try {
            Seat seat = jdbcTemplate.queryForObject(query,
                    BeanPropertyRowMapper.newInstance(Seat.class), theatreId, seatCode, showTime);
            return seat != null;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
