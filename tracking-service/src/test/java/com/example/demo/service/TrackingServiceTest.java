package com.example.demo.service;

import com.example.demo.dto.*;
import com.example.demo.entity.*;
import com.example.demo.exception.*;
import com.example.demo.repository.*;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.mock.web.MockMultipartFile;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TrackingServiceTest {

    @Mock
    private TrackingEventRepository trackingEventRepository;

    @Mock
    private DocumentRepository documentRepository;

    @Mock
    private DeliveryProofRepository deliveryProofRepository;

    @Mock
    private RabbitTemplate rabbitTemplate;

    @InjectMocks
    private TrackingService trackingService;

    @Test
    void testCreateEvent() {

        TrackingEventRequest req = new TrackingEventRequest();
        req.setTrackingNumber("TRK123");
        req.setStatus("BOOKED");
        req.setLocation("Delhi");
        req.setRemarks("Created");

        trackingService.createEvent(req);

        verify(trackingEventRepository).save(any());
        verify(rabbitTemplate).convertAndSend(
                eq("tracking_exchange"),
                eq("tracking_routing"),
                any(Object.class)   
        );
    }

    @Test
    void testGetEvents() {

        TrackingEvent event = new TrackingEvent();
        event.setTrackingNumber("TRK123");
        event.setStatus("BOOKED");
        event.setLocation("Delhi");
        event.setRemarks("Test");

        when(trackingEventRepository
                .findByTrackingNumberOrderByEventTimeAsc("TRK123"))
                .thenReturn(List.of(event));

        List<TrackingEventResponse> result =
                trackingService.getEvents("TRK123");

        assertEquals(1, result.size());
    }

    @Test
    void testSaveDocument() throws Exception {

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.pdf",
                "application/pdf",
                "data".getBytes()
        );

        Document saved = new Document();
        saved.setFileName("test.pdf");
        saved.setFileType("application/pdf");
        saved.setDeliveryId(1L);

        when(documentRepository.save(any())).thenReturn(saved);

        DocumentResponse res =
                trackingService.saveDocument(file, 1L);

        assertEquals("test.pdf", res.getFileName());
    }

    @Test
    void testSaveDocument_EmptyFile() {

        MockMultipartFile file = new MockMultipartFile(
                "file", "", null, new byte[0]);

        assertThrows(RuntimeException.class, () ->
                trackingService.saveDocument(file, 1L));
    }

    @Test
    void testGetDocuments() {

        Document doc = new Document();
        doc.setDeliveryId(1L);
        doc.setFileName("file.pdf");
        doc.setFileType("application/pdf");

        when(documentRepository.findByDeliveryId(1L))
                .thenReturn(List.of(doc));

        List<DocumentResponse> res =
                trackingService.getDocuments(1L);

        assertEquals(1, res.size());
    }

    @Test
    void testSaveProof() {

        when(deliveryProofRepository.findAllByDeliveryId(1L))
                .thenReturn(List.of()); // empty

        DeliveryProof proof = new DeliveryProof();
        proof.setDeliveryId(1L);
        proof.setTrackingNumber("TRK123");

        when(deliveryProofRepository.save(any()))
                .thenReturn(proof);

        DeliveryProofResponse res =
                trackingService.saveProof(
                        1L, "TRK123", "John", "sign", "ok"
                );

        assertEquals(1L, res.getDeliveryId());
    }

    @Test
    void testSaveProof_Duplicate() {

        when(deliveryProofRepository.findAllByDeliveryId(1L))
                .thenReturn(List.of(new DeliveryProof()));

        assertThrows(DuplicateProofException.class, () ->
                trackingService.saveProof(
                        1L, "TRK123", "John", "sign", "ok"
                ));
    }

    @Test
    void testGetProof() {

        DeliveryProof proof = new DeliveryProof();
        proof.setDeliveryId(1L);

        when(deliveryProofRepository.findAllByDeliveryId(1L))
                .thenReturn(List.of(proof));

        DeliveryProofResponse res =
                trackingService.getProofByDeliveryId(1L);

        assertEquals(1L, res.getDeliveryId());
    }

    @Test
    void testGetProof_NotFound() {

        when(deliveryProofRepository.findAllByDeliveryId(1L))
                .thenReturn(List.of());

        assertThrows(TrackingNotFoundException.class, () ->
                trackingService.getProofByDeliveryId(1L));
    }
}