package com.sqlcinema.backend.model;

import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class Reservation {
    private int reservationId;
    private int ticketId;
    private String username;
    private String movieTitle;
    private String theatreName;
    private float price;
    private Date showTime;
    private String paymentType;
    
    private List<String> seatCodes;
}
