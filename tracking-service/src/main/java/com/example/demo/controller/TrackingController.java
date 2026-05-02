package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.entity.Document;
import com.example.demo.repository.DocumentRepository;
import com.example.demo.exception.*;
import com.example.demo.service.TrackingService;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/tracking")
public class TrackingController {

    private final TrackingService trackingService;
    private final DocumentRepository documentRepository;

    public TrackingController(TrackingService trackingService,
                              DocumentRepository documentRepository) {
        this.trackingService = trackingService;
        this.documentRepository = documentRepository;
    }

    @PostMapping(value = "/documents/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DocumentResponse> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("deliveryId") Long deliveryId) {

        return ResponseEntity.ok(trackingService.saveDocument(file, deliveryId));
    }

    @GetMapping("/documents/{deliveryId}")
    public ResponseEntity<List<DocumentResponse>> getDocuments(
            @PathVariable Long deliveryId) {

        return ResponseEntity.ok(trackingService.getDocuments(deliveryId));
    }

    @GetMapping("/documents/download/{id}")
    public ResponseEntity<byte[]> downloadDocument(@PathVariable Long id) {

        Document doc = documentRepository.findById(id)
                .orElseThrow(() -> new DocumentNotFoundException("Document not found with ID: " + id));

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + doc.getFileName() + "\"")
                .contentType(MediaType.parseMediaType(doc.getFileType()))
                .body(doc.getFileData());
    }

    @PostMapping("/events")
    public ResponseEntity<Void> createEvent(@RequestBody TrackingEventRequest request) {
        trackingService.createEvent(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{trackingNumber}")
    public ResponseEntity<List<TrackingEventResponse>> track(
            @PathVariable String trackingNumber) {

        return ResponseEntity.ok(trackingService.getEvents(trackingNumber));
    }

    @PostMapping("/proof")
    public ResponseEntity<DeliveryProofResponse> submitProof(
            @RequestParam Long deliveryId,
            @RequestParam String trackingNumber,
            @RequestParam String receiverName,
            @RequestParam String signature,
            @RequestParam(required = false) String remarks) {

        return ResponseEntity.ok(
                trackingService.saveProof(
                        deliveryId, trackingNumber,
                        receiverName, signature, remarks
                )
        );
    }

    @GetMapping("/proof/{deliveryId}")
    public ResponseEntity<DeliveryProofResponse> getProof(
            @PathVariable Long deliveryId) {

        return ResponseEntity.ok(
                trackingService.getProofByDeliveryId(deliveryId)
        );
    }
}