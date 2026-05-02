package com.example.demo.service;

import com.example.demo.client.TrackingClient;
import com.example.demo.dto.*;
import com.example.demo.entities.*;
import com.example.demo.enums.DeliveryStatus;
import com.example.demo.exception.DeliveryNotFoundException;
import com.example.demo.repository.DeliveryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class DeliveryService {

    private static final Logger log = LoggerFactory.getLogger(DeliveryService.class);

    private final DeliveryRepository deliveryRepository;
    private final TrackingClient trackingClient;
    private final TrackingEventProducer trackingEventProducer;

    public DeliveryService(DeliveryRepository deliveryRepository,
                           TrackingClient trackingClient,
                           TrackingEventProducer trackingEventProducer) {
        this.deliveryRepository = deliveryRepository;
        this.trackingClient = trackingClient;
        this.trackingEventProducer = trackingEventProducer;
    }

    // CREATE DELIVERY
    public DeliveryResponse createDelivery(DeliveryRequest request, String username, String token) {

        if (username == null || username.isEmpty()) {
            throw new RuntimeException("User missing");
        }

        Address sender = new Address();
        sender.setFullName(request.getSenderAddress().getFullName());
        sender.setPhone(request.getSenderAddress().getPhone());
        sender.setStreet(request.getSenderAddress().getStreet());
        sender.setCity(request.getSenderAddress().getCity());
        sender.setState(request.getSenderAddress().getState());
        sender.setPincode(request.getSenderAddress().getPincode());
        sender.setCountry(request.getSenderAddress().getCountry());

        Address receiver = new Address();
        receiver.setFullName(request.getReceiverAddress().getFullName());
        receiver.setPhone(request.getReceiverAddress().getPhone());
        receiver.setStreet(request.getReceiverAddress().getStreet());
        receiver.setCity(request.getReceiverAddress().getCity());
        receiver.setState(request.getReceiverAddress().getState());
        receiver.setPincode(request.getReceiverAddress().getPincode());
        receiver.setCountry(request.getReceiverAddress().getCountry());

        Delivery delivery = new Delivery();

        delivery.setTrackingNumber("TRK" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());

        delivery.setUsername(username);
        delivery.setCustomerEmail(username);  // sender = logged-in user

        // Receiver email: from request or null
        String receiverEmail = request.getReceiverEmail();
        delivery.setReceiverEmail(receiverEmail);

        delivery.setServiceType(request.getServiceType());
        delivery.setWeight(request.getWeight());
        delivery.setDescription(request.getDescription());
        delivery.setSenderAddress(sender);
        delivery.setReceiverAddress(receiver);
        delivery.setStatus(DeliveryStatus.BOOKED);

        Delivery saved = deliveryRepository.save(delivery);

        // ✅ Tracking-service ko event bhejo (tracking record ke liye)
        try {
            TrackingEventDTO event = new TrackingEventDTO();
            event.setTrackingNumber(saved.getTrackingNumber());
            event.setStatus("BOOKED");
            event.setLocation(saved.getSenderAddress().getCity());
            event.setRemarks("Parcel Created");
            event.setEmail(saved.getCustomerEmail());

            log.info("Sending initial tracking event for: {}", saved.getTrackingNumber());
            trackingClient.createEvent(token, event);
        } catch (Exception e) {
            log.error("Failed to create tracking event for {}: {}", saved.getTrackingNumber(), e.getMessage());
        }

        // ✅ SENDER ko delivery creation notification bhejo (RabbitMQ)
        try {
            String sName = (saved.getSenderAddress() != null) ? saved.getSenderAddress().getFullName() : request.getSenderAddress().getFullName();
            String rName = (saved.getReceiverAddress() != null) ? saved.getReceiverAddress().getFullName() : request.getReceiverAddress().getFullName();

            log.info("📤 Sending notification - Sender: {}, Receiver: {}, To: {}", sName, rName, saved.getCustomerEmail());

            trackingEventProducer.sendNotification(
                saved.getTrackingNumber(),
                "BOOKED",
                saved.getSenderAddress().getCity(),
                "Your delivery has been successfully booked.",
                saved.getCustomerEmail(),
                "SENDER",
                sName,
                rName
            );
            log.info("✅ Sender notification event sent to queue.");
        } catch (Exception e) {
            log.error("❌ Failed to send sender notification: {}", e.getMessage());
        }

        // ✅ RECEIVER ko delivery creation notification bhejo (RabbitMQ) - agar email provided hai
        if (receiverEmail != null && !receiverEmail.isBlank()) {
            try {
                String sName = (saved.getSenderAddress() != null) ? saved.getSenderAddress().getFullName() : request.getSenderAddress().getFullName();
                String rName = (saved.getReceiverAddress() != null) ? saved.getReceiverAddress().getFullName() : request.getReceiverAddress().getFullName();

                log.info("📤 Sending receiver notification - To: {}", receiverEmail);

                trackingEventProducer.sendNotification(
                    saved.getTrackingNumber(),
                    "BOOKED",
                    saved.getSenderAddress().getCity(),
                    "A delivery has been booked for you.",
                    receiverEmail,
                    "RECEIVER",
                    sName,
                    rName
                );
                log.info("✅ Receiver notification event sent to queue.");
            } catch (Exception e) {
                log.error("❌ Failed to send receiver notification: {}", e.getMessage());
            }
        }

        return mapToResponse(saved);
    }

    public DeliveryResponse updateStatus(Long id, DeliveryStatus status, String token) {

        Delivery delivery = deliveryRepository.findById(id)
                .orElseThrow(() -> new DeliveryNotFoundException("Not found"));

        delivery.setStatus(status);

        Delivery updated = deliveryRepository.save(delivery);

        // ✅ Tracking-service ko status update event bhejo
        try {
            TrackingEventDTO event = new TrackingEventDTO();
            event.setTrackingNumber(updated.getTrackingNumber());
            event.setStatus(updated.getStatus().name());
            event.setLocation(updated.getReceiverAddress().getCity());
            event.setRemarks("Status Updated");
            event.setEmail(updated.getCustomerEmail());

            log.info("Sending status update event for: {}", updated.getTrackingNumber());
            trackingClient.createEvent(token, event);

        } catch (Exception e) {
            log.error("Failed to update tracking status for {}: {}", updated.getTrackingNumber(), e.getMessage());
        }

        // ✅ SENDER ko status update notification bhejo
        try {
            trackingEventProducer.sendNotification(
                updated.getTrackingNumber(),
                updated.getStatus().name(),
                updated.getReceiverAddress().getCity(),
                "Aapki delivery ka status update ho gaya hai.",
                updated.getCustomerEmail(),
                "SENDER",
                updated.getSenderAddress().getFullName(),
                updated.getReceiverAddress().getFullName()
            );
            log.info("✅ Sender status-update notification sent to: {}", updated.getCustomerEmail());
        } catch (Exception e) {
            log.error("❌ Failed to send sender status notification: {}", e.getMessage());
        }

        // ✅ RECEIVER ko status update notification bhejo - agar email hai
        if (updated.getReceiverEmail() != null && !updated.getReceiverEmail().isBlank()) {
            try {
                trackingEventProducer.sendNotification(
                    updated.getTrackingNumber(),
                    updated.getStatus().name(),
                    updated.getReceiverAddress().getCity(),
                    "Aapki awaited delivery ka status update ho gaya hai.",
                    updated.getReceiverEmail(),
                    "RECEIVER",
                    updated.getSenderAddress().getFullName(),
                    updated.getReceiverAddress().getFullName()
                );
                log.info("✅ Receiver status-update notification sent to: {}", updated.getReceiverEmail());
            } catch (Exception e) {
                log.error("❌ Failed to send receiver status notification: {}", e.getMessage());
            }
        }

        return mapToResponse(updated);
    }

    public List<DeliveryResponse> getByCustomer(String email) {
        return deliveryRepository.findByCustomerEmail(email)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<DeliveryResponse> getByStatus(DeliveryStatus status) {
        return deliveryRepository.findByStatus(status)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<DeliveryResponse> getByDateRange(java.time.LocalDateTime start, java.time.LocalDateTime end) {
        return deliveryRepository.findByCreatedAtBetween(start, end)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<DeliveryResponse> getAllDeliveries() {
        return deliveryRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public DeliveryResponse getById(Long id) {
        return mapToResponse(deliveryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Delivery not found")));
    }

    public Optional<DeliveryResponse> getByTrackingNumber(String trackingNumber) {
        return deliveryRepository.findByTrackingNumber(trackingNumber)
                .map(this::mapToResponse);
    }

    private DeliveryResponse mapToResponse(Delivery d) {
        DeliveryResponse r = new DeliveryResponse();
        r.setId(d.getId());
        r.setTrackingNumber(d.getTrackingNumber());
        r.setCustomerEmail(d.getCustomerEmail());
        r.setStatus(d.getStatus().name());
        r.setServiceType(d.getServiceType());
        r.setWeight(d.getWeight());
        r.setDescription(d.getDescription());
        r.setSenderCity(d.getSenderAddress().getCity());
        r.setReceiverCity(d.getReceiverAddress().getCity());
        r.setCreatedAt(d.getCreatedAt());
        r.setTrackingStatus(d.getStatus().name());
        return r;
    }
}