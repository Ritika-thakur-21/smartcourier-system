package com.example.demo.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "tracking_events")
public class TrackingEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String trackingNumber;
    private String status;
    private String location;
    private Double latitude;
    private Double longitude;
    private String remarks;
    private LocalDateTime eventTime;

    @PrePersist
    public void prePersist() {
        eventTime = LocalDateTime.now();
    }

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