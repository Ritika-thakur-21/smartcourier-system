package com.example.demo.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;

@Schema(description = "Request body for creating a delivery")
public class DeliveryRequest {

    @Valid
    @NotNull(message = "Sender address is required")
    @Schema(description = "Sender address details", required = true)
    private AddressRequest senderAddress;

    @Valid
    @NotNull(message = "Receiver address is required")
    @Schema(description = "Receiver address details", required = true)
    private AddressRequest receiverAddress;

    @Email(message = "Customer email must be a valid email address (e.g. user@example.com)")
    @Schema(description = "Customer (sender) email for notifications", example = "sender@gmail.com")
    private String customerEmail;

    @Email(message = "Receiver email must be a valid email address (e.g. receiver@example.com)")
    @Schema(description = "Receiver email for delivery notifications", example = "receiver@gmail.com")
    private String receiverEmail;

    @NotBlank(message = "Service type is required")
    @Pattern(
        regexp = "^(DOMESTIC|EXPRESS|INTERNATIONAL)$",
        message = "Service type must be one of: DOMESTIC, EXPRESS, INTERNATIONAL"
    )
    @Schema(
        description = "Type of service",
        example = "EXPRESS",
        allowableValues = {"DOMESTIC", "EXPRESS", "INTERNATIONAL"}
    )
    private String serviceType;

    @NotNull(message = "Weight is required")
    @Positive(message = "Weight must be a positive number (in kg)")
    @Schema(description = "Weight of parcel in kg", example = "2.5")
    private Double weight;

    @Schema(description = "Description of parcel contents", example = "Electronics")
    private String description;

    // getters & setters
    public AddressRequest getSenderAddress() { return senderAddress; }
    public AddressRequest getReceiverAddress() { return receiverAddress; }
    public String getCustomerEmail() { return customerEmail; }
    public String getReceiverEmail() { return receiverEmail; }
    public String getServiceType() { return serviceType; }
    public Double getWeight() { return weight; }
    public String getDescription() { return description; }

    public void setSenderAddress(AddressRequest senderAddress) { this.senderAddress = senderAddress; }
    public void setReceiverAddress(AddressRequest receiverAddress) { this.receiverAddress = receiverAddress; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }
    public void setReceiverEmail(String receiverEmail) { this.receiverEmail = receiverEmail; }
    public void setServiceType(String serviceType) { this.serviceType = serviceType; }
    public void setWeight(Double weight) { this.weight = weight; }
    public void setDescription(String description) { this.description = description; }
}