package com.sqlcinema.backend.model.response;

import com.sqlcinema.backend.model.Seat;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
@NoArgsConstructor
public class SeatResponse extends Seat {
    private boolean available = false;
}
