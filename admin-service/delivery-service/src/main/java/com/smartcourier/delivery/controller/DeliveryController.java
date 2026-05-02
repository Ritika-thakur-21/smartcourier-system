package com.smartcourier.delivery.controller;

import com.smartcourier.delivery.dto.DeliveryRequest;
import com.smartcourier.delivery.dto.StatusUpdateRequest;
import com.smartcourier.delivery.entity.Delivery;
import com.smartcourier.delivery.enums.DeliveryStatus;
import com.smartcourier.delivery.service.DeliveryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/deliveries")
@CrossOrigin(origins = "*")
public class DeliveryController {

    private final DeliveryService deliveryService;

    public DeliveryController(DeliveryService deliveryService) {
        this.deliveryService = deliveryService;
    }

    // POST /deliveries - Create delivery (Customer)
    @PostMapping
    public ResponseEntity<Delivery> createDelivery(@RequestBody DeliveryRequest request) {
        Delivery delivery = deliveryService.createDelivery(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(delivery);
    }

    // GET /deliveries/{id} - Get delivery by ID
    @GetMapping("/{id}")
    public ResponseEntity<Delivery> getDeliveryById(@PathVariable Long id) {
        return deliveryService.getDeliveryById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /deliveries/track/{trackingNumber} - Track by tracking number
    @GetMapping("/track/{trackingNumber}")
    public ResponseEntity<Delivery> getByTrackingNumber(@PathVariable String trackingNumber) {
        return deliveryService.getDeliveryByTrackingNumber(trackingNumber)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /deliveries/my?customerId=1 - Get customer deliveries
    @GetMapping("/my")
    public ResponseEntity<List<Delivery>> getMyDeliveries(@RequestParam Long customerId) {
        List<Delivery> deliveries = deliveryService.getDeliveriesByCustomer(customerId);
        return ResponseEntity.ok(deliveries);
    }

    // GET /deliveries - Get all deliveries (Admin)
    @GetMapping
    public ResponseEntity<List<Delivery>> getAllDeliveries() {
        return ResponseEntity.ok(deliveryService.getAllDeliveries());
    }

    // GET /deliveries/status/{status} - Get by status (Admin)
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Delivery>> getByStatus(@PathVariable DeliveryStatus status) {
        return ResponseEntity.ok(deliveryService.getDeliveriesByStatus(status));
    }

    // PUT /deliveries/{id}/book - Book a delivery (Customer: DRAFT -> BOOKED)
    @PutMapping("/{id}/book")
    public ResponseEntity<Delivery> bookDelivery(@PathVariable Long id) {
        try {
            Delivery delivery = deliveryService.bookDelivery(id);
            return ResponseEntity.ok(delivery);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // PUT /deliveries/{id}/status - Update status (Admin/System)
    @PutMapping("/{id}/status")
    public ResponseEntity<Delivery> updateStatus(@PathVariable Long id,
                                                  @RequestBody StatusUpdateRequest request) {
        try {
            Delivery delivery = deliveryService.updateStatus(id, request);
            return ResponseEntity.ok(delivery);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE /deliveries/{id} - Delete delivery (Admin)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDelivery(@PathVariable Long id) {
        deliveryService.deleteDelivery(id);
        return ResponseEntity.noContent().build();
    }
}
