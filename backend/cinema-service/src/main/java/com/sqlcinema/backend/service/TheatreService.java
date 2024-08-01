package com.sqlcinema.backend.service;

import com.sqlcinema.backend.model.Seat;
import com.sqlcinema.backend.model.Theatre;

import java.util.List;

public interface TheatreService {
    List<Theatre> getTheatres();

    Theatre getTheatreById(int theatreId);

    Theatre createTheatre(Theatre theatreRequest);

    Theatre updateTheatre(int theatreId, Theatre theatreRequest);

    void deleteTheatre(int theatreId);

    List<Seat> getSeats(int theatreId);

    Seat createSeat(int theatreId, Seat seatRequest);

    Seat updateSeat(int theatreId, Seat seatRequest);

    void deleteSeat(int theatreId, String seatCode);

    Seat getSeatById(int theatreId, String seatCode);

}
