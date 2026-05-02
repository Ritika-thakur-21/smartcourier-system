package com.example.demo.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(description = "Report response")
public class ReportResponse {

    @Schema(description = "Report period from", example = "2026-01-01")
    private String from;

    @Schema(description = "Report period to", example = "2026-03-31")
    private String to;

    @Schema(description = "Total deliveries in period", example = "150")
    private long totalDeliveries;

    @Schema(description = "Total delivered", example = "120")
    private long totalDelivered;

    @Schema(description = "Total failed", example = "10")
    private long totalFailed;

    @Schema(description = "Total delayed", example = "20")
    private long totalDelayed;

    @Schema(description = "Delivery list")
    private List<DeliveryResponse> deliveries;

    // Getters
    public String getFrom() { return from; }
    public String getTo() { return to; }
    public long getTotalDeliveries() { return totalDeliveries; }
    public long getTotalDelivered() { return totalDelivered; }
    public long getTotalFailed() { return totalFailed; }
    public long getTotalDelayed() { return totalDelayed; }
    public List<DeliveryResponse> getDeliveries() { return deliveries; }

    // Setters
    public void setFrom(String from) { this.from = from; }
    public void setTo(String to) { this.to = to; }
    public void setTotalDeliveries(long totalDeliveries) { this.totalDeliveries = totalDeliveries; }
    public void setTotalDelivered(long totalDelivered) { this.totalDelivered = totalDelivered; }
    public void setTotalFailed(long totalFailed) { this.totalFailed = totalFailed; }
    public void setTotalDelayed(long totalDelayed) { this.totalDelayed = totalDelayed; }
    public void setDeliveries(List<DeliveryResponse> deliveries) { this.deliveries = deliveries; }
}