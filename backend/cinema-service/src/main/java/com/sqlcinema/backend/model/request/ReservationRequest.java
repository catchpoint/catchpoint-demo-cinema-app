package com.sqlcinema.backend.model.request;

import lombok.Data;

@Data
public class ReservationRequest {
    @Data
    public static class PaymentInfo {
        private String cardNumber;
        private String cardHolder;
        private String expiryDate;
        private String cvv;
        private String couponCode;
    }
    
    private int ticketId;
    private String[] seatCodes;
    private PaymentInfo paymentInfo;
    
}
