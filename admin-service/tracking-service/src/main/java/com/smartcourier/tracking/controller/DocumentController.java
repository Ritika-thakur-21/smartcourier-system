package com.smartcourier.tracking.controller;

import com.smartcourier.tracking.entity.Document;
import com.smartcourier.tracking.service.DocumentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/tracking/documents")
@CrossOrigin(origins = "*")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    // POST /tracking/documents/upload - Upload document (Customer)
    @PostMapping("/upload")
    public ResponseEntity<Document> uploadDocument(
            @RequestParam("trackingNumber") String trackingNumber,
            @RequestParam("deliveryId") Long deliveryId,
            @RequestParam("documentType") String documentType,
            @RequestParam("uploadedBy") String uploadedBy,
            @RequestParam("file") MultipartFile file) {
        try {
            Document document = documentService.uploadDocument(
                    trackingNumber, deliveryId, documentType, uploadedBy, file);
            return ResponseEntity.status(HttpStatus.CREATED).body(document);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // GET /tracking/documents/{trackingNumber} - Get docs by tracking number
    @GetMapping("/{trackingNumber}")
    public ResponseEntity<List<Document>> getDocumentsByTrackingNumber(
            @PathVariable String trackingNumber) {
        List<Document> documents = documentService.getDocumentsByTrackingNumber(trackingNumber);
        return ResponseEntity.ok(documents);
    }

    // GET /tracking/documents/delivery/{deliveryId} - Get docs by delivery ID
    @GetMapping("/delivery/{deliveryId}")
    public ResponseEntity<List<Document>> getDocumentsByDeliveryId(@PathVariable Long deliveryId) {
        List<Document> documents = documentService.getDocumentsByDeliveryId(deliveryId);
        return ResponseEntity.ok(documents);
    }

    // GET /tracking/documents/file/{id} - Get single document by ID
    @GetMapping("/file/{id}")
    public ResponseEntity<Document> getDocumentById(@PathVariable Long id) {
        return documentService.getDocumentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE /tracking/documents/{id} - Delete document (Admin)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id) {
        documentService.deleteDocument(id);
        return ResponseEntity.noContent().build();
    }
}
