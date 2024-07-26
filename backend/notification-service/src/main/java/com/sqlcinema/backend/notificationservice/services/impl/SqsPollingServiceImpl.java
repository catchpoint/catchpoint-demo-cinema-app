package com.sqlcinema.backend.notificationservice.services.impl;

import com.amazonaws.services.sqs.AmazonSQS;
import com.amazonaws.services.sqs.model.Message;
import com.amazonaws.services.sqs.model.ReceiveMessageRequest;
import com.amazonaws.services.sqs.model.ReceiveMessageResult;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sqlcinema.backend.notificationservice.models.Notification;
import com.sqlcinema.backend.notificationservice.services.EmailService;
import com.sqlcinema.backend.notificationservice.services.SqsPollingService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class SqsPollingServiceImpl implements SqsPollingService {
    private static final String EMAIL_SUBJECT_PREFIX = "Your ticket purchase - ";
    private final AmazonSQS sqsClient;
    private final EmailService emailService;
    private final ObjectMapper objectMapper;
    private final Logger logger = LogManager.getLogger(getClass());

    @Value("${sqs.queue.url}")
    private String queueUrl;

    public SqsPollingServiceImpl(AmazonSQS sqsClient, EmailService emailService, ObjectMapper mapper) {
        this.sqsClient = sqsClient;
        this.objectMapper = mapper;
        this.emailService = emailService;
    }

    @Override
    @Scheduled(fixedRate = 5000) // every 5 seconds
    public void poll() {
        logger.info("Polling SQS queue");
        ReceiveMessageRequest request = new ReceiveMessageRequest()
                .withQueueUrl(queueUrl)
                .withMessageAttributeNames("All")
                .withMaxNumberOfMessages(10)
                .withWaitTimeSeconds(10);

        ReceiveMessageResult response = sqsClient.receiveMessage(request);

        logger.info("Received {} messages", response.getMessages().size());
        logger.info("META: {}", response.getSdkResponseMetadata());
        for (Message message : response.getMessages()) {
            String body = message.getBody();
            logger.info("Received message: {}", body);
            logger.info("Message attributes: {}", message.getMessageAttributes());
            try {
                Notification notification = objectMapper.readValue(body, Notification.class);
                logger.info("Notification: {}", notification);
                emailService.sendEmail(
                        notification.getUserEmail(),
                        EMAIL_SUBJECT_PREFIX + notification.getMovieTitle(),
                        notification.toHTML());

            } catch (Exception e) {
                logger.error("Error parsing message: {}", e.getMessage());
            } finally {
                sqsClient.deleteMessage(queueUrl, message.getReceiptHandle());
            }
        }
    }
}
