package com.example.demo.service;

import com.example.demo.config.RabbitMQConfig;
import com.example.demo.dto.TrackingEventDTO;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
public class TrackingEventProducer {

    private final RabbitTemplate rabbitTemplate;

    public TrackingEventProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    /**
     * Notification queue mein event bhejo — directly notification-service ke liye.
     * Yeh tracking-service ko bypass karta hai.
     */
    public void sendNotification(
            String trackingNumber,
            String status,
            String location,
            String remarks,
            String email,
            String recipientType,
            String senderName,
            String receiverName) {

        TrackingEventDTO event = new TrackingEventDTO(
                trackingNumber, status, location, remarks,
                email, recipientType, senderName, receiverName
        );

        System.out.println("📤 SENDING NOTIFICATION EVENT to: " + email + " [" + recipientType + "]");

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.EXCHANGE,
                RabbitMQConfig.ROUTING_KEY,
                event
        );
    }
}