package com.vrms.backend;

import jakarta.persistence.*;

@Entity
@Table(name="Customer")
public class Customer {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="Customer_ID")
    private Integer customerId;

    @Column(name="Name",nullable=false)
    private String name;

    @Column(name="Email",nullable=false,unique=true)
    private String email;

    @Column(name="Phone",nullable=false)
    private String phone;

    @Column(name="Licence_No",nullable=false,unique=true)
    private String licenceNo;

    @Column(name="Address")
    private String address;

    public Integer getCustomerId(){return customerId;}
    public String getName(){return name;}
    public String getEmail(){return email;}
    public String getPhone(){return phone;}
    public String getLicenceNo(){return licenceNo;}
    public String getAddress(){return address;}

    public void setCustomerId(Integer customerId){this.customerId=customerId;}
    public void setName(String name){this.name=name;}
    public void setEmail(String email){this.email=email;}
    public void setPhone(String phone){this.phone=phone;}
    public void setLicenceNo(String licenceNo){this.licenceNo=licenceNo;}
    public void setAddress(String address){this.address=address;}
}
