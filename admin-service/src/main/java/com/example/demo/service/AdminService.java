package com.example.demo.service;

import org.springframework.stereotype.Service;

import com.example.demo.client.DeliveryClient;
import com.example.demo.client.TrackingClient;
import com.example.demo.dto.*;
import com.example.demo.exception.DashboardException;
import com.example.demo.exception.ReportNotFoundException;
import com.example.demo.exception.ResolveException;

import java.util.List;

@Service
public class AdminService {

    private final DeliveryClient deliveryClient;
    private final TrackingClient trackingClient;

    public AdminService(DeliveryClient deliveryClient,
                        TrackingClient trackingClient) {
        this.deliveryClient = deliveryClient;
        this.trackingClient = trackingClient;
    }
    
    public DashboardStats getDashboardStats() {

        List<DeliveryResponse> all = deliveryClient.getAllDeliveries();

        if (all == null) {
            throw new DashboardException("Unable to fetch dashboard data");
        }

        //fallback case handle
        if (isFallbackResponse(all)) {
            DashboardStats stats = new DashboardStats();
            stats.setTotalDeliveries(0);
            return stats;
        }

        DashboardStats stats = new DashboardStats();
        stats.setTotalDeliveries(all.size());
        stats.setBookedDeliveries(countByStatus(all, "BOOKED"));
        stats.setInTransitDeliveries(countByStatus(all, "IN_TRANSIT"));
        stats.setDeliveredDeliveries(countByStatus(all, "DELIVERED"));
        stats.setFailedDeliveries(countByStatus(all, "FAILED"));
        stats.setDelayedDeliveries(countByStatus(all, "DELAYED"));

        return stats;
    }

    public List<DeliveryResponse> getAllDeliveries(String status, String from, String to) {

        List<DeliveryResponse> result;

        if (from != null && to != null && !from.isBlank() && !to.isBlank()) {
            result = deliveryClient.getDeliveriesByDate(from, to);
        } else if (status != null && !status.isBlank()) {
            result = deliveryClient.getDeliveriesByStatus(status);
        } else {
            result = deliveryClient.getAllDeliveries();
        }

        if (result == null) {
            throw new DashboardException("Unable to fetch deliveries");
        }

        return result;
    }

    public DeliveryResponse getDeliveryById(Long id) {

        if (id == null || id <= 0) {
            throw new DashboardException("Invalid delivery ID");
        }

        DeliveryResponse res = deliveryClient.getById(id);

        if (res == null) {
            throw new ReportNotFoundException("Delivery not found with id: " + id);
        }

        return res;
    }

    public List<TrackingEventResponse> getTrackingEvents(String trackingNumber) {

        if (trackingNumber == null || trackingNumber.isBlank()) {
            throw new DashboardException("Tracking number cannot be empty");
        }

        List<TrackingEventResponse> events =
                trackingClient.getEvents(trackingNumber);

        if (events == null) {
            throw new DashboardException("Unable to fetch tracking events");
        }

        return events;
    }

    public DeliveryResponse resolveException(Long id, ResolveRequest request) {

        if (id == null || id <= 0) {
            throw new ResolveException("Invalid delivery ID");
        }

        if (request == null || request.getStatus() == null) {
            throw new ResolveException("Invalid resolve request");
        }

        DeliveryResponse res =
                deliveryClient.updateStatus(id, request.getStatus());

        if (res == null) {
            throw new ResolveException("Failed to resolve delivery issue");
        }

        return res;
    }
    
    public ReportResponse generateReport(String from, String to) {

        List<DeliveryResponse> all = deliveryClient.getAllDeliveries();

        if (all == null) {
            throw new ReportNotFoundException("Unable to generate report");
        }

        ReportResponse report = new ReportResponse();
        report.setFrom(from);
        report.setTo(to);

        if (isFallbackResponse(all)) {
            report.setTotalDeliveries(0);
            report.setDeliveries(all);
            return report;
        }

        report.setTotalDeliveries(all.size());
        report.setTotalDelivered(countByStatus(all, "DELIVERED"));
        report.setTotalFailed(countByStatus(all, "FAILED"));
        report.setTotalDelayed(countByStatus(all, "DELAYED"));
        report.setDeliveries(all);

        return report;
    }

    private long countByStatus(List<DeliveryResponse> list, String status) {
        return list.stream()
                .filter(d -> d.getStatus() != null)
                .filter(d -> status.equalsIgnoreCase(d.getStatus()))
                .count();
    }

    private boolean isFallbackResponse(List<DeliveryResponse> list) {
        return list != null &&
               !list.isEmpty() &&
               list.get(0).getStatus() != null &&
               list.get(0).getStatus().contains("DOWN");
    }
}