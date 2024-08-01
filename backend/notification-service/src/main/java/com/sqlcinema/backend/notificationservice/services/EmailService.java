package com.sqlcinema.backend.notificationservice.services;

public interface EmailService {
    void sendEmail(String to, String subject, String body);
}
