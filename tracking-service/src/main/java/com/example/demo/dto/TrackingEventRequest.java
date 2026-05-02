package com.example.demo.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Request body for creating a tracking event")
public class TrackingEventRequest {

    @Schema(description = "Parcel tracking number", example = "TRK3A7B9C1D")
    private String trackingNumber;

    @Schema(
        description = "Current delivery status",
        example = "BOOKED",
        allowableValues = {
            "DRAFT", "BOOKED", "PICKED_UP", "IN_TRANSIT",
            "OUT_FOR_DELIVERY", "DELIVERED",
            "DELAYED", "FAILED", "RETURNED"
        }
    )
    private String status;

    @Schema(description = "Current location of parcel", example = "Mumbai")
    private String location;

    @Schema(description = "Optional remarks", example = "Parcel booked successfully")
    private String remarks;

    @Schema(description = "Latitude of location", example = "19.0760")
    private Double latitude;

    @Schema(description = "Longitude of location", example = "72.8777")
    private Double longitude;
    
    @Schema(description = "Customer email for notification", example = "thakurritika361@gmail.com")
    private String email;

    @Schema(description = "Type of recipient", example = "SENDER")
    private String recipientType;

    @Schema(description = "Sender name", example = "John Doe")
    private String senderName;

    @Schema(description = "Receiver name", example = "Jane Doe")
    private String receiverName;
    
    public TrackingEventRequest() {}
    // Getters
    public String getTrackingNumber() { return trackingNumber; }
    public String getStatus() { return status; }
    public String getLocation() { return location; }
    public String getRemarks() { return remarks; }
    public String getEmail() { return email; }
    public String getRecipientType() { return recipientType; }
    public String getSenderName() { return senderName; }
    public String getReceiverName() { return receiverName; }
    public Double getLatitude() { return latitude; }
    public Double getLongitude() { return longitude; }

    // Setters
    public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }
    public void setStatus(String status) { this.status = status; }
    public void setLocation(String location) { this.location = location; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public void setEmail(String email) { this.email = email; }
    public void setRecipientType(String recipientType) { this.recipientType = recipientType; }
    public void setSenderName(String senderName) { this.senderName = senderName; }
    public void setReceiverName(String receiverName) { this.receiverName = receiverName; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
}