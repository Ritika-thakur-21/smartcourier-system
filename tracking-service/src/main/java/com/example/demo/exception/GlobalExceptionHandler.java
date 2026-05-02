package com.example.demo.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.dao.IncorrectResultSizeDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({TrackingNotFoundException.class, DocumentNotFoundException.class})
    public ResponseEntity<ErrorResponse> handleNotFound(
            RuntimeException ex,
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

    @ExceptionHandler(DuplicateProofException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateProof(
            DuplicateProofException ex,
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

    @ExceptionHandler(IncorrectResultSizeDataAccessException.class)
    public ResponseEntity<ErrorResponse> handleNonUnique(
            IncorrectResultSizeDataAccessException ex,
            HttpServletRequest request) {

        return new ResponseEntity<>(
                new ErrorResponse(
                        "Multiple proofs found for same delivery",
                        HttpStatus.CONFLICT.value(),
                        request.getRequestURI()
                ),
                HttpStatus.CONFLICT
        );
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
