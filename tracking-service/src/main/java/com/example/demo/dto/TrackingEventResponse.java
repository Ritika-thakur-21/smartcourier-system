package com.example.demo.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

@Schema(description = "Tracking event response")
public class TrackingEventResponse {

    @Schema(description = "Event ID", example = "1")
    private Long id;

    @Schema(description = "Parcel tracking number", example = "TRK3A7B9C1D")
    private String trackingNumber;

    @Schema(description = "Delivery status at this event", example = "BOOKED")
    private String status;

    @Schema(description = "Location at this event", example = "Mumbai")
    private String location;

    @Schema(description = "Latitude of location", example = "19.0760")
    private Double latitude;

    @Schema(description = "Longitude of location", example = "72.8777")
    private Double longitude;

    @Schema(description = "Remarks", example = "Parcel booked successfully")
    private String remarks;

    @Schema(description = "Event timestamp", example = "2026-03-23T12:00:00")
    private LocalDateTime eventTime;

    // Getters
    public Long getId() { return id; }
    public String getTrackingNumber() { return trackingNumber; }
    public String getStatus() { return status; }
    public String getLocation() { return location; }
    public Double getLatitude() { return latitude; }
    public Double getLongitude() { return longitude; }
    public String getRemarks() { return remarks; }
    public LocalDateTime getEventTime() { return eventTime; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }
    public void setStatus(String status) { this.status = status; }
    public void setLocation(String location) { this.location = location; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public void setEventTime(LocalDateTime eventTime) { this.eventTime = eventTime; }
}