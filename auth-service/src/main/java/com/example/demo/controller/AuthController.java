package com.example.demo.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.SignupRequest;
import com.example.demo.dto.UserResponse;
import com.example.demo.dto.JwtResponse;
import com.example.demo.service.AuthService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@Tag(name = "Auth API",
     description = "APIs for registration and authentication")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // 🔐 SIGNUP (ROLE FIXED)
    @Operation(summary = "Register new user (always USER role)")
    @PostMapping("/signup")
    public ResponseEntity<UserResponse> signup(
            @Valid @RequestBody SignupRequest request) {

        // 🔥 Role ignore karo (security)
        request.setRole(null);

        return ResponseEntity.ok(authService.signup(request));
    }

    // 🔐 LOGIN
    @Operation(summary = "Login user and get JWT token")
    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(
            @Valid @RequestBody LoginRequest request) {

        return ResponseEntity.ok(authService.login(request));
    }

    // 🔐 VALIDATE TOKEN
    @Operation(summary = "Validate JWT token")
    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(
            @Parameter(description = "JWT token")
            @RequestParam String token) {

        boolean isValid = authService.validateToken(token);

        if (isValid) {
            return ResponseEntity.ok(Map.of(
                "valid", true,
                "message", "Token is valid"
            ));
        } else {
            return ResponseEntity
                    .status(401)
                    .body(Map.of(
                        "valid", false,
                        "message", "Token is invalid or expired"
                    ));
        }
    }

    // 👥 GET ALL USERS
    @Operation(summary = "Get all users")
    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(authService.getAllUsers());
    }

    // 👤 GET USER BY ID
    @Operation(summary = "Get user by ID")
    @GetMapping("/users/{id}")
    public ResponseEntity<UserResponse> getUserById(
            @Parameter(description = "User ID")
            @PathVariable Long id) {

        return ResponseEntity.ok(authService.getUserById(id));
    }

    // 👑 🔥 MAKE ADMIN (NEW API)
    @Operation(summary = "Make user ADMIN (only admin should use)")
    @PutMapping("/make-admin/{email}")
    public ResponseEntity<?> makeAdmin(
            @PathVariable String email) {

        boolean updated = authService.makeAdmin(email);

        if (updated) {
            return ResponseEntity.ok(Map.of(
                "message", "User is now ADMIN"
            ));
        } else {
            return ResponseEntity.status(404).body(Map.of(
                "message", "User not found"
            ));
        }
    }
}