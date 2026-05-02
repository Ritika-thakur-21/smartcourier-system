package com.example.demo.client;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.DeliveryResponse;

@FeignClient(
	    name = "delivery-service",
	    url = "http://delivery-service:8082",
	    configuration = com.example.demo.config.FeignConfig.class,
	    fallback = DeliveryClientFallback.class
	)
public interface DeliveryClient {

    @GetMapping("/deliveries")
    List<DeliveryResponse> getAllDeliveries();

    @GetMapping(value = "/deliveries", params = "status")
    List<DeliveryResponse> getDeliveriesByStatus(@RequestParam String status);

    @GetMapping("/deliveries/{id}")
    DeliveryResponse getById(@PathVariable Long id);

    @GetMapping(value = "/deliveries", params = {"from", "to"})
    List<DeliveryResponse> getDeliveriesByDate(@RequestParam String from, @RequestParam String to);

    @PutMapping("/deliveries/{id}/status")
    DeliveryResponse updateStatus(@PathVariable Long id, @RequestParam String status);
}