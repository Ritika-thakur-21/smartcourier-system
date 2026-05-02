package com.example.demo.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Schema(description = "Signup request body")
public class SignupRequest {

    @NotBlank(message = "Name is required")
    @Pattern(
        regexp = "^[A-Za-z][A-Za-z ]{1,48}[A-Za-z]$",
        message = "Name must be 3-50 characters long, contain only letters and spaces, and not start or end with a space"
    )
    @Schema(description = "Full name", example = "Raj Kumar")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be a valid email address (e.g. user@example.com)")
    @Schema(description = "Email address", example = "raj@example.com")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&_#^])[A-Za-z\\d@$!%*?&_#^]{8,}$",
        message = "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&_#^)"
    )
    @Schema(description = "Strong password (min 8 chars, uppercase, lowercase, digit, special char)", example = "Raj@1234")
    private String password;

    @Pattern(
        regexp = "^[6-9]\\d{9}$",
        message = "Phone number must be a valid 10-digit Indian mobile number starting with 6-9"
    )
    @Schema(description = "Phone number", example = "9876543210")
    private String phone;

    @Schema(
        description = "Role",
        example = "CUSTOMER",
        allowableValues = {"CUSTOMER", "ADMIN"}
    )
    private String role;

    // Getters
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public String getPhone() { return phone; }
    public String getRole() { return role; }

    // Setters
    public void setName(String name) { this.name = name; }
    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setRole(String role) { this.role = role; }
}
