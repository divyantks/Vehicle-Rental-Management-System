USE vehicle_rental;

-- 1. BRANCH
INSERT INTO Branch (Branch_Name, Location, Contact_No) VALUES
('Delhi Central', 'Connaught Place, Delhi', '9876500001'),
('Noida Hub', 'Sector 18, Noida', '9876500002'),
('Gurugram Point', 'Cyber City, Gurugram', '9876500003'),
('Dadri Branch', 'Main Market, Dadri', '9876500004');

-- 2. VEHICLE CATEGORY
INSERT INTO Vehicle_Category (Category_Name, Base_Rate) VALUES
('Hatchback', 1200.00),
('Sedan', 2000.00),
('SUV', 3000.00),
('Luxury', 6000.00),
('Electric', 2500.00);

-- 3. EMPLOYEE
INSERT INTO Employee (Name, Email, Phone, Role, Branch_ID) VALUES
('Rohit Sharma', 'rohit@vrms.com', '9811100001', 'Manager', 1),
('Anita Verma', 'anita@vrms.com', '9811100002', 'Executive', 1),
('Sandeep Yadav', 'sandeep@vrms.com', '9811100003', 'Manager', 2),
('Priya Singh', 'priya@vrms.com', '9811100004', 'Executive', 2),
('Manoj Gupta', 'manoj@vrms.com', '9811100005', 'Mechanic', 3),
('Neha Kapoor', 'neha@vrms.com', '9811100006', 'Executive', 4);

-- 4. CUSTOMER
INSERT INTO Customer (Name, Email, Phone, Licence_No, Address) VALUES
('Aarav Mehta', 'aarav@gmail.com', '9900000001', 'DL1420230001', 'Saket, Delhi'),
('Riya Sharma', 'riya@gmail.com', '9900000002', 'UP1420230002', 'Noida Sector 62'),
('Kabir Malik', 'kabir@gmail.com', '9900000003', 'HR2620230003', 'Gurugram'),
('Simran Kaur', 'simran@gmail.com', '9900000004', 'DL0320230004', 'Dwarka, Delhi'),
('Arjun Singh', 'arjun@gmail.com', '9900000005', 'UP1420230005', 'Dadri, UP'),
('Pooja Gupta', 'pooja@gmail.com', '9900000006', 'DL0120230006', 'Rohini, Delhi'),
('Vikas Tomar', 'vikas@gmail.com', '9900000007', 'UP1620230007', 'Ghaziabad'),
('Neha Jain', 'nehaj@gmail.com', '9900000008', 'HR2620230008', 'Faridabad');

-- 5. USER ACCOUNT (dummy hashes; real ones will come from BCrypt in Spring Boot)
INSERT INTO User_Account (Email, Password_Hash, Role, Customer_ID, Employee_ID) VALUES
('rohit@vrms.com', '$2a$10$dummyhashdummyhashdummyhashdummyhashdummyhashdummyhash', 'ADMIN', NULL, 1),
('anita@vrms.com', '$2a$10$dummyhashdummyhashdummyhashdummyhashdummyhashdummyhash', 'EMPLOYEE', NULL, 2),
('aarav@gmail.com', '$2a$10$dummyhashdummyhashdummyhashdummyhashdummyhashdummyhash', 'CUSTOMER', 1, NULL),
('riya@gmail.com', '$2a$10$dummyhashdummyhashdummyhashdummyhashdummyhashdummyhash', 'CUSTOMER', 2, NULL),
('kabir@gmail.com', '$2a$10$dummyhashdummyhashdummyhashdummyhashdummyhashdummyhash', 'CUSTOMER', 3, NULL);

-- 6. VEHICLE
INSERT INTO Vehicle (Registration_No, Model, Category_ID, Branch_ID, Rental_Rate, Fuel_Type, Transmission, Status) VALUES
('DL01AB1001', 'Maruti Swift', 1, 1, 1500.00, 'Petrol', 'Manual', 'Available'),
('DL01AB1002', 'Hyundai i20', 1, 1, 1600.00, 'Petrol', 'Manual', 'Available'),
('DL02CD2001', 'Honda City', 2, 1, 2200.00, 'Petrol', 'Automatic', 'Rented'),
('DL02CD2002', 'Hyundai Verna', 2, 2, 2100.00, 'Diesel', 'Manual', 'Available'),
('UP14EF3001', 'Mahindra XUV700', 3, 2, 3500.00, 'Diesel', 'Automatic', 'Rented'),
('UP14EF3002', 'Toyota Fortuner', 3, 3, 4500.00, 'Diesel', 'Automatic', 'Available'),
('HR26GH4001', 'BMW 5 Series', 4, 3, 8000.00, 'Petrol', 'Automatic', 'Available'),
('HR26GH4002', 'Mercedes E-Class', 4, 1, 9000.00, 'Diesel', 'Automatic', 'Maintenance'),
('DL03IJ5001', 'Tata Nexon EV', 5, 4, 2800.00, 'Electric', 'Automatic', 'Available'),
('DL03IJ5002', 'Tata Tiago', 1, 4, 1300.00, 'CNG', 'Manual', 'Available');

-- 7. BOOKING
INSERT INTO Booking (Customer_ID, Vehicle_ID, Start_Date, End_Date, Booking_Date, Total_Estimated_Amount, Status) VALUES
(1, 3, '2026-10-20', '2026-10-28', '2026-10-18 10:00:00', 17600.00, 'Confirmed'),
(2, 5, '2026-10-22', '2026-10-27', '2026-10-20 14:30:00', 17500.00, 'Confirmed'),
(3, 1, '2026-10-01', '2026-10-04', '2026-09-28 09:00:00', 4500.00, 'Completed'),
(4, 2, '2026-10-05', '2026-10-08', '2026-10-02 16:45:00', 4800.00, 'Completed'),
(5, 7, '2026-09-15', '2026-09-17', '2026-09-10 11:15:00', 16000.00, 'Completed'),
(6, 9, '2026-11-02', '2026-11-05', '2026-10-25 18:00:00', 8400.00, 'Confirmed'),
(7, 4, '2026-11-10', '2026-11-12', '2026-10-26 08:20:00', 4200.00, 'Pending'),
(8, 6, '2026-10-12', '2026-10-15', '2026-10-08 13:10:00', 13500.00, 'Cancelled');

-- 8. RENTAL
INSERT INTO Rental (Booking_ID, Employee_ID, Pickup_Date, Return_Date, Total_Amount, Rental_Status) VALUES
(1, 2, '2026-10-20 10:00:00', NULL, 0.00, 'Active'),
(2, 4, '2026-10-22 09:30:00', NULL, 0.00, 'Active'),
(3, 2, '2026-10-01 11:00:00', '2026-10-04 11:00:00', 4500.00, 'Returned'),
(4, 4, '2026-10-05 10:00:00', '2026-10-08 10:00:00', 4800.00, 'Returned'),
(5, 3, '2026-09-15 12:00:00', '2026-09-17 12:00:00', 16000.00, 'Returned');

-- 9. PAYMENT
INSERT INTO Payment (Rental_ID, Amount, Payment_Date, Payment_Mode, Payment_Status) VALUES
(1, 5000.00, '2026-10-20 10:05:00', 'UPI', 'Paid'),
(2, 5000.00, '2026-10-22 09:40:00', 'Card', 'Paid'),
(3, 4500.00, '2026-10-04 11:10:00', 'Cash', 'Paid'),
(4, 4800.00, '2026-10-08 10:15:00', 'UPI', 'Paid'),
(5, 16000.00, '2026-09-17 12:10:00', 'Card', 'Paid'),
(1, 3000.00, '2026-10-26 09:00:00', 'Cash', 'Pending');

-- 10. MAINTENANCE
INSERT INTO Maintenance (Vehicle_ID, Employee_ID, Service_Date, Description, Cost, Maintenance_Status) VALUES
(8, 5, '2026-10-24', 'Engine service and oil change', 6500.00, 'In Progress'),
(1, 5, '2026-09-20', 'Routine service', 2500.00, 'Completed'),
(6, 5, '2026-10-30', 'Brake pad replacement', 4000.00, 'Scheduled'),
(3, 5, '2026-08-10', 'Tyre replacement', 12000.00, 'Completed');