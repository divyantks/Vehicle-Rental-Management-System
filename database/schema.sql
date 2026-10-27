CREATE DATABASE IF NOT EXISTS vehicle_rental;
USE vehicle_rental;

-- 1. BRANCH
CREATE TABLE Branch (
    Branch_ID INT AUTO_INCREMENT PRIMARY KEY,
    Branch_Name VARCHAR(100) NOT NULL,
    Location VARCHAR(150) NOT NULL,
    Contact_No VARCHAR(15) NOT NULL
);

-- 2. VEHICLE CATEGORY
CREATE TABLE Vehicle_Category (
    Category_ID INT AUTO_INCREMENT PRIMARY KEY,
    Category_Name VARCHAR(50) NOT NULL UNIQUE,
    Base_Rate DECIMAL(10,2) NOT NULL CHECK (Base_Rate > 0)
);

-- 3. EMPLOYEE
CREATE TABLE Employee (
    Employee_ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Phone VARCHAR(15) NOT NULL,
    Role VARCHAR(50) NOT NULL,
    Branch_ID INT NOT NULL,
    FOREIGN KEY (Branch_ID) REFERENCES Branch(Branch_ID)
);

-- 4. CUSTOMER
CREATE TABLE Customer (
    Customer_ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Phone VARCHAR(15) NOT NULL,
    Licence_No VARCHAR(30) NOT NULL UNIQUE,
    Address VARCHAR(255)
);

-- 5. USER ACCOUNT (login, used by Spring Security)
CREATE TABLE User_Account (
    User_ID INT AUTO_INCREMENT PRIMARY KEY,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Password_Hash VARCHAR(255) NOT NULL,
    Role ENUM('CUSTOMER','EMPLOYEE','ADMIN') NOT NULL DEFAULT 'CUSTOMER',
    Customer_ID INT UNIQUE,
    Employee_ID INT UNIQUE,
    FOREIGN KEY (Customer_ID) REFERENCES Customer(Customer_ID) ON DELETE CASCADE,
    FOREIGN KEY (Employee_ID) REFERENCES Employee(Employee_ID) ON DELETE CASCADE
);

-- 6. VEHICLE
CREATE TABLE Vehicle (
    Vehicle_ID INT AUTO_INCREMENT PRIMARY KEY,
    Registration_No VARCHAR(20) NOT NULL UNIQUE,
    Model VARCHAR(100) NOT NULL,
    Category_ID INT NOT NULL,
    Branch_ID INT NOT NULL,
    Rental_Rate DECIMAL(10,2) NOT NULL CHECK (Rental_Rate > 0),
    Fuel_Type ENUM('Petrol','Diesel','CNG','Electric','Hybrid') NOT NULL,
    Transmission ENUM('Manual','Automatic') NOT NULL,
    Status ENUM('Available','Rented','Maintenance') NOT NULL DEFAULT 'Available',
    FOREIGN KEY (Category_ID) REFERENCES Vehicle_Category(Category_ID),
    FOREIGN KEY (Branch_ID) REFERENCES Branch(Branch_ID)
);

-- 7. BOOKING
CREATE TABLE Booking (
    Booking_ID INT AUTO_INCREMENT PRIMARY KEY,
    Customer_ID INT NOT NULL,
    Vehicle_ID INT NOT NULL,
    Start_Date DATE NOT NULL,
    End_Date DATE NOT NULL,
    Booking_Date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Total_Estimated_Amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    Status ENUM('Pending','Confirmed','Cancelled','Completed') NOT NULL DEFAULT 'Pending',
    FOREIGN KEY (Customer_ID) REFERENCES Customer(Customer_ID),
    FOREIGN KEY (Vehicle_ID) REFERENCES Vehicle(Vehicle_ID),
    CHECK (End_Date >= Start_Date)
);

-- 8. RENTAL
CREATE TABLE Rental (
    Rental_ID INT AUTO_INCREMENT PRIMARY KEY,
    Booking_ID INT NOT NULL UNIQUE,
    Employee_ID INT NULL,
    Pickup_Date DATETIME NOT NULL,
    Return_Date DATETIME NULL,
    Total_Amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    Rental_Status ENUM('Active','Returned','Overdue') NOT NULL DEFAULT 'Active',
    FOREIGN KEY (Booking_ID) REFERENCES Booking(Booking_ID),
    FOREIGN KEY (Employee_ID) REFERENCES Employee(Employee_ID),
    CHECK (Return_Date IS NULL OR Return_Date >= Pickup_Date)
);

-- 9. PAYMENT
CREATE TABLE Payment (
    Payment_ID INT AUTO_INCREMENT PRIMARY KEY,
    Rental_ID INT NOT NULL,
    Amount DECIMAL(10,2) NOT NULL CHECK (Amount > 0),
    Payment_Date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Payment_Mode ENUM('Cash','Card','UPI','NetBanking') NOT NULL,
    Payment_Status ENUM('Pending','Paid','Failed','Refunded') NOT NULL DEFAULT 'Pending',
    FOREIGN KEY (Rental_ID) REFERENCES Rental(Rental_ID)
);

-- 10. MAINTENANCE
CREATE TABLE Maintenance (
    Maintenance_ID INT AUTO_INCREMENT PRIMARY KEY,
    Vehicle_ID INT NOT NULL,
    Employee_ID INT NULL,
    Service_Date DATE NOT NULL,
    Description VARCHAR(255) NOT NULL,
    Cost DECIMAL(10,2) NOT NULL CHECK (Cost >= 0),
    Maintenance_Status ENUM('Scheduled','In Progress','Completed') NOT NULL DEFAULT 'Scheduled',
    FOREIGN KEY (Vehicle_ID) REFERENCES Vehicle(Vehicle_ID),
    FOREIGN KEY (Employee_ID) REFERENCES Employee(Employee_ID)
);