package com.example.demo.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.example.demo.dto.TrackingEventResponse;

import java.util.List;

@FeignClient(name = "TRACKING-SERVICE", fallback = TrackingClientFallback.class)
public interface TrackingClient {

    @GetMapping("/tracking/{trackingNumber}")
    List<TrackingEventResponse> getEvents(@PathVariable String trackingNumber);
}