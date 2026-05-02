package com.example.demo.service;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import com.example.demo.dto.TrackingEventDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class SignupProducer {

    private static final Logger log = LoggerFactory.getLogger(SignupProducer.class);
    private final RabbitTemplate rabbitTemplate;

    public SignupProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void sendWelcomeEmail(String email, String name) {
        try {
            TrackingEventDTO event = new TrackingEventDTO();
            event.setEmail(email);
            event.setSenderName(name); // using senderName field for the user's name
            event.setStatus("VERIFY");
            event.setRecipientType("NEW_USER");

            log.info("Sending welcome notification for: {}", email);
            rabbitTemplate.convertAndSend("tracking_exchange", "tracking_routing", event);
        } catch (Exception e) {
            log.error("Failed to send welcome notification: {}", e.getMessage());
        }
    }
}
