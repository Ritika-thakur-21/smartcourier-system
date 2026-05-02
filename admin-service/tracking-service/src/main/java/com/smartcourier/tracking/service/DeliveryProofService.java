package com.smartcourier.tracking.service;

import com.smartcourier.tracking.dto.DeliveryProofRequest;
import com.smartcourier.tracking.entity.DeliveryProof;
import com.smartcourier.tracking.repository.DeliveryProofRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DeliveryProofService {

    private final DeliveryProofRepository deliveryProofRepository;

    public DeliveryProofService(DeliveryProofRepository deliveryProofRepository) {
        this.deliveryProofRepository = deliveryProofRepository;
    }

    // Save delivery proof
    public DeliveryProof saveProof(DeliveryProofRequest request) {
        DeliveryProof proof = new DeliveryProof();
        proof.setTrackingNumber(request.getTrackingNumber());
        proof.setDeliveryId(request.getDeliveryId());
        proof.setReceiverName(request.getReceiverName());
        proof.setDeliveredBy(request.getDeliveredBy());
        proof.setDeliveryLocation(request.getDeliveryLocation());
        proof.setRemarks(request.getRemarks());
        return deliveryProofRepository.save(proof);
    }

    // Get proof by tracking number
    public Optional<DeliveryProof> getProofByTrackingNumber(String trackingNumber) {
        return deliveryProofRepository.findByTrackingNumber(trackingNumber);
    }

    // Get proof by delivery ID
    public Optional<DeliveryProof> getProofByDeliveryId(Long deliveryId) {
        return deliveryProofRepository.findByDeliveryId(deliveryId);
    }

    // Get all proofs (Admin)
    public List<DeliveryProof> getAllProofs() {
        return deliveryProofRepository.findAll();
    }
}
