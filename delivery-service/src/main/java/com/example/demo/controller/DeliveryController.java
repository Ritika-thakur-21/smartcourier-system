package com.example.demo.controller;

import com.example.demo.dto.DeliveryRequest;
import com.example.demo.dto.DeliveryResponse;
import com.example.demo.enums.DeliveryStatus;
import com.example.demo.service.DeliveryService;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import com.example.demo.util.JwtUtil;
import java.util.List;

@RestController
@RequestMapping("/deliveries")
public class DeliveryController {

    private final DeliveryService deliveryService;
    private final JwtUtil jwtUtil;

    public DeliveryController(DeliveryService deliveryService, JwtUtil jwtUtil) {
        this.deliveryService = deliveryService;
        this.jwtUtil = jwtUtil;
    }

    // CREATE DELIVERY
    @PostMapping
    public ResponseEntity<DeliveryResponse> create(
            @RequestAttribute(value = "username", required = false) String username,
            @RequestHeader(value = "X-User-Email", required = false) String customerEmail,
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody DeliveryRequest request) {

        String jwt = token.startsWith("Bearer ") ? token.substring(7) : token;
        String role = jwtUtil.extractRole(jwt);

        // Security: If not ADMIN, enforce that customerEmail header matches JWT username
        String email = username;
        if ("ADMIN".equalsIgnoreCase(role)) {
            email = (customerEmail != null && !customerEmail.isEmpty()) ? customerEmail : username;
        } else if (customerEmail != null && !customerEmail.isEmpty() && !customerEmail.equalsIgnoreCase(username)) {
             throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Header email does not match JWT subject");
        }

        if (email == null || email.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User identity missing");
        }

        return ResponseEntity.ok(
                deliveryService.createDelivery(request, email, token)
        );
    }

    // GET MY DELIVERIES
    @GetMapping("/my")
    public ResponseEntity<List<DeliveryResponse>> myDeliveries(
            @RequestAttribute(value = "username", required = false) String username,
            @RequestHeader(value = "X-User-Email", required = false) String customerEmail,
            @RequestHeader("Authorization") String token) {

        String jwt = token.startsWith("Bearer ") ? token.substring(7) : token;
        String role = jwtUtil.extractRole(jwt);

        String email = username;
        if ("ADMIN".equalsIgnoreCase(role)) {
            email = (customerEmail != null && !customerEmail.isEmpty()) ? customerEmail : username;
        } else if (customerEmail != null && !customerEmail.isEmpty() && !customerEmail.equalsIgnoreCase(username)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Header email does not match JWT subject");
        }

        if (email == null || email.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User identity missing");
        }

        return ResponseEntity.ok(
                deliveryService.getByCustomer(email)
        );
    }

    // GET ALL DELIVERIES
    @GetMapping
    public ResponseEntity<List<DeliveryResponse>> getAll(
            @RequestParam(required = false) DeliveryStatus status,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE_TIME) java.time.LocalDateTime from,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE_TIME) java.time.LocalDateTime to) {
        
        if (from != null && to != null) {
            return ResponseEntity.ok(deliveryService.getByDateRange(from, to));
        }

        if (status != null) {
            return ResponseEntity.ok(deliveryService.getByStatus(status));
        }
        
        return ResponseEntity.ok(deliveryService.getAllDeliveries());
    }

    // GET DELIVERY BY ID
    @GetMapping("/{id}")
    public ResponseEntity<DeliveryResponse> getById(
            @PathVariable Long id,
            @RequestAttribute(value = "username", required = false) String username,
            @RequestHeader(value = "X-User-Email", required = false) String customerEmail,
            @RequestHeader("Authorization") String token) {

        DeliveryResponse delivery = deliveryService.getById(id);

        String email = (customerEmail != null && !customerEmail.isEmpty()) ? customerEmail : username;
        String jwt = token.startsWith("Bearer ") ? token.substring(7) : token;
        String role = jwtUtil.extractRole(jwt);

        // Allow access only if it's the owner OR an ADMIN
        if (!"ADMIN".equalsIgnoreCase(role) && !delivery.getCustomerEmail().equalsIgnoreCase(email)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to view this delivery");
        }

        return ResponseEntity.ok(delivery);
    }

    // UPDATE STATUS
    @PutMapping("/{id}/status")
    public ResponseEntity<DeliveryResponse> updateStatus(
            @PathVariable Long id,
            @RequestParam DeliveryStatus status,
            @RequestHeader("Authorization") String token) {

        if (token == null || !token.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing or invalid token");
        }

        String jwt = token.substring(7);
        String role = jwtUtil.extractRole(jwt);

        if (!"ADMIN".equalsIgnoreCase(role)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only ADMIN can update delivery status");
        }

        return ResponseEntity.ok(
                deliveryService.updateStatus(id, status, token)
        );
    }

    // GET BY TRACKING NUMBER (Public)
    @GetMapping("/track/{trackingNumber}")
    public ResponseEntity<DeliveryResponse> getByTrackingNumber(@PathVariable String trackingNumber) {
        return deliveryService.getByTrackingNumber(trackingNumber)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}