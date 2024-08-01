package com.sqlcinema.backend.controller;

import com.sqlcinema.backend.manager.ActivityManager;
import com.sqlcinema.backend.model.Reservation;
import com.sqlcinema.backend.model.activity.ActivityType;
import com.sqlcinema.backend.service.ReservationService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

import static com.sqlcinema.backend.common.Constants.getCurrentUser;
import static org.springframework.http.ResponseEntity.*;

@RestController
@RequestMapping("/api/reservation")
@AllArgsConstructor
public class ReservationController {
    private final ReservationService reservationService;
    private final ActivityManager activityManager;

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<List<Reservation>> getAllReservations(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {

        HttpHeaders headers = new HttpHeaders();
        headers.add("X-Total-Count", String.valueOf(reservationService.getReservationCount(true)));

        return ok()
                .headers(headers)
                .body(reservationService.getReservations(page, size, true));

    }

    @GetMapping("/")
    public ResponseEntity<List<Reservation>> getReservations(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("X-Total-Count", String.valueOf(reservationService.getReservationCount(false)));

        return ok()
                .headers(headers)
                .body(reservationService.getReservations(page, size, false));

    }
    
    @GetMapping("/{reservationId}")
    public ResponseEntity<Reservation> getReservationById(@PathVariable("reservationId") int reservationId) {
        Reservation reservation = reservationService.getReservationById(reservationId);
        if (reservation == null) {
            return notFound().build();
        }
        return ok(reservation);
    }


    @DeleteMapping("/{reservationId}")
    public ResponseEntity<Void> deleteReservation(@PathVariable("reservationId") int reservationId) {
        Reservation existing = reservationService.getReservationById(reservationId);
        if (existing == null) {
            return notFound().build();
        }
        reservationService.deleteReservation(reservationId);
        activityManager.addActivity(Objects.requireNonNull(getCurrentUser()).getUserId(), ActivityType.DELETE,
                "User canceled reservation with id " + reservationId);

        return noContent().build();
    }

    @GetMapping("/revenue")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Float> getRevenue() {
        return ok(reservationService.getRevenue());
    }

    @GetMapping("/daily-revenue")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Float> getDailyRevenue() {
        return ok(reservationService.getDailyRevenue());
    }

    @GetMapping("/sold-tickets")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Integer> getSoldTickets() {
        return ok(reservationService.getSoldTickets());
    }

    @GetMapping("/ticket-count")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Integer> getAllTicketCount() {
        return ok(reservationService.getAllTicketCount());
    }


    @GetMapping("/most-sold-movie")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> getMostSoldMovie() {
        return ok(reservationService.getMostSoldMovie());
    }

    @GetMapping("/least-sold-movie")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> getLeastSoldMovie() {
        return ok(reservationService.getLeastSoldMovie());
    }


}
