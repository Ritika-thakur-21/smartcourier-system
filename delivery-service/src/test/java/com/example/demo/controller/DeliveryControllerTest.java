package com.example.demo.controller;

import com.example.demo.dto.DeliveryRequest;
import com.example.demo.dto.DeliveryResponse;
import com.example.demo.enums.DeliveryStatus;
import com.example.demo.service.DeliveryService;
import com.example.demo.util.JwtUtil;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class DeliveryControllerTest {

    @Mock
    private DeliveryService deliveryService;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private DeliveryController deliveryController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateDelivery_success() {
        DeliveryRequest request = new DeliveryRequest();
        DeliveryResponse response = new DeliveryResponse();

        when(deliveryService.createDelivery(any(), anyString(), anyString()))
                .thenReturn(response);

        ResponseEntity<DeliveryResponse> result =
                deliveryController.create("test@mail.com", "test@mail.com", "Bearer token", request);

        assertNotNull(result);
        assertEquals(response, result.getBody());

        verify(deliveryService, times(1))
                .createDelivery(request, "test@mail.com", "Bearer token");
    }
    @Test
    void testCreateDelivery_missingEmail() {
        DeliveryRequest request = new DeliveryRequest();

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                deliveryController.create(null, null, "Bearer token", request)
        );

        assertTrue(ex.getMessage().contains("X-User-Email"));
    }

    @Test
    void testMyDeliveries_success() {
        List<DeliveryResponse> list = new ArrayList<>();
        list.add(new DeliveryResponse());

        when(deliveryService.getByCustomer("test@mail.com"))
                .thenReturn(list);

        ResponseEntity<List<DeliveryResponse>> result =
                deliveryController.myDeliveries("test@mail.com", "test@mail.com", "Bearer token");

        assertEquals(1, result.getBody().size());
        verify(deliveryService).getByCustomer("test@mail.com");
    }

    @Test
    void testMyDeliveries_missingEmail() {
        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                deliveryController.myDeliveries(null, null, "Bearer token")
        );

        assertTrue(ex.getMessage().contains("X-User-Email"));
    }

    @Test
    void testGetAll_withStatus() {
        List<DeliveryResponse> list = List.of(new DeliveryResponse());

        when(deliveryService.getByStatus(DeliveryStatus.DELIVERED)).thenReturn(list);

        ResponseEntity<List<DeliveryResponse>> result =
                deliveryController.getAll(DeliveryStatus.DELIVERED, null, null);

        assertEquals(1, result.getBody().size());
        verify(deliveryService).getByStatus(DeliveryStatus.DELIVERED);
    }

    @Test
    void testGetAll_withoutStatus() {
        List<DeliveryResponse> list = List.of(new DeliveryResponse());

        when(deliveryService.getAllDeliveries()).thenReturn(list);

        ResponseEntity<List<DeliveryResponse>> result =
                deliveryController.getAll(null, null, null);

        assertEquals(1, result.getBody().size());
        verify(deliveryService).getAllDeliveries();
    }

    @Test
    void testGetById_ownerSuccess() {
        DeliveryResponse response = new DeliveryResponse();
        response.setCustomerEmail("owner@mail.com");

        when(deliveryService.getById(1L)).thenReturn(response);
        when(jwtUtil.extractRole(anyString())).thenReturn("USER");

        ResponseEntity<DeliveryResponse> result =
                deliveryController.getById(1L, "owner@mail.com", "owner@mail.com", "Bearer token");

        assertEquals(response, result.getBody());
        verify(deliveryService).getById(1L);
    }

    @Test
    void testGetById_adminSuccess() {
        DeliveryResponse response = new DeliveryResponse();
        response.setCustomerEmail("owner@mail.com");

        when(deliveryService.getById(1L)).thenReturn(response);
        when(jwtUtil.extractRole(anyString())).thenReturn("ADMIN");

        ResponseEntity<DeliveryResponse> result =
                deliveryController.getById(1L, "admin@mail.com", "admin@mail.com", "Bearer token");

        assertEquals(response, result.getBody());
        verify(deliveryService).getById(1L);
    }

    @Test
    void testGetById_unauthorized() {
        DeliveryResponse response = new DeliveryResponse();
        response.setCustomerEmail("owner@mail.com");

        when(deliveryService.getById(1L)).thenReturn(response);
        when(jwtUtil.extractRole(anyString())).thenReturn("USER");

        assertThrows(ResponseStatusException.class, () ->
                deliveryController.getById(1L, "other@mail.com", "other@mail.com", "Bearer token")
        );
    }

    @Test
    void testUpdateStatus_success() {
        DeliveryResponse response = new DeliveryResponse();

        when(jwtUtil.extractRole(anyString())).thenReturn("ADMIN");
        when(deliveryService.updateStatus(anyLong(), any(DeliveryStatus.class), anyString()))
                .thenReturn(response);

        ResponseEntity<DeliveryResponse> result =
                deliveryController.updateStatus(1L, DeliveryStatus.DELIVERED, "Bearer token");

        assertEquals(response, result.getBody());

        verify(jwtUtil).extractRole("token");
        verify(deliveryService).updateStatus(1L, DeliveryStatus.DELIVERED, "Bearer token");
    }

    @Test
    void testUpdateStatus_invalidToken() {
        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () ->
                deliveryController.updateStatus(1L, DeliveryStatus.DELIVERED, "invalidToken")
        );

        assertEquals(401, ex.getStatusCode().value());
    }

    @Test
    void testUpdateStatus_notAdmin() {
        when(jwtUtil.extractRole(anyString())).thenReturn("USER");

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () ->
                deliveryController.updateStatus(1L, DeliveryStatus.DELIVERED, "Bearer token")
        );

        assertEquals(403, ex.getStatusCode().value());
    }
}