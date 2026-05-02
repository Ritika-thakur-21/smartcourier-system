package com.example.demo.dto;

public class TrackingEventDTO {
    private String trackingNumber;
    private String status;
    private String location;
    private String remarks;
    private String email;
    private String recipientType;
    private String senderName;
    private String receiverName;

    public TrackingEventDTO() {}

    public TrackingEventDTO(String trackingNumber, String status, String location, String remarks, String email, String recipientType, String senderName, String receiverName) {
        this.trackingNumber = trackingNumber;
        this.status = status;
        this.location = location;
        this.remarks = remarks;
        this.email = email;
        this.recipientType = recipientType;
        this.senderName = senderName;
        this.receiverName = receiverName;
    }

    // Getters and Setters
    public String getTrackingNumber() { return trackingNumber; }
    public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getRecipientType() { return recipientType; }
    public void setRecipientType(String recipientType) { this.recipientType = recipientType; }
    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }
    public String getReceiverName() { return receiverName; }
    public void setReceiverName(String receiverName) { this.receiverName = receiverName; }
}
