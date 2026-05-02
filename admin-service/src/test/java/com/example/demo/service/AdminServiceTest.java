package com.example.demo.service;


import com.example.demo.client.DeliveryClient;
import com.example.demo.client.TrackingClient;
import com.example.demo.dto.*;
import com.example.demo.exception.*;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminServiceTest {

    @Mock
    private DeliveryClient deliveryClient;

    @Mock
    private TrackingClient trackingClient;

    @InjectMocks
    private AdminService adminService;

    // helper
    private DeliveryResponse createDelivery(String status) {
        DeliveryResponse d = new DeliveryResponse();
        d.setStatus(status);
        return d;
    }

    // DASHBOARD
    @Test
    void testGetDashboardStats() {

        List<DeliveryResponse> list = List.of(
                createDelivery("BOOKED"),
                createDelivery("DELIVERED"),
                createDelivery("FAILED")
        );

        when(deliveryClient.getAllDeliveries()).thenReturn(list);

        DashboardStats stats = adminService.getDashboardStats();

        assertEquals(3, stats.getTotalDeliveries());
    }

    // DASHBOARD NULL
    @Test
    void testGetDashboardStats_Null() {

        when(deliveryClient.getAllDeliveries()).thenReturn(null);

        assertThrows(DashboardException.class,
                () -> adminService.getDashboardStats());
    }

    // GET ALL
    @Test
    void testGetAllDeliveries() {

        when(deliveryClient.getAllDeliveries())
                .thenReturn(List.of(new DeliveryResponse()));

        List<DeliveryResponse> result =
                adminService.getAllDeliveries(null, null, null);

        assertEquals(1, result.size());
    }

    //  GET ALL WITH STATUS
    @Test
    void testGetAllDeliveries_WithStatus() {

        when(deliveryClient.getDeliveriesByStatus("BOOKED"))
                .thenReturn(List.of(new DeliveryResponse()));

        List<DeliveryResponse> result =
                adminService.getAllDeliveries("BOOKED", null, null);

        assertEquals(1, result.size());
    }

    // GET ALL NULL
    @Test
    void testGetAllDeliveries_Null() {

        when(deliveryClient.getAllDeliveries()).thenReturn(null);

        assertThrows(DashboardException.class,
                () -> adminService.getAllDeliveries(null, null, null));
    }

    // GET BY ID
    @Test
    void testGetDeliveryById() {

        when(deliveryClient.getById(1L))
                .thenReturn(new DeliveryResponse());

        DeliveryResponse res = adminService.getDeliveryById(1L);

        assertNotNull(res);
    }

    // INVALID ID
    @Test
    void testGetDeliveryById_Invalid() {

        assertThrows(DashboardException.class,
                () -> adminService.getDeliveryById(0L));
    }

    // NOT FOUND
    @Test
    void testGetDeliveryById_NotFound() {

        when(deliveryClient.getById(1L)).thenReturn(null);

        assertThrows(ReportNotFoundException.class,
                () -> adminService.getDeliveryById(1L));
    }

    // TRACKING EVENTS
    @Test
    void testGetTrackingEvents() {

        when(trackingClient.getEvents("TRK123"))
                .thenReturn(List.of(new TrackingEventResponse()));

        List<TrackingEventResponse> result =
                adminService.getTrackingEvents("TRK123");

        assertEquals(1, result.size());
    }

    // EMPTY TRACKING
    @Test
    void testGetTrackingEvents_Invalid() {

        assertThrows(DashboardException.class,
                () -> adminService.getTrackingEvents(""));
    }

    // TRACKING NULL
    @Test
    void testGetTrackingEvents_Null() {

        when(trackingClient.getEvents("TRK123")).thenReturn(null);

        assertThrows(DashboardException.class,
                () -> adminService.getTrackingEvents("TRK123"));
    }

    //  RESOLVE
    @Test
    void testResolveException() {

        ResolveRequest req = new ResolveRequest();
        req.setStatus("DELIVERED");

        when(deliveryClient.updateStatus(1L, "DELIVERED"))
                .thenReturn(new DeliveryResponse());

        DeliveryResponse res =
                adminService.resolveException(1L, req);

        assertNotNull(res);
    }

    // INVALID ID
    @Test
    void testResolveException_InvalidId() {

        ResolveRequest req = new ResolveRequest();
        req.setStatus("DELIVERED");

        assertThrows(ResolveException.class,
                () -> adminService.resolveException(0L, req));
    }

    // INVALID REQUEST
    @Test
    void testResolveException_InvalidRequest() {

        assertThrows(ResolveException.class,
                () -> adminService.resolveException(1L, null));
    }

    // RESOLVE FAIL
    @Test
    void testResolveException_Fail() {

        ResolveRequest req = new ResolveRequest();
        req.setStatus("DELIVERED");

        when(deliveryClient.updateStatus(1L, "DELIVERED"))
                .thenReturn(null);

        assertThrows(ResolveException.class,
                () -> adminService.resolveException(1L, req));
    }

    // REPORT
    @Test
    void testGenerateReport() {

        List<DeliveryResponse> list = List.of(
                createDelivery("DELIVERED"),
                createDelivery("FAILED")
        );

        when(deliveryClient.getAllDeliveries()).thenReturn(list);

        ReportResponse res =
                adminService.generateReport("2026-01-01", "2026-03-31");

        assertEquals(2, res.getTotalDeliveries());
    }

    // REPORT NULL
    @Test
    void testGenerateReport_Null() {

        when(deliveryClient.getAllDeliveries()).thenReturn(null);

        assertThrows(ReportNotFoundException.class,
                () -> adminService.generateReport("a", "b"));
    }
}
