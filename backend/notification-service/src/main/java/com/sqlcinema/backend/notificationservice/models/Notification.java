package com.sqlcinema.backend.notificationservice.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import java.util.Date;

@Data
public class Notification {
    private int reservationId;
    private String userEmail;
    private String movieTitle;
    private String theatreName;
    private String seatCode;
    private Date showtime;
    private String creditCardNumber;
    private String appliedCouponCode;
    
    @JsonIgnore
    public String toHTML() {
        String maskedCreditCardNumber = "**** **** **** " +
                creditCardNumber.substring(creditCardNumber.length() - 4);
        
        return "<h1>Reservation Confirmation</h1>" +
                "<p>Thank you for your purchase! Here are the details of your reservation:</p>" +
                "<ul>" +
                "<li>Movie: " + movieTitle + "</li>" +
                "<li>Theatre: " + theatreName + "</li>" +
                "<li>Seat: " + seatCode + "</li>" +
                "<li>Showtime: " + showtime + "</li>" +
                "<li>Credit Card: " + maskedCreditCardNumber + "</li>" +
                "<li>Coupon: " + appliedCouponCode + "</li>" +
                "</ul>";
    }
}
