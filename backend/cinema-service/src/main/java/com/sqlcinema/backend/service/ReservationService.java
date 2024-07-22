package com.sqlcinema.backend.service;

import com.sqlcinema.backend.model.Reservation;

import java.util.List;

public interface ReservationService {
    List<Reservation> getReservations(int page, int size, boolean isAdmin);
    void deleteReservation(int reservationId);
    int getReservationCount(boolean isAdmin);

    Reservation getReservationById(int reservationId);

    float getRevenue();

    float getDailyRevenue();

    int getSoldTickets();

    int getAllTicketCount();

    String getMostSoldMovie();

    String getLeastSoldMovie();
}
