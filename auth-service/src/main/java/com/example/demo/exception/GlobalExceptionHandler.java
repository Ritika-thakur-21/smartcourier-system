package com.example.demo.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserNotFound(
            UserNotFoundException ex,
            HttpServletRequest request) {

        return new ResponseEntity<>(
                new ErrorResponse(
                        ex.getMessage(),
                        HttpStatus.NOT_FOUND.value(),
                        request.getRequestURI()
                ),
                HttpStatus.NOT_FOUND
        );
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleUserExists(
            UserAlreadyExistsException ex,
            HttpServletRequest request) {

        return new ResponseEntity<>(
                new ErrorResponse(
                        ex.getMessage(),
                        HttpStatus.CONFLICT.value(),
                        request.getRequestURI()
                ),
                HttpStatus.CONFLICT
        );
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleInvalidCredentials(
            InvalidCredentialsException ex,
            HttpServletRequest request) {

        return new ResponseEntity<>(
                new ErrorResponse(
                        ex.getMessage(),
                        HttpStatus.UNAUTHORIZED.value(),
                        request.getRequestURI()
                ),
                HttpStatus.UNAUTHORIZED
        );
    }

    @ExceptionHandler(org.springframework.web.bind.MethodArgumentNotValidException.class)
    public ResponseEntity<java.util.Map<String, Object>> handleValidation(
            org.springframework.web.bind.MethodArgumentNotValidException ex,
            HttpServletRequest request) {

        java.util.Map<String, String> fieldErrors = new java.util.LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(e ->
                fieldErrors.put(e.getField(), e.getDefaultMessage())
        );

        java.util.Map<String, Object> response = new java.util.LinkedHashMap<>();
        response.put("status", HttpStatus.BAD_REQUEST.value());
        response.put("error", "Validation Failed");
        response.put("path", request.getRequestURI());
        response.put("errors", fieldErrors);

        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobal(
            Exception ex,
            HttpServletRequest request) {

        return new ResponseEntity<>(
                new ErrorResponse(
                        ex.getMessage(),
                        HttpStatus.INTERNAL_SERVER_ERROR.value(),
                        request.getRequestURI()
                ),
                HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
}