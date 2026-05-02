package com.smartcourier.delivery.service;

import com.smartcourier.delivery.dto.DeliveryRequest;
import com.smartcourier.delivery.dto.StatusUpdateRequest;
import com.smartcourier.delivery.entity.Address;
import com.smartcourier.delivery.entity.Delivery;
import com.smartcourier.delivery.entity.Package;
import com.smartcourier.delivery.enums.DeliveryStatus;
import com.smartcourier.delivery.repository.DeliveryRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;

    public DeliveryService(DeliveryRepository deliveryRepository) {
        this.deliveryRepository = deliveryRepository;
    }

    // Create a new delivery (status = DRAFT)
    public Delivery createDelivery(DeliveryRequest request) {

        Address pickupAddress = new Address();
        pickupAddress.setStreet(request.getPickupStreet());
        pickupAddress.setCity(request.getPickupCity());
        pickupAddress.setState(request.getPickupState());
        pickupAddress.setPostalCode(request.getPickupPostalCode());
        pickupAddress.setCountry(request.getPickupCountry());

        Address deliveryAddress = new Address();
        deliveryAddress.setStreet(request.getDeliveryStreet());
        deliveryAddress.setCity(request.getDeliveryCity());
        deliveryAddress.setState(request.getDeliveryState());
        deliveryAddress.setPostalCode(request.getDeliveryPostalCode());
        deliveryAddress.setCountry(request.getDeliveryCountry());

        Package pkg = new Package();
        pkg.setDescription(request.getPackageDescription());
        pkg.setWeight(request.getWeight());
        pkg.setDeclaredValue(request.getDeclaredValue());
        pkg.setIsFragile(request.getIsFragile());
        pkg.setIsHazardous(request.getIsHazardous());
        pkg.setSpecialInstructions(request.getSpecialInstructions());

        Delivery delivery = new Delivery();
        delivery.setTrackingNumber("TRK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        delivery.setCustomerId(request.getCustomerId());
        delivery.setCustomerEmail(request.getCustomerEmail());
        delivery.setSenderName(request.getSenderName());
        delivery.setSenderPhone(request.getSenderPhone());
        delivery.setSenderEmail(request.getSenderEmail());
        delivery.setReceiverName(request.getReceiverName());
        delivery.setReceiverPhone(request.getReceiverPhone());
        delivery.setReceiverEmail(request.getReceiverEmail());
        delivery.setPickupAddress(pickupAddress);
        delivery.setDeliveryAddress(deliveryAddress);
        delivery.setPackageDetails(pkg);
        delivery.setServiceType(request.getServiceType());
        delivery.setStatus(DeliveryStatus.DRAFT);
        delivery.setScheduledPickupDate(request.getScheduledPickupDate());
        delivery.setNotes(request.getNotes());
        delivery.setEstimatedCharge(calculateCharge(request.getWeight(), request.getServiceType().name()));
        delivery.setEstimatedDeliveryDate(LocalDateTime.now().plusDays(getDeliveryDays(request.getServiceType().name())));

        return deliveryRepository.save(delivery);
    }

    // Get delivery by ID
    public Optional<Delivery> getDeliveryById(Long id) {
        return deliveryRepository.findById(id);
    }

    // Get delivery by tracking number
    public Optional<Delivery> getDeliveryByTrackingNumber(String trackingNumber) {
        return deliveryRepository.findByTrackingNumber(trackingNumber);
    }

    // Get all deliveries for a customer
    public List<Delivery> getDeliveriesByCustomer(Long customerId) {
        return deliveryRepository.findByCustomerId(customerId);
    }

    // Get all deliveries (Admin)
    public List<Delivery> getAllDeliveries() {
        return deliveryRepository.findAll();
    }

    // Get deliveries by status (Admin)
    public List<Delivery> getDeliveriesByStatus(DeliveryStatus status) {
        return deliveryRepository.findByStatus(status);
    }

    // Book delivery: DRAFT -> BOOKED
    public Delivery bookDelivery(Long id) {
        Delivery delivery = deliveryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Delivery not found with id: " + id));
        if (delivery.getStatus() != DeliveryStatus.DRAFT) {
            throw new RuntimeException("Only DRAFT deliveries can be booked.");
        }
        delivery.setStatus(DeliveryStatus.BOOKED);
        return deliveryRepository.save(delivery);
    }

    // Update delivery status (Admin/System)
    public Delivery updateStatus(Long id, StatusUpdateRequest request) {
        Delivery delivery = deliveryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Delivery not found with id: " + id));

        delivery.setStatus(request.getStatus());

        if (request.getStatus() == DeliveryStatus.DELIVERED) {
            delivery.setActualDeliveryDate(LocalDateTime.now());
        }
        if (request.getStatus() == DeliveryStatus.DELAYED
                || request.getStatus() == DeliveryStatus.FAILED
                || request.getStatus() == DeliveryStatus.RETURNED) {
            delivery.setExceptionReason(request.getReason());
        }

        return deliveryRepository.save(delivery);
    }

    // Delete delivery
    public void deleteDelivery(Long id) {
        deliveryRepository.deleteById(id);
    }

    // Simple charge calculation
    private Double calculateCharge(Double weight, String serviceType) {
        if (weight == null) return 0.0;
        double baseRate = switch (serviceType) {
            case "EXPRESS" -> 15.0;
            case "INTERNATIONAL" -> 25.0;
            default -> 10.0; // DOMESTIC
        };
        return baseRate + (weight * 2.5);
    }

    // Estimated delivery days
    private int getDeliveryDays(String serviceType) {
        return switch (serviceType) {
            case "EXPRESS" -> 1;
            case "INTERNATIONAL" -> 7;
            default -> 3; // DOMESTIC
        };
    }
}
