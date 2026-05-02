package com.example.demo.service;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.dto.*;
import com.example.demo.entity.*;
import com.example.demo.exception.*;
import com.example.demo.repository.*;

@Service
public class TrackingService {

    private static final Logger log = LoggerFactory.getLogger(TrackingService.class);

    private final TrackingEventRepository trackingEventRepository;
    private final DocumentRepository documentRepository;
    private final DeliveryProofRepository deliveryProofRepository;
    private final RabbitTemplate rabbitTemplate;

    public TrackingService(TrackingEventRepository trackingEventRepository,
                           DocumentRepository documentRepository,
                           DeliveryProofRepository deliveryProofRepository,
                           RabbitTemplate rabbitTemplate) {
        this.trackingEventRepository = trackingEventRepository;
        this.documentRepository = documentRepository;
        this.deliveryProofRepository = deliveryProofRepository;
        this.rabbitTemplate = rabbitTemplate;
    }

    @Transactional
    public void createEvent(TrackingEventRequest request) {
        log.info(" Received tracking event creation request for tracking number: {}", request.getTrackingNumber());

        TrackingEvent event = new TrackingEvent();
        event.setTrackingNumber(request.getTrackingNumber());
        event.setStatus(request.getStatus());
        event.setLocation(request.getLocation());
        event.setRemarks(request.getRemarks());
        
        assignCoordinates(event, request.getLatitude(), request.getLongitude());

        trackingEventRepository.save(event);

        TrackingEventDTO dto = new TrackingEventDTO();
        dto.setTrackingNumber(request.getTrackingNumber());
        dto.setStatus(request.getStatus());
        dto.setLocation(request.getLocation());
        dto.setRemarks(request.getRemarks());
        dto.setLatitude(event.getLatitude());
        dto.setLongitude(event.getLongitude());
        dto.setEmail(request.getEmail());
        dto.setRecipientType(request.getRecipientType());
        dto.setSenderName(request.getSenderName());
        dto.setReceiverName(request.getReceiverName());

    }

    private void assignCoordinates(TrackingEvent event, Double reqLat, Double reqLng) {
        if (reqLat != null && reqLng != null) {
            event.setLatitude(reqLat);
            event.setLongitude(reqLng);
            return;
        }
        
        String loc = event.getLocation() != null ? event.getLocation().toLowerCase() : "";
        if (loc.contains("mumbai")) {
            event.setLatitude(19.0760);
            event.setLongitude(72.8777);
        } else if (loc.contains("delhi")) {
            event.setLatitude(28.7041);
            event.setLongitude(77.1025);
        } else if (loc.contains("bangalore")) {
            event.setLatitude(12.9716);
            event.setLongitude(77.5946);
        } else if (loc.contains("hyderabad")) {
            event.setLatitude(17.3850);
            event.setLongitude(78.4867);
        } else if (loc.contains("chennai")) {
            event.setLatitude(13.0827);
            event.setLongitude(80.2707);
        } else if (loc.contains("kolkata")) {
            event.setLatitude(22.5726);
            event.setLongitude(88.3639);
        }
    }

    public List<TrackingEventResponse> getEvents(String trackingNumber) {
        return trackingEventRepository
                .findByTrackingNumberOrderByEventTimeAsc(trackingNumber)
                .stream()
                .map(this::mapToEventResponse)
                .collect(Collectors.toList());
    }

    public DocumentResponse saveDocument(MultipartFile file, Long deliveryId) {

        if (file == null || file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        try {
            Document document = new Document();
            document.setDeliveryId(deliveryId);
            document.setFileName(file.getOriginalFilename());
            document.setFileType(file.getContentType());
            document.setFileData(file.getBytes());

            return mapToDocumentResponse(documentRepository.save(document));

        } catch (IOException e) {
            throw new RuntimeException("Upload failed: " + e.getMessage());
        }
    }

    public List<DocumentResponse> getDocuments(Long deliveryId) {
        return documentRepository.findByDeliveryId(deliveryId)
                .stream()
                .map(this::mapToDocumentResponse)
                .collect(Collectors.toList());
    }

    public DeliveryProofResponse saveProof(Long deliveryId,
                                           String trackingNumber,
                                           String receiverName,
                                           String signature,
                                           String remarks) {

        List<DeliveryProof> existing =
                deliveryProofRepository.findAllByDeliveryId(deliveryId);

        if (!existing.isEmpty()) {
            throw new DuplicateProofException("Proof already exists");
        }

        DeliveryProof proof = new DeliveryProof();
        proof.setDeliveryId(deliveryId);
        proof.setTrackingNumber(trackingNumber);
        proof.setReceiverName(receiverName);
        proof.setSignature(signature);
        proof.setRemarks(remarks);

        return mapToProofResponse(deliveryProofRepository.save(proof));
    }

    public DeliveryProofResponse getProofByDeliveryId(Long deliveryId) {

        List<DeliveryProof> proofs =
                deliveryProofRepository.findAllByDeliveryId(deliveryId);

        if (proofs.isEmpty()) {
            throw new TrackingNotFoundException("Proof not found");
        }

        return mapToProofResponse(proofs.get(0));
    }

    private DocumentResponse mapToDocumentResponse(Document doc) {
        DocumentResponse res = new DocumentResponse();
        res.setId(doc.getId());
        res.setDeliveryId(doc.getDeliveryId());
        res.setFileName(doc.getFileName());
        res.setFileType(doc.getFileType());
        res.setUploadedAt(doc.getUploadedAt());
        return res;
    }

    private TrackingEventResponse mapToEventResponse(TrackingEvent event) {
        TrackingEventResponse res = new TrackingEventResponse();
        res.setId(event.getId());
        res.setTrackingNumber(event.getTrackingNumber());
        res.setStatus(event.getStatus());
        res.setLocation(event.getLocation());
        res.setLatitude(event.getLatitude());
        res.setLongitude(event.getLongitude());
        res.setRemarks(event.getRemarks());
        res.setEventTime(event.getEventTime());
        return res;
    }

    private DeliveryProofResponse mapToProofResponse(DeliveryProof proof) {
        DeliveryProofResponse res = new DeliveryProofResponse();
        res.setId(proof.getId());
        res.setDeliveryId(proof.getDeliveryId());
        res.setTrackingNumber(proof.getTrackingNumber());
        res.setReceiverName(proof.getReceiverName());
        res.setSignature(proof.getSignature());
        res.setRemarks(proof.getRemarks());
        res.setDeliveredAt(proof.getDeliveredAt());
        return res;
    }
}