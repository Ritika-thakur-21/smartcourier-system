package com.example.demo.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

import com.example.demo.dto.TrackingEventDTO;

@FeignClient(name = "TRACKING-SERVICE", fallback = TrackingClientFallback.class)
public interface TrackingClient {

    @PostMapping("/tracking/events")
    void createEvent(
        @RequestHeader("Authorization") String token,
        @RequestBody TrackingEventDTO request
    );
}