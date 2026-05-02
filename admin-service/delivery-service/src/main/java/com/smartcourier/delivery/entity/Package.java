package com.smartcourier.delivery.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "packages")
public class Package {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;
    private Double weight;
    private Double lengthCm;
    private Double widthCm;
    private Double heightCm;
    private Double declaredValue;
    private Boolean isFragile;
    private Boolean isHazardous;
    private String specialInstructions;

    public Package() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }

    public Double getLengthCm() { return lengthCm; }
    public void setLengthCm(Double lengthCm) { this.lengthCm = lengthCm; }

    public Double getWidthCm() { return widthCm; }
    public void setWidthCm(Double widthCm) { this.widthCm = widthCm; }

    public Double getHeightCm() { return heightCm; }
    public void setHeightCm(Double heightCm) { this.heightCm = heightCm; }

    public Double getDeclaredValue() { return declaredValue; }
    public void setDeclaredValue(Double declaredValue) { this.declaredValue = declaredValue; }

    public Boolean getIsFragile() { return isFragile; }
    public void setIsFragile(Boolean isFragile) { this.isFragile = isFragile; }

    public Boolean getIsHazardous() { return isHazardous; }
    public void setIsHazardous(Boolean isHazardous) { this.isHazardous = isHazardous; }

    public String getSpecialInstructions() { return specialInstructions; }
    public void setSpecialInstructions(String specialInstructions) { this.specialInstructions = specialInstructions; }
}
