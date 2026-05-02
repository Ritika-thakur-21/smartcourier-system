package com.smartcourier.tracking.controller;

import com.smartcourier.tracking.dto.DeliveryProofRequest;
import com.smartcourier.tracking.entity.DeliveryProof;
import com.smartcourier.tracking.service.DeliveryProofService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tracking/proof")
@CrossOrigin(origins = "*")
public class DeliveryProofController {

    private final DeliveryProofService deliveryProofService;

    public DeliveryProofController(DeliveryProofService deliveryProofService) {
        this.deliveryProofService = deliveryProofService;
    }

    // POST /tracking/proof - Save delivery proof (Admin/Delivery Agent)
    @PostMapping
    public ResponseEntity<DeliveryProof> saveProof(@RequestBody DeliveryProofRequest request) {
        DeliveryProof proof = deliveryProofService.saveProof(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(proof);
    }

    // GET /tracking/proof/{trackingNumber} - Get proof by tracking number (Customer)
    @GetMapping("/{trackingNumber}")
    public ResponseEntity<DeliveryProof> getProofByTrackingNumber(@PathVariable String trackingNumber) {
        return deliveryProofService.getProofByTrackingNumber(trackingNumber)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /tracking/proof/delivery/{deliveryId} - Get proof by delivery ID
    @GetMapping("/delivery/{deliveryId}")
    public ResponseEntity<DeliveryProof> getProofByDeliveryId(@PathVariable Long deliveryId) {
        return deliveryProofService.getProofByDeliveryId(deliveryId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /tracking/proof - Get all proofs (Admin)
    @GetMapping
    public ResponseEntity<List<DeliveryProof>> getAllProofs() {
        return ResponseEntity.ok(deliveryProofService.getAllProofs());
    }
}
