package com.example.demo.client;

import org.springframework.stereotype.Component;
import com.example.demo.dto.TrackingEventResponse;

import java.util.List;

@Component
public class TrackingClientFallback implements TrackingClient {

    @Override
    public List<TrackingEventResponse> getEvents(String trackingNumber) {
        System.err.println("Tracking service down — fallback");

        TrackingEventResponse res = new TrackingEventResponse();
        res.setStatus("Tracking service is DOWN");

        return List.of(res);
    }
}