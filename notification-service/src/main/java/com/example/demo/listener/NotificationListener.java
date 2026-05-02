package com.example.demo.listener;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import com.example.demo.dto.TrackingEventDTO;
import com.example.demo.service.EmailService;

@Service
public class NotificationListener {

    private final EmailService emailService;

    public NotificationListener(EmailService emailService) {
        this.emailService = emailService;
    }

    @RabbitListener(queues = "tracking_queue")
    public void receiveEvent(TrackingEventDTO event) {

        System.out.println("RECEIVED NOTIFICATION EVENT for: " + event.getEmail()
                + " | Type: " + event.getRecipientType()
                + " | Status: " + event.getStatus());

        if (event.getEmail() == null || event.getEmail().isBlank()) {
            System.out.println("Email is null/empty — skipping notification.");
            return;
        }

        String subject;
        String body;

        boolean isSender = "SENDER".equalsIgnoreCase(event.getRecipientType());
        boolean isBooking = "BOOKED".equalsIgnoreCase(event.getStatus());
        boolean isVerify = "VERIFY".equalsIgnoreCase(event.getStatus());

        if (isVerify) {
            subject = "Action Required: Please verify your SmartCourier account";
            body = buildVerificationEmail(event);
        } else if (isBooking) {
            if (isSender) {
                subject = "Confirmation: Your shipment has been booked - SmartCourier";
                body = buildSenderBookingEmail(event);
            } else {
                subject = "Shipment Notification: A delivery is scheduled for you - SmartCourier";
                body = buildReceiverBookingEmail(event);
            }
        } else {
            if (isSender) {
                subject = "Status Update: Shipment " + event.getTrackingNumber() + " - SmartCourier";
                body = buildSenderStatusEmail(event);
            } else {
                subject = "Update: Your delivery status has changed - SmartCourier";
                body = buildReceiverStatusEmail(event);
            }
        }

        emailService.sendEmail(event.getEmail(), subject, body);
    }

    // ─── Professional Email Templates (No Emojis) ──────────────────────────

    private String buildSenderBookingEmail(TrackingEventDTO e) {
        return "Dear " + nullSafe(e.getSenderName()) + ",\n\n" +
               "This is to confirm that your shipment has been successfully booked with SmartCourier.\n\n" +
               "Shipment Details:\n" +
               "--------------------------------\n" +
               "Tracking Number : " + e.getTrackingNumber() + "\n" +
               "Pickup City     : " + nullSafe(e.getLocation()) + "\n" +
               "Receiver Name   : " + nullSafe(e.getReceiverName()) + "\n" +
               "Current Status  : " + e.getStatus() + "\n" +
               "--------------------------------\n\n" +
               "You can monitor the progress of your shipment in real-time through the SmartCourier portal using your tracking number.\n\n" +
               "Thank you for choosing SmartCourier.\n\n" +
               "Regards,\n" +
               "Operations Department\n" +
               "SmartCourier Team";
    }

    private String buildReceiverBookingEmail(TrackingEventDTO e) {
        return "Dear " + nullSafe(e.getReceiverName()) + ",\n\n" +
               "We would like to inform you that a shipment addressed to you has been booked and is currently being processed.\n\n" +
               "Shipment Details:\n" +
               "--------------------------------\n" +
               "Tracking Number : " + e.getTrackingNumber() + "\n" +
               "Sender Name     : " + nullSafe(e.getSenderName()) + "\n" +
               "Origin City     : " + nullSafe(e.getLocation()) + "\n" +
               "Current Status  : " + e.getStatus() + "\n" +
               "--------------------------------\n\n" +
               "Please use the tracking number above to check the expected delivery date and transit updates on our website.\n\n" +
               "Regards,\n" +
               "Operations Department\n" +
               "SmartCourier Team";
    }

    private String buildSenderStatusEmail(TrackingEventDTO e) {
        return "Dear " + nullSafe(e.getSenderName()) + ",\n\n" +
               "We are writing to provide a status update regarding your shipment " + e.getTrackingNumber() + ".\n\n" +
               "Update Details:\n" +
               "--------------------------------\n" +
               "New Status      : " + e.getStatus() + "\n" +
               "Current Location: " + nullSafe(e.getLocation()) + "\n" +
               "--------------------------------\n\n" +
               "Further updates will be shared as the shipment progresses towards its destination.\n\n" +
               "Regards,\n" +
               "Operations Department\n" +
               "SmartCourier Team";
    }

    private String buildReceiverStatusEmail(TrackingEventDTO e) {
        return "Dear " + nullSafe(e.getReceiverName()) + ",\n\n" +
               "Please be advised that the status of your expected shipment " + e.getTrackingNumber() + " has been updated.\n\n" +
               "Update Details:\n" +
               "--------------------------------\n" +
               "New Status      : " + e.getStatus() + "\n" +
               "Current Location: " + nullSafe(e.getLocation()) + "\n" +
               "--------------------------------\n\n" +
               "Our team is working to ensure your parcel reaches you as soon as possible.\n\n" +
               "Regards,\n" +
               "Operations Department\n" +
               "SmartCourier Team";
    }

    private String buildVerificationEmail(TrackingEventDTO e) {
        return "Dear " + nullSafe(e.getSenderName()) + ",\n\n" +
               "Welcome to this app please verify yourself.\n\n" +
               "To complete your registration and activate your SmartCourier account, please click the link below (simulated):\n" +
               "http://localhost:5173/verify?email=" + e.getEmail() + "\n\n" +
               "If you did not create this account, please ignore this email.\n\n" +
               "Regards,\n" +
               "Security Team\n" +
               "SmartCourier Team";
    }

    private String nullSafe(String value) {
        return (value != null && !value.isBlank()) ? value : "N/A";
    }
}