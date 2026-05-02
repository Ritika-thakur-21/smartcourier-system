package com.example.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entities.Delivery;
import com.example.demo.enums.DeliveryStatus;

public interface DeliveryRepository extends JpaRepository<Delivery, Long> {

    List<Delivery> findByCustomerEmail(String email);

    Optional<Delivery> findByTrackingNumber(String trackingNumber);

    List<Delivery> findByStatus(DeliveryStatus status);

    List<Delivery> findByCreatedAtBetween(java.time.LocalDateTime start, java.time.LocalDateTime end);
}