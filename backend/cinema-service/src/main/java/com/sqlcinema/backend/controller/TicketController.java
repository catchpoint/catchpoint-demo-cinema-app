package com.sqlcinema.backend.controller;

import com.sqlcinema.backend.model.Reservation;
import com.sqlcinema.backend.model.Ticket;
import com.sqlcinema.backend.model.request.ReservationRequest;
import com.sqlcinema.backend.model.response.AirTimesResponse;
import com.sqlcinema.backend.model.response.AvailableMoviesResponse;
import com.sqlcinema.backend.model.response.SeatResponse;
import com.sqlcinema.backend.model.response.TicketResponse;
import com.sqlcinema.backend.service.TicketService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.sqlcinema.backend.common.Constants.getCurrentUser;
import static org.springframework.http.ResponseEntity.*;

@RestController
@RequestMapping("/api/ticket")
@AllArgsConstructor
public class TicketController {
    private final TicketService ticketService;

    @GetMapping("/{movieId}")
    public ResponseEntity<List<TicketResponse>> getTickets(@PathVariable("movieId") int movieId) {
        return ok(ticketService.getTickets(movieId));
    }

    @GetMapping("/{ticketId}/seats")
    public ResponseEntity<List<SeatResponse>> getSeats(@PathVariable("ticketId") int ticketId) {
        return ok(ticketService.getSeats(ticketId));
    }

    @PostMapping("/reserve")
    public ResponseEntity<Reservation> reserveSeats(@RequestBody ReservationRequest reservation,
                                                    @RequestHeader(name = "traceparent", required = false)
                                                    String traceparent) {
        int userId = getCurrentUser().getUserId();
        return ok(ticketService.reserveSeats(userId, reservation, traceparent));
    }
}
