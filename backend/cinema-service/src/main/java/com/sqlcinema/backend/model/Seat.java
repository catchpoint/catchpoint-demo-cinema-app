package com.sqlcinema.backend.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
public class Seat {
    private int theatreId;
    private String seatCode;
    private String seatType;
}
