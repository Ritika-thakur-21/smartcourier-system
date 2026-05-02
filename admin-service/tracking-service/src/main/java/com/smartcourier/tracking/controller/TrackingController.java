package com.smartcourier.tracking.controller;

import com.smartcourier.tracking.dto.TrackingEventRequest;
import com.smartcourier.tracking.entity.TrackingEvent;
import com.smartcourier.tracking.service.TrackingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tracking")
@CrossOrigin(origins = "*")
public class TrackingController {

    private final TrackingService trackingService;

    public TrackingController(TrackingService trackingService) {
        this.trackingService = trackingService;
    }

    // POST /tracking/events - Add tracking event (Admin/System)
    @PostMapping("/events")
    public ResponseEntity<TrackingEvent> addEvent(@RequestBody TrackingEventRequest request) {
        TrackingEvent event = trackingService.addTrackingEvent(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(event);
    }

    // GET /tracking/{trackingNumber} - Get full tracking history (Customer)
    @GetMapping("/{trackingNumber}")
    public ResponseEntity<List<TrackingEvent>> getTrackingHistory(@PathVariable String trackingNumber) {
        List<TrackingEvent> events = trackingService.getTrackingHistory(trackingNumber);
        return ResponseEntity.ok(events);
    }

    // GET /tracking/{trackingNumber}/status - Get latest status only
    @GetMapping("/{trackingNumber}/status")
    public ResponseEntity<TrackingEvent> getLatestStatus(@PathVariable String trackingNumber) {
        return trackingService.getLatestStatus(trackingNumber)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /tracking/delivery/{deliveryId} - Get events by delivery ID
    @GetMapping("/delivery/{deliveryId}")
    public ResponseEntity<List<TrackingEvent>> getEventsByDeliveryId(@PathVariable Long deliveryId) {
        List<TrackingEvent> events = trackingService.getEventsByDeliveryId(deliveryId);
        return ResponseEntity.ok(events);
    }

    // GET /tracking - Get all events (Admin)
    @GetMapping
    public ResponseEntity<List<TrackingEvent>> getAllEvents() {
        return ResponseEntity.ok(trackingService.getAllEvents());
    }

    // DELETE /tracking/events/{id} - Delete event (Admin)
    @DeleteMapping("/events/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        trackingService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }
}
