package com.example.demo.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Admin dashboard statistics")
public class DashboardStats {

    @Schema(description = "Total deliveries", example = "150")
    private long totalDeliveries;

    @Schema(description = "Booked deliveries", example = "30")
    private long bookedDeliveries;

    @Schema(description = "In transit deliveries", example = "50")
    private long inTransitDeliveries;

    @Schema(description = "Delivered deliveries", example = "60")
    private long deliveredDeliveries;

    @Schema(description = "Failed deliveries", example = "5")
    private long failedDeliveries;

    @Schema(description = "Delayed deliveries", example = "5")
    private long delayedDeliveries;

    // Getters
    public long getTotalDeliveries() { return totalDeliveries; }
    public long getBookedDeliveries() { return bookedDeliveries; }
    public long getInTransitDeliveries() { return inTransitDeliveries; }
    public long getDeliveredDeliveries() { return deliveredDeliveries; }
    public long getFailedDeliveries() { return failedDeliveries; }
    public long getDelayedDeliveries() { return delayedDeliveries; }

    // Setters
    public void setTotalDeliveries(long totalDeliveries) { this.totalDeliveries = totalDeliveries; }
    public void setBookedDeliveries(long bookedDeliveries) { this.bookedDeliveries = bookedDeliveries; }
    public void setInTransitDeliveries(long inTransitDeliveries) { this.inTransitDeliveries = inTransitDeliveries; }
    public void setDeliveredDeliveries(long deliveredDeliveries) { this.deliveredDeliveries = deliveredDeliveries; }
    public void setFailedDeliveries(long failedDeliveries) { this.failedDeliveries = failedDeliveries; }
    public void setDelayedDeliveries(long delayedDeliveries) { this.delayedDeliveries = delayedDeliveries; }
}
