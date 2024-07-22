package com.sqlcinema.backend.service;

import com.sqlcinema.backend.model.Reservation;
import com.sqlcinema.backend.model.request.ReservationRequest;
import com.sqlcinema.backend.model.response.SeatResponse;
import com.sqlcinema.backend.model.response.TicketResponse;

import java.util.List;

public interface TicketService {
    List<TicketResponse> getTickets(int movieId);

    List<SeatResponse> getSeats(int ticketId);

    Reservation reserveSeats(int userId, ReservationRequest reservation, String traceparent);
    void deleteExpiredReservations();
}
