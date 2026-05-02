package com.example.demo.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

@Schema(description = "Tracking event response")
public class TrackingEventResponse {

    @Schema(description = "Event ID", example = "1")
    private Long id;

    @Schema(description = "Tracking number", example = "TRK3A7B9C1D")
    private String trackingNumber;

    @Schema(description = "Status", example = "BOOKED")
    private String status;

    @Schema(description = "Location", example = "Mumbai")
    private String location;

    @Schema(description = "Remarks", example = "Parcel booked")
    private String remarks;

    @Schema(description = "Event time")
    private LocalDateTime eventTime;

    // Getters
    public Long getId() { return id; }
    public String getTrackingNumber() { return trackingNumber; }
    public String getStatus() { return status; }
    public String getLocation() { return location; }
    public String getRemarks() { return remarks; }
    public LocalDateTime getEventTime() { return eventTime; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }
    public void setStatus(String status) { this.status = status; }
    public void setLocation(String location) { this.location = location; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public void setEventTime(LocalDateTime eventTime) { this.eventTime = eventTime; }
}