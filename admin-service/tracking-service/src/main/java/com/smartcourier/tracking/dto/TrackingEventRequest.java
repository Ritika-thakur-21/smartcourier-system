package com.smartcourier.tracking.dto;

import com.smartcourier.tracking.enums.TrackingStatus;

import java.time.LocalDateTime;

public class TrackingEventRequest {

    private String trackingNumber;
    private Long deliveryId;
    private TrackingStatus status;
    private String location;
    private String description;
    private String updatedBy;
    private LocalDateTime eventTime;

    public TrackingEventRequest() {}

    public String getTrackingNumber() { return trackingNumber; }
    public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }

    public Long getDeliveryId() { return deliveryId; }
    public void setDeliveryId(Long deliveryId) { this.deliveryId = deliveryId; }

    public TrackingStatus getStatus() { return status; }
    public void setStatus(TrackingStatus status) { this.status = status; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }

    public LocalDateTime getEventTime() { return eventTime; }
    public void setEventTime(LocalDateTime eventTime) { this.eventTime = eventTime; }
}
