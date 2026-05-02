package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.service.AdminService;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class AdminControllerTest {

    private MockMvc mockMvc;

    @Mock
    private AdminService adminService;

    @InjectMocks
    private AdminController adminController;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setup() {
        mockMvc = MockMvcBuilders
                .standaloneSetup(adminController)
                .build();
    }

    //  DASHBOARD
    @Test
    void testGetDashboard() throws Exception {

        Mockito.when(adminService.getDashboardStats())
                .thenReturn(new DashboardStats());

        mockMvc.perform(get("/admin/dashboard"))
                .andExpect(status().isOk());
    }

    // GET ALL DELIVERIES
    @Test
    void testGetAllDeliveries() throws Exception {

        Mockito.when(adminService.getAllDeliveries(null, null, null))
                .thenReturn(List.of(new DeliveryResponse()));

        mockMvc.perform(get("/admin/deliveries"))
                .andExpect(status().isOk());
    }

    // GET ALL WITH STATUS
    @Test
    void testGetAllDeliveries_WithStatus() throws Exception {

        Mockito.when(adminService.getAllDeliveries("BOOKED", null, null))
                .thenReturn(List.of(new DeliveryResponse()));

        mockMvc.perform(get("/admin/deliveries")
                        .param("status", "BOOKED"))
                .andExpect(status().isOk());
    }

    // GET DELIVERY BY ID
    @Test
    void testGetDeliveryById() throws Exception {

        Mockito.when(adminService.getDeliveryById(1L))
                .thenReturn(new DeliveryResponse());

        mockMvc.perform(get("/admin/deliveries/1"))
                .andExpect(status().isOk());
    }

    // GET TRACKING EVENTS
    @Test
    void testGetTrackingEvents() throws Exception {

        Mockito.when(adminService.getTrackingEvents("TRK123"))
                .thenReturn(List.of(new TrackingEventResponse()));

        mockMvc.perform(get("/admin/tracking/TRK123"))
                .andExpect(status().isOk());
    }

    // RESOLVE EXCEPTION
    @Test
    void testResolveException() throws Exception {

        ResolveRequest request = new ResolveRequest();

        Mockito.when(adminService.resolveException(Mockito.eq(1L), Mockito.any()))
                .thenReturn(new DeliveryResponse());

        mockMvc.perform(put("/admin/deliveries/1/resolve")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    //  REPORTS
    @Test
    void testGetReports() throws Exception {

        Mockito.when(adminService.generateReport("2026-01-01", "2026-03-31"))
                .thenReturn(new ReportResponse());

        mockMvc.perform(get("/admin/reports")
                        .param("from", "2026-01-01")
                        .param("to", "2026-03-31"))
                .andExpect(status().isOk());
    }
}