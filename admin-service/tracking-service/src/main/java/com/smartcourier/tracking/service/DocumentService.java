package com.smartcourier.tracking.service;

import com.smartcourier.tracking.entity.Document;
import com.smartcourier.tracking.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public DocumentService(DocumentRepository documentRepository) {
        this.documentRepository = documentRepository;
    }

    // Upload a document file
    public Document uploadDocument(String trackingNumber, Long deliveryId,
                                   String documentType, String uploadedBy,
                                   MultipartFile file) throws IOException {

        // Create upload directory if not exists
        File dir = new File(uploadDir);
        if (!dir.exists()) dir.mkdirs();

        // Generate unique file name
        String originalFileName = file.getOriginalFilename();
        String uniqueFileName = UUID.randomUUID() + "_" + originalFileName;
        Path filePath = Paths.get(uploadDir, uniqueFileName);
        Files.write(filePath, file.getBytes());

        Document document = new Document();
        document.setTrackingNumber(trackingNumber);
        document.setDeliveryId(deliveryId);
        document.setDocumentType(documentType);
        document.setFileName(originalFileName);
        document.setFilePath(filePath.toString());
        document.setFileSize(file.getSize() + " bytes");
        document.setUploadedBy(uploadedBy);

        return documentRepository.save(document);
    }

    // Get all documents for a tracking number
    public List<Document> getDocumentsByTrackingNumber(String trackingNumber) {
        return documentRepository.findByTrackingNumber(trackingNumber);
    }

    // Get all documents by delivery ID
    public List<Document> getDocumentsByDeliveryId(Long deliveryId) {
        return documentRepository.findByDeliveryId(deliveryId);
    }

    // Get document by ID
    public Optional<Document> getDocumentById(Long id) {
        return documentRepository.findById(id);
    }

    // Delete document
    public void deleteDocument(Long id) {
        documentRepository.deleteById(id);
    }
}
