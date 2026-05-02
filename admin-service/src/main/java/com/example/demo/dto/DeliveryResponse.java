package com.example.demo.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

@Schema(description = "Delivery details")
public class DeliveryResponse {

    @Schema(description = "Delivery ID", example = "1")
    private Long id;

    @Schema(description = "Tracking number", example = "TRK3A7B9C1D")
    private String trackingNumber;

    @Schema(description = "Customer email", example = "raj@example.com")
    private String customerEmail;

    @Schema(description = "Delivery status", example = "BOOKED")
    private String status;

    @Schema(description = "Service type", example = "EXPRESS")
    private String serviceType;

    @Schema(description = "Weight in kg", example = "2.5")
    private Double weight;

    @Schema(description = "Description", example = "Electronics")
    private String description;

    @Schema(description = "Sender city", example = "Mumbai")
    private String senderCity;

    @Schema(description = "Receiver city", example = "Delhi")
    private String receiverCity;

    @Schema(description = "Created at")
    private LocalDateTime createdAt;

    // Getters
    public Long getId() { return id; }
    public String getTrackingNumber() { return trackingNumber; }
    public String getCustomerEmail() { return customerEmail; }
    public String getStatus() { return status; }
    public String getServiceType() { return serviceType; }
    public Double getWeight() { return weight; }
    public String getDescription() { return description; }
    public String getSenderCity() { return senderCity; }
    public String getReceiverCity() { return receiverCity; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }
    public void setStatus(String status) { this.status = status; }
    public void setServiceType(String serviceType) { this.serviceType = serviceType; }
    public void setWeight(Double weight) { this.weight = weight; }
    public void setDescription(String description) { this.description = description; }
    public void setSenderCity(String senderCity) { this.senderCity = senderCity; }
    public void setReceiverCity(String receiverCity) { this.receiverCity = receiverCity; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}