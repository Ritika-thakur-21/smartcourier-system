package com.example.demo.client;

import org.springframework.stereotype.Component;
import com.example.demo.dto.TrackingEventDTO;

@Component
public class TrackingClientFallback implements TrackingClient {

	@Override
	public void createEvent(String token, TrackingEventDTO request) {
	    System.out.println("Tracking service down, fallback triggered");
	}
}