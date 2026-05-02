package com.smartcourier.delivery.dto;

import com.smartcourier.delivery.enums.DeliveryStatus;

public class StatusUpdateRequest {

    private DeliveryStatus status;
    private String reason;

    public StatusUpdateRequest() {}

    public DeliveryStatus getStatus() { return status; }
    public void setStatus(DeliveryStatus status) { this.status = status; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
