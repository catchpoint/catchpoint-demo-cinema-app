package com.sqlcinema.backend.notificationservice.services.impl;

import com.amazonaws.services.simpleemail.AmazonSimpleEmailService;
import com.amazonaws.services.simpleemail.model.Body;
import com.amazonaws.services.simpleemail.model.Content;
import com.amazonaws.services.simpleemail.model.Destination;
import com.amazonaws.services.simpleemail.model.SendEmailRequest;
import com.amazonaws.services.simpleemail.model.Message;
import com.sqlcinema.backend.notificationservice.services.EmailService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


@Service
public class EmailServiceImpl implements EmailService {

    @Value("${email.username}")
    private String emailUsername;
    
    private final AmazonSimpleEmailService mailSender;
    
    public EmailServiceImpl(AmazonSimpleEmailService mailSender) {
        this.mailSender = mailSender;
    }
    
    private Destination getDestination(String to) {
        return new Destination().withToAddresses(to);
    }
    
    private Content getSubject(String subject) {
        return new Content().withData(subject);
    }
    
    private Body getBody(String body) {
        Content content = new Content().withData(body);
        return new Body().withHtml(content);
    }
    
    @Override
    public void sendEmail(String to, String subject, String body) {
        Destination destination = getDestination(to);
        Content emailSubject = getSubject(subject);
        Body emailBody = getBody(body);

        SendEmailRequest request = new SendEmailRequest()
                .withSource(emailUsername)
                .withDestination(destination)
                .withMessage(new Message()
                        .withSubject(emailSubject)
                        .withBody(emailBody));
        
        mailSender.sendEmail(request);
    }
}
