package com.sqlcinema.backend.notificationservice.config;

import com.amazonaws.auth.DefaultAWSCredentialsProviderChain;
import com.amazonaws.regions.DefaultAwsRegionProviderChain;
import com.amazonaws.services.simpleemail.AmazonSimpleEmailService;
import com.amazonaws.services.simpleemail.AmazonSimpleEmailServiceClient;
import com.amazonaws.services.sqs.AmazonSQS;
import com.amazonaws.services.sqs.AmazonSQSClient;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ApplicationConfig {

    private boolean isNullOrEmpty(String str) {
        return str == null || str.isEmpty();
    }

    @Bean
    public AmazonSQS sqsClient() {
        return AmazonSQSClient.builder()
                .withCredentials(new DefaultAWSCredentialsProviderChain())
                .withRegion(isNullOrEmpty(System.getenv("AWS_REGION")) ?
                        new DefaultAwsRegionProviderChain().getRegion() : System.getenv("AWS_REGION"))
                .build();
    }

    @Bean
    public AmazonSimpleEmailService sesClient() {
        return AmazonSimpleEmailServiceClient.builder()
                .withCredentials(new DefaultAWSCredentialsProviderChain())
                .withRegion(isNullOrEmpty(System.getenv("AWS_REGION")) ?
                        new DefaultAwsRegionProviderChain().getRegion() : System.getenv("AWS_REGION"))
                .build();
    }

    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
        return objectMapper;
    }
}
