
package com.vrms.backend;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name="Vehicle")
public class Vehicle {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="Vehicle_ID")
    private Integer vehicleId;

    @Column(name="Registration_No")
    private String registrationNo;

    @Column(name="Model")
    private String model;

    @Column(name="Category_ID")
    private Integer categoryId;

    @Column(name="Branch_ID")
    private Integer branchId;

    @Column(name="Rental_Rate")
    private BigDecimal rentalRate;

    @Column(name="Fuel_Type")
    private String fuelType;

    @Column(name="Transmission")
    private String transmission;

    @Column(name="Status")
    private String status;

    public Integer getVehicleId() {
        return vehicleId;
    }

    public String getRegistrationNo() {
        return registrationNo;
    }

    public String getModel() {
        return model;
    }

    public Integer getCategoryId() {
        return categoryId;
    }

    public Integer getBranchId() {
        return branchId;
    }

    public BigDecimal getRentalRate() {
        return rentalRate;
    }

    public String getFuelType() {
        return fuelType;
    }

    public String getTransmission() {
        return transmission;
    }

    public String getStatus() {
        return status;
    }

    public void setVehicleId(Integer vehicleId) {
        this.vehicleId = vehicleId;
    }

    public void setRegistrationNo(String registrationNo) {
        this.registrationNo = registrationNo;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public void setCategoryId(Integer categoryId) {
        this.categoryId = categoryId;
    }

    public void setBranchId(Integer branchId) {
        this.branchId = branchId;
    }

    public void setRentalRate(BigDecimal rentalRate) {
        this.rentalRate = rentalRate;
    }

    public void setFuelType(String fuelType) {
        this.fuelType = fuelType;
    }

    public void setTransmission(String transmission) {
        this.transmission = transmission;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
