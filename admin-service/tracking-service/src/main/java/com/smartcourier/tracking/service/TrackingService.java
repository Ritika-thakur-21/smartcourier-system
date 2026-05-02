package com.smartcourier.tracking.service;

import com.smartcourier.tracking.dto.TrackingEventRequest;
import com.smartcourier.tracking.entity.TrackingEvent;
import com.smartcourier.tracking.repository.TrackingEventRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TrackingService {

    private final TrackingEventRepository trackingEventRepository;

    public TrackingService(TrackingEventRepository trackingEventRepository) {
        this.trackingEventRepository = trackingEventRepository;
    }

    // Add a new tracking event
    public TrackingEvent addTrackingEvent(TrackingEventRequest request) {
        TrackingEvent event = new TrackingEvent();
        event.setTrackingNumber(request.getTrackingNumber());
        event.setDeliveryId(request.getDeliveryId());
        event.setStatus(request.getStatus());
        event.setLocation(request.getLocation());
        event.setDescription(request.getDescription());
        event.setUpdatedBy(request.getUpdatedBy());
        event.setEventTime(request.getEventTime());
        return trackingEventRepository.save(event);
    }

    // Get all tracking events by tracking number (full history)
    public List<TrackingEvent> getTrackingHistory(String trackingNumber) {
        return trackingEventRepository.findByTrackingNumberOrderByEventTimeAsc(trackingNumber);
    }

    // Get latest tracking event (current status)
    public Optional<TrackingEvent> getLatestStatus(String trackingNumber) {
        List<TrackingEvent> events = trackingEventRepository.findByTrackingNumberOrderByEventTimeAsc(trackingNumber);
        if (events.isEmpty()) return Optional.empty();
        return Optional.of(events.get(events.size() - 1));
    }

    // Get tracking events by delivery ID
    public List<TrackingEvent> getEventsByDeliveryId(Long deliveryId) {
        return trackingEventRepository.findByDeliveryId(deliveryId);
    }

    // Get all tracking events (Admin)
    public List<TrackingEvent> getAllEvents() {
        return trackingEventRepository.findAll();
    }

    // Delete a tracking event (Admin)
    public void deleteEvent(Long id) {
        trackingEventRepository.deleteById(id);
    }
}
