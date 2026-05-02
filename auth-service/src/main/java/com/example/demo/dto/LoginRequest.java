package com.example.demo.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "Login request body")
public class LoginRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be a valid email address (e.g. user@example.com)")
    @Schema(description = "Email address", example = "raj@example.com")
    private String email;

    @NotBlank(message = "Password is required")
    @Schema(description = "Password", example = "Raj@1234")
    private String password;

    // Getters
    public String getEmail() { return email; }
    public String getPassword() { return password; }

    // Setters
    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }
}