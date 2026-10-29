
package com.vrms.backend;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin
public class BookingController {

    private final BookingRepository bookingRepository;
    private final CustomerRepository customerRepository;
    private final VehicleRepository vehicleRepository;

    public BookingController(BookingRepository bookingRepository,
                             CustomerRepository customerRepository,
                             VehicleRepository vehicleRepository) {
        this.bookingRepository = bookingRepository;
        this.customerRepository = customerRepository;
        this.vehicleRepository = vehicleRepository;
    }

    @GetMapping
    public List<Booking> getBookings() {
        return bookingRepository.findAll();
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyBookings(@RequestParam String email) {
        Customer customer = customerRepository.findByEmail(email).orElse(null);

        if (customer == null) {
            return ResponseEntity.ok(List.of());
        }

        return ResponseEntity.ok(
            bookingRepository.findByCustomerIdOrderByBookingDateDesc(
                customer.getCustomerId()
            )
        );
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> createBooking(@RequestBody Map<String,String> data) {
        try {
            String name = data.get("name");
            String email = data.get("email");
            String phone = data.get("phone");
            String licenceNo = data.get("licenceNo");
            String address = data.get("address");

            Integer vehicleId = Integer.valueOf(data.get("vehicleId"));
            LocalDate startDate = LocalDate.parse(data.get("startDate"));
            LocalDate endDate = LocalDate.parse(data.get("endDate"));

            if (name == null || name.isBlank() ||
                email == null || email.isBlank() ||
                phone == null || phone.isBlank() ||
                licenceNo == null || licenceNo.isBlank()) {
                return ResponseEntity.badRequest().body(
                    Map.of("message","Please fill all required customer details")
                );
            }

            if (!endDate.isAfter(startDate)) {
                return ResponseEntity.badRequest().body(
                    Map.of("message","Return date must be after pickup date")
                );
            }

            if (startDate.isBefore(LocalDate.now())) {
                return ResponseEntity.badRequest().body(
                    Map.of("message","Pickup date cannot be in the past")
                );
            }

            Vehicle vehicle = vehicleRepository.findById(vehicleId).orElse(null);

            if (vehicle == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    Map.of("message","Vehicle not found")
                );
            }

            if (!"Available".equalsIgnoreCase(vehicle.getStatus())) {
                return ResponseEntity.badRequest().body(
                    Map.of("message","This vehicle is currently unavailable")
                );
            }

            boolean overlapping = bookingRepository
                .existsByVehicleIdAndStatusInAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                    vehicleId,
                    List.of("Pending","Confirmed"),
                    endDate,
                    startDate
                );

            if (overlapping) {
                return ResponseEntity.badRequest().body(
                    Map.of("message","Vehicle is already booked for these dates")
                );
            }

            Customer customer = customerRepository.findByEmail(email)
                .orElseGet(Customer::new);

            customer.setName(name);
            customer.setEmail(email);
            customer.setPhone(phone);
            customer.setLicenceNo(licenceNo);
            customer.setAddress(address);

            customer = customerRepository.save(customer);

            long days = ChronoUnit.DAYS.between(startDate,endDate);
            BigDecimal total = vehicle.getRentalRate()
                .multiply(BigDecimal.valueOf(days));

            Booking booking = new Booking();
            booking.setCustomerId(customer.getCustomerId());
            booking.setVehicleId(vehicleId);
            booking.setStartDate(startDate);
            booking.setEndDate(endDate);
            booking.setTotalEstimatedAmount(total);
            booking.setStatus("Pending");

            Booking savedBooking = bookingRepository.save(booking);

            return ResponseEntity.status(HttpStatus.CREATED).body(
                Map.of(
                    "message","Booking created successfully",
                    "bookingId",savedBooking.getBookingId(),
                    "totalAmount",total,
                    "days",days,
                    "status",savedBooking.getStatus()
                )
            );

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("message","Invalid booking details. Please check your inputs.")
            );
        }
    }
}
