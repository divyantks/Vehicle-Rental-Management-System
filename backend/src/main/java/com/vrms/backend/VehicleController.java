package com.vrms.backend;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
@CrossOrigin
@RestController
public class VehicleController {

    private final VehicleRepository vehicleRepository;

    public VehicleController(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    @GetMapping("/api/test")
    public String test() {
        return "Vehicle Rental Management System API is working!";
    }

    @GetMapping("/api/vehicles")
    public List<Vehicle> getVehicles() {
        return vehicleRepository.findAll();
    }
}
