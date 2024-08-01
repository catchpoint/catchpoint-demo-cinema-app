package com.sqlcinema.backend.controller;

import com.sqlcinema.backend.manager.ActivityManager;
import com.sqlcinema.backend.model.Seat;
import com.sqlcinema.backend.model.Theatre;
import com.sqlcinema.backend.model.activity.ActivityType;
import com.sqlcinema.backend.service.TheatreService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.sqlcinema.backend.common.Constants.getCurrentUser;
import static org.springframework.http.ResponseEntity.notFound;
import static org.springframework.http.ResponseEntity.ok;

@RestController
@RequestMapping("/api/theatre")
@AllArgsConstructor
public class TheatreController {
    private final TheatreService theatreService;
    private final ActivityManager activityManager;

    @GetMapping("/")                                                        
    public ResponseEntity<List<Theatre>> getTheatres() {
        return ok(theatreService.getTheatres());
    }

    @GetMapping("/{theatreId}")
    public ResponseEntity<Theatre> getTheatreById(@PathVariable("theatreId") int theatreId) {
        Theatre existing = theatreService.getTheatreById(theatreId);
        if (existing == null) {
            return notFound().build();
        }
        return ok(existing);
    }


    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/")
    public ResponseEntity<Theatre> createTheatre(@RequestBody Theatre theatreRequest) {
        
        Theatre theatre = theatreService.createTheatre(theatreRequest);
        activityManager.addActivity(getCurrentUser().getUserId(), ActivityType.CREATE, "User created a new theatre");
        return ok(theatre);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/{theatreId}")
    public ResponseEntity<Theatre> updateTheatre(@PathVariable("theatreId") int theatreId, @RequestBody Theatre theatreRequest) {
        Theatre existing = theatreService.getTheatreById(theatreId);
        if (existing == null) {
            return notFound().build();
        }
        return ok(theatreService.updateTheatre(theatreId, theatreRequest));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/{theatreId}")
    public ResponseEntity<Void> deleteTheatre(@PathVariable("theatreId") int theatreId) {
        Theatre existing = theatreService.getTheatreById(theatreId);
        if (existing == null) {
            return notFound().build();
        }
        theatreService.deleteTheatre(theatreId);
        activityManager.addActivity(getCurrentUser().getUserId(), ActivityType.DELETE, "User deleted a theatre");
        return ok().build();
    }


    @GetMapping("/{theatreId}/seat")
    public ResponseEntity<List<Seat>> getSeats(@PathVariable("theatreId") int theatreId) {
        return ok(theatreService.getSeats(theatreId));
    }


    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/{theatreId}/seat")
    public ResponseEntity<Seat> createSeat(@PathVariable("theatreId") int theatreId,@RequestBody Seat seatRequest) {
        Seat seat = theatreService.createSeat(theatreId,seatRequest);
        activityManager.addActivity(getCurrentUser().getUserId(), ActivityType.CREATE, "User created a new seat");
        return ok(seat);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/{theatreId}/seat")
    public ResponseEntity<Seat> updateSeat(@PathVariable("theatreId") int theatreId, @RequestBody Seat seatRequest) {
        Seat existing = theatreService.getSeatById(theatreId,seatRequest.getSeatCode());
        if (existing == null) {
            return notFound().build();
        }
        Seat seat = theatreService.updateSeat(theatreId,seatRequest);
        activityManager.addActivity(getCurrentUser().getUserId(), ActivityType.UPDATE, "User updated a seat");
        return ok(seat);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/{theatreId}/seat")
    public ResponseEntity<Void> deleteSeat(@PathVariable("theatreId") int theatreId, @RequestBody Seat seatCode) {
        Seat existing = theatreService.getSeatById(theatreId, seatCode.getSeatCode());
        if (existing == null) {
            return notFound().build();
        }
        theatreService.deleteSeat(theatreId,seatCode.getSeatCode());
        activityManager.addActivity(getCurrentUser().getUserId(), ActivityType.DELETE, "User deleted a seat");
        return ok().build();
    }
}
