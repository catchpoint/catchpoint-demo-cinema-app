package com.sqlcinema.backend.service.impl;

import com.sqlcinema.backend.model.Seat;
import com.sqlcinema.backend.model.Theatre;
import com.sqlcinema.backend.repository.TheatreRepository;
import com.sqlcinema.backend.service.TheatreService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@AllArgsConstructor
public class TheatreServiceImpl implements TheatreService {
    private final TheatreRepository theatreRepository;

    @Override
    public List<Theatre> getTheatres() {
        return theatreRepository.getTheatres();
    }

    @Override
    public Theatre getTheatreById(int theatreId) {
        return theatreRepository.getTheatreById(theatreId);
    }

    @Override
    public Theatre createTheatre(Theatre theatreRequest) {
        return theatreRepository.createTheatre(theatreRequest);
    }

    @Override
    public Theatre updateTheatre(int theatreId, Theatre theatreRequest) {
        return theatreRepository.updateTheatre(theatreId, theatreRequest);
    }

    @Override
    public void deleteTheatre(int theatreId) {
        theatreRepository.deleteTheatre(theatreId);
    }

    @Override
    public List<Seat> getSeats(int theatreId) {
        return theatreRepository.getSeats(theatreId);
    }

    @Override
    public void deleteSeat(int theatreId, String seatCode) {
        theatreRepository.deleteSeat(theatreId, seatCode);
    }

    @Override
    public Seat getSeatById(int theatreId, String seatCode) {
        return theatreRepository.getSeatById(theatreId, seatCode);
    }

    @Override
    public Seat updateSeat(int theatreId, Seat seatRequest) {
        return theatreRepository.updateSeat(theatreId, seatRequest);
    }

    @Override
    public Seat createSeat(int theatreId,Seat seatRequest) {
        return theatreRepository.createSeat(theatreId, seatRequest);
    }
}
