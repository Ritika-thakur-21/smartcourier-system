package com.example.demo.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.*;
import com.example.demo.service.AdminService;

import java.util.List;

@RestController
@RequestMapping("/admin")
@Tag(name = "Admin API", description = "APIs for admin monitoring and management")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @Operation(summary = "Get dashboard statistics")
    @ApiResponse(responseCode = "200", description = "Stats fetched successfully")
    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStats> getDashboard() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @Operation(summary = "Get all deliveries")
    @GetMapping("/deliveries")
    public ResponseEntity<List<DeliveryResponse>> getAllDeliveries(
            @Parameter(
                description = "Filter by delivery status",
                example = "BOOKED",
                schema = @Schema(allowableValues = {
                    "DRAFT", "BOOKED", "PICKED_UP", "IN_TRANSIT",
                    "OUT_FOR_DELIVERY", "DELIVERED",
                    "DELAYED", "FAILED", "RETURNED"
                })
            )
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to) {

        return ResponseEntity.ok(adminService.getAllDeliveries(status, from, to));
    }

    @Operation(summary = "Get delivery by ID")
    @GetMapping("/deliveries/{id}")
    public ResponseEntity<DeliveryResponse> getDeliveryById(
            @Parameter(description = "Delivery ID", example = "1")
            @PathVariable Long id) {

        return ResponseEntity.ok(adminService.getDeliveryById(id));
    }

    @Operation(summary = "Get tracking events by tracking number")
    @GetMapping("/tracking/{trackingNumber}")
    public ResponseEntity<List<TrackingEventResponse>> getTrackingEvents(
            @Parameter(description = "Tracking number", example = "TRK123ABC")
            @PathVariable String trackingNumber) {

        return ResponseEntity.ok(adminService.getTrackingEvents(trackingNumber));
    }

    @Operation(summary = "Resolve delivery exception")
    @PutMapping("/deliveries/{id}/resolve")
    public ResponseEntity<DeliveryResponse> resolveException(
            @PathVariable Long id,
            @RequestBody ResolveRequest request) {

        return ResponseEntity.ok(adminService.resolveException(id, request));
    }

    @Operation(summary = "Generate delivery report")
    @GetMapping("/reports")
    public ResponseEntity<ReportResponse> getReports(
            @RequestParam String from,
            @RequestParam String to) {

        return ResponseEntity.ok(adminService.generateReport(from, to));
    }
}