
package com.vrms.backend;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name="Booking")
public class Booking {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="Booking_ID")
    private Integer bookingId;

    @Column(name="Customer_ID",nullable=false)
    private Integer customerId;

    @Column(name="Vehicle_ID",nullable=false)
    private Integer vehicleId;

    @Column(name="Start_Date",nullable=false)
    private LocalDate startDate;

    @Column(name="End_Date",nullable=false)
    private LocalDate endDate;

    @Column(name="Booking_Date",insertable=false,updatable=false)
    private LocalDateTime bookingDate;

    @Column(name="Total_Estimated_Amount",nullable=false)
    private BigDecimal totalEstimatedAmount;

    @Column(name="Status",nullable=false)
    private String status;

    public Integer getBookingId(){return bookingId;}
    public Integer getCustomerId(){return customerId;}
    public Integer getVehicleId(){return vehicleId;}
    public LocalDate getStartDate(){return startDate;}
    public LocalDate getEndDate(){return endDate;}
    public LocalDateTime getBookingDate(){return bookingDate;}
    public BigDecimal getTotalEstimatedAmount(){return totalEstimatedAmount;}
    public String getStatus(){return status;}

    public void setCustomerId(Integer customerId){this.customerId=customerId;}
    public void setVehicleId(Integer vehicleId){this.vehicleId=vehicleId;}
    public void setStartDate(LocalDate startDate){this.startDate=startDate;}
    public void setEndDate(LocalDate endDate){this.endDate=endDate;}
    public void setTotalEstimatedAmount(BigDecimal amount){this.totalEstimatedAmount=amount;}
    public void setStatus(String status){this.status=status;}
}
