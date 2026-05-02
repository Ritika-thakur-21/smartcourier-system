package com.example.demo.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Schema(description = "Address details")
public class AddressRequest {

    @NotBlank(message = "Full name is required")
    @Pattern(
        regexp = "^[A-Za-z][A-Za-z .]{1,48}[A-Za-z.]$",
        message = "Full name must be 3-50 characters, letters and spaces only"
    )
    @Schema(description = "Full name", example = "Raj Kumar")
    private String fullName;

    @NotBlank(message = "Phone number is required")
    @Pattern(
        regexp = "^[6-9]\\d{9}$",
        message = "Phone must be a valid 10-digit Indian mobile number starting with 6-9"
    )
    @Schema(description = "Phone number", example = "9876543210")
    private String phone;

    @NotBlank(message = "Street address is required")
    @Size(min = 3, max = 100, message = "Street address must be between 3 and 100 characters")
    @Schema(description = "Street address", example = "12 MG Road")
    private String street;

    @NotBlank(message = "City is required")
    @Pattern(
        regexp = "^[A-Za-z][A-Za-z ]{1,48}[A-Za-z]$",
        message = "City must contain only letters and spaces"
    )
    @Schema(description = "City", example = "Mumbai")
    private String city;

    @NotBlank(message = "State is required")
    @Pattern(
        regexp = "^[A-Za-z][A-Za-z ]{1,48}[A-Za-z]$",
        message = "State must contain only letters and spaces"
    )
    @Schema(description = "State", example = "Maharashtra")
    private String state;

    @NotBlank(message = "Pincode is required")
    @Pattern(
        regexp = "^[1-9][0-9]{5}$",
        message = "Pincode must be a valid 6-digit Indian postal code"
    )
    @Schema(description = "Pincode", example = "400001")
    private String pincode;

    @NotBlank(message = "Country is required")
    @Pattern(
        regexp = "^[A-Za-z][A-Za-z ]{1,48}[A-Za-z]$",
        message = "Country must contain only letters and spaces"
    )
    @Schema(description = "Country", example = "India")
    private String country;

    // Getters
    public String getFullName() { return fullName; }
    public String getPhone() { return phone; }
    public String getStreet() { return street; }
    public String getCity() { return city; }
    public String getState() { return state; }
    public String getPincode() { return pincode; }
    public String getCountry() { return country; }

    // Setters
    public void setFullName(String fullName) { this.fullName = fullName; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setStreet(String street) { this.street = street; }
    public void setCity(String city) { this.city = city; }
    public void setState(String state) { this.state = state; }
    public void setPincode(String pincode) { this.pincode = pincode; }
    public void setCountry(String country) { this.country = country; }
}