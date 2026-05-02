package com.example.demo.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Request to resolve a delivery exception")
public class ResolveRequest {

    @Schema(
        description = "New status after resolution",
        example = "IN_TRANSIT",
        allowableValues = {
            "IN_TRANSIT", "OUT_FOR_DELIVERY",
            "DELIVERED", "RETURNED"
        }
    )
    private String status;

    @Schema(description = "Remarks about resolution", example = "Address corrected and rescheduled")
    private String remarks;

    // Getters
    public String getStatus() { return status; }
    public String getRemarks() { return remarks; }

    // Setters
    public void setStatus(String status) { this.status = status; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
