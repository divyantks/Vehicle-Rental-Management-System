package com.vrms.backend;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final VehicleRepository vehicleRepository;
    private final CustomerRepository customerRepository;
    private final BookingRepository bookingRepository;

    public AdminController(
        VehicleRepository vehicleRepository,
        CustomerRepository customerRepository,
        BookingRepository bookingRepository
    ) {
        this.vehicleRepository = vehicleRepository;
        this.customerRepository = customerRepository;
        this.bookingRepository = bookingRepository;
    }

    @GetMapping("/dashboard")
    public Map<String, Long> getDashboardStats() {
        return Map.of(
            "totalVehicles", vehicleRepository.count(),
            "totalCustomers", customerRepository.count(),
            "totalBookings", bookingRepository.count(),
            "pendingBookings",
            bookingRepository.countByStatusIgnoreCase("Pending")
        );
    }
}