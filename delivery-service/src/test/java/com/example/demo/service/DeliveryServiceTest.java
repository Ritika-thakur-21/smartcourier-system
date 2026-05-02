package com.example.demo.service;

import com.example.demo.client.TrackingClient;
import com.example.demo.dto.*;
import com.example.demo.entities.*;
import com.example.demo.enums.DeliveryStatus;
import com.example.demo.exception.DeliveryNotFoundException;
import com.example.demo.repository.DeliveryRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class DeliveryServiceTest {

    @Mock
    private DeliveryRepository deliveryRepository;

    @Mock
    private TrackingClient trackingClient;

    @InjectMocks
    private DeliveryService deliveryService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // ================= CREATE DELIVERY =================

    @Test
    void testCreateDelivery_success() {
        DeliveryRequest request = getDummyRequest();

        Delivery saved = getDummyDelivery();

        when(deliveryRepository.save(any())).thenReturn(saved);

        DeliveryResponse response =
                deliveryService.createDelivery(request, "test@mail.com", "token");

        assertNotNull(response);
        assertEquals("BOOKED", response.getStatus());

        verify(deliveryRepository).save(any());
        verify(trackingClient).createEvent(anyString(), any());
    }

    @Test
    void testCreateDelivery_userMissing() {
        DeliveryRequest request = getDummyRequest();

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                deliveryService.createDelivery(request, null, "token")
        );

        assertTrue(ex.getMessage().contains("User missing"));
    }

    @Test
    void testCreateDelivery_trackingFails() {
        DeliveryRequest request = getDummyRequest();

        Delivery saved = getDummyDelivery();

        when(deliveryRepository.save(any())).thenReturn(saved);

        doThrow(new RuntimeException("Tracking failed"))
                .when(trackingClient).createEvent(anyString(), any());

        DeliveryResponse response =
                deliveryService.createDelivery(request, "test@mail.com", "token");

        assertNotNull(response); // catch block covered
    }

    // ================= UPDATE STATUS =================

    @Test
    void testUpdateStatus_success() {
        Delivery delivery = getDummyDelivery();

        when(deliveryRepository.findById(1L))
                .thenReturn(Optional.of(delivery));

        when(deliveryRepository.save(any()))
                .thenReturn(delivery);

        DeliveryResponse response =
                deliveryService.updateStatus(1L, DeliveryStatus.DELIVERED, "token");

        assertEquals("DELIVERED", response.getStatus());

        verify(trackingClient).createEvent(anyString(), any());
    }

    @Test
    void testUpdateStatus_notFound() {
        when(deliveryRepository.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(DeliveryNotFoundException.class, () ->
                deliveryService.updateStatus(1L, DeliveryStatus.DELIVERED, "token")
        );
    }

    @Test
    void testUpdateStatus_trackingFails() {
        Delivery delivery = getDummyDelivery();

        when(deliveryRepository.findById(1L))
                .thenReturn(Optional.of(delivery));

        when(deliveryRepository.save(any()))
                .thenReturn(delivery);

        doThrow(new RuntimeException())
                .when(trackingClient).createEvent(anyString(), any());

        DeliveryResponse response =
                deliveryService.updateStatus(1L, DeliveryStatus.DELIVERED, "token");

        assertNotNull(response);
    }

    // ================= GET METHODS =================

    @Test
    void testGetByCustomer() {
        Delivery d = getDummyDelivery();

        when(deliveryRepository.findByCustomerEmail("test@mail.com"))
                .thenReturn(List.of(d));

        List<DeliveryResponse> result =
                deliveryService.getByCustomer("test@mail.com");

        assertEquals(1, result.size());
    }

    @Test
    void testGetByStatus() {
        Delivery d = getDummyDelivery();
        d.setStatus(DeliveryStatus.DELIVERED);

        when(deliveryRepository.findByStatus(DeliveryStatus.DELIVERED))
                .thenReturn(List.of(d));

        List<DeliveryResponse> result =
                deliveryService.getByStatus(DeliveryStatus.DELIVERED);

        assertEquals(1, result.size());
    }

    @Test
    void testGetAllDeliveries() {
        Delivery d = getDummyDelivery();

        when(deliveryRepository.findAll())
                .thenReturn(List.of(d));

        List<DeliveryResponse> result =
                deliveryService.getAllDeliveries();

        assertEquals(1, result.size());
    }

    @Test
    void testGetById_notFound() {
        when(deliveryRepository.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () ->
                deliveryService.getById(1L)
        );
    }

    @Test
    void testGetById_success() {
        Delivery d = getDummyDelivery();

        when(deliveryRepository.findById(1L))
                .thenReturn(Optional.of(d));

        DeliveryResponse response =
                deliveryService.getById(1L);

        assertNotNull(response);
    }

    // ================= HELPER METHODS =================

    private DeliveryRequest getDummyRequest() {
        AddressRequest sender = new AddressRequest();
        sender.setFullName("A");
        sender.setPhone("123");
        sender.setStreet("Street");
        sender.setCity("Delhi");
        sender.setState("DL");
        sender.setPincode("110001");
        sender.setCountry("India");

        AddressRequest receiver = new AddressRequest();
        receiver.setFullName("B");
        receiver.setPhone("456");
        receiver.setStreet("Street2");
        receiver.setCity("Mumbai");
        receiver.setState("MH");
        receiver.setPincode("400001");
        receiver.setCountry("India");

        DeliveryRequest req = new DeliveryRequest();
        req.setSenderAddress(sender);
        req.setReceiverAddress(receiver);
        req.setServiceType("EXPRESS");
        req.setWeight(2.5);
        req.setDescription("Test parcel");

        return req;
    }

    private Delivery getDummyDelivery() {
        Delivery delivery = new Delivery();
        delivery.setId(1L);
        delivery.setTrackingNumber("TRK123");
        delivery.setCustomerEmail("test@mail.com");
        delivery.setStatus(DeliveryStatus.BOOKED);
        delivery.setServiceType("EXPRESS");
        delivery.setWeight(2.5);
        delivery.setDescription("Test parcel");

        Address sender = new Address();
        sender.setCity("Delhi");

        Address receiver = new Address();
        receiver.setCity("Mumbai");

        delivery.setSenderAddress(sender);
        delivery.setReceiverAddress(receiver);

        return delivery;
    }
}