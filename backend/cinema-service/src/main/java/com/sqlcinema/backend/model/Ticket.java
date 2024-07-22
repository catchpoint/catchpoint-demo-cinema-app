package com.sqlcinema.backend.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.Date;

@Data
@SuperBuilder
@NoArgsConstructor
public class Ticket {
    private int ticketId;
    private int movieId;
    private int price;
    private Date showTime;
    private int theatreId;
}
