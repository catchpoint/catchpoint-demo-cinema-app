package com.sqlcinema.backend.service.impl;

import com.catchpoint.trace.api.invocation.InvocationAPI;
import com.sqlcinema.backend.model.Reservation;
import com.sqlcinema.backend.model.UserAccount;
import com.sqlcinema.backend.repository.ReservationRepository;
import com.sqlcinema.backend.service.ReservationService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.sqlcinema.backend.common.Constants.getCurrentUser;

@Service
@AllArgsConstructor
public class ReservationServiceImpl implements ReservationService {
    private final ReservationRepository reservationRepository;
    
    @Override
    public List<Reservation> getReservations(int page, int size, boolean isAdmin) {
        if (isAdmin) {
            return reservationRepository.getAllReservations(page, size);
        }

        UserAccount user = getCurrentUser();
        return reservationRepository.getReservationsByUserId(user.getUserId(), page, size);
    }
    
    @Override
    public void deleteReservation(int reservationId) {
        reservationRepository.deleteReservation(reservationId);
        // InvocationAPI.addIncomingTraceLink("reservation:" + reservationId);
    }

    @Override
    public int getReservationCount(boolean isAdmin) {
        if (isAdmin) {
            return reservationRepository.getReservationCount(null);
        }
        
        UserAccount user = getCurrentUser();
        return reservationRepository.getReservationCount(user.getUserId());
    }

    @Override
    public Reservation getReservationById(int reservationId) {
        return reservationRepository.getReservationById(reservationId);
    }

    @Override
    public float getRevenue() {
        return reservationRepository.getRevenue();
    }

    @Override
    public float getDailyRevenue() {
        return reservationRepository.getDailyRevenue();
    }

    @Override
    public int getSoldTickets() {
        return reservationRepository.getSoldTickets();
    }

    @Override
    public int getAllTicketCount() {
        return reservationRepository.getAllTicketCount();
    }

    @Override
    public String getMostSoldMovie() {
        return reservationRepository.getMostSoldMovie();
    }

    @Override
    public String getLeastSoldMovie() {
        return reservationRepository.getLeastSoldMovie();
    }
}
