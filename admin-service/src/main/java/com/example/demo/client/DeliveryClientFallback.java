package com.example.demo.client;

import org.springframework.stereotype.Component;
import com.example.demo.dto.DeliveryResponse;

import java.util.List;

@Component
public class DeliveryClientFallback implements DeliveryClient {

    @Override
    public List<DeliveryResponse> getAllDeliveries() {
        System.err.println("Delivery service down — getAllDeliveries fallback");

        DeliveryResponse res = new DeliveryResponse();
        res.setStatus("Delivery service is DOWN");

        return List.of(res);
    }

    @Override
    public List<DeliveryResponse> getDeliveriesByStatus(String status) {
        System.err.println("Delivery service down — getDeliveriesByStatus fallback");

        DeliveryResponse res = new DeliveryResponse();
        res.setStatus("Delivery service is DOWN");

        return List.of(res);
    }

    @Override
    public DeliveryResponse getById(Long id) {
        System.err.println("Delivery service down — getById fallback");

        DeliveryResponse res = new DeliveryResponse();
        res.setStatus("Delivery service is DOWN");

        return res; 
    }

    @Override
    public List<DeliveryResponse> getDeliveriesByDate(String from, String to) {
        System.err.println("Delivery service down — getDeliveriesByDate fallback");

        DeliveryResponse res = new DeliveryResponse();
        res.setStatus("Delivery service is DOWN");

        return List.of(res);
    }

    @Override
    public DeliveryResponse updateStatus(Long id, String status) {
        System.err.println("Delivery service down — updateStatus fallback");

        DeliveryResponse res = new DeliveryResponse();
        res.setStatus("Delivery service is DOWN");

        return res; 
    }
}