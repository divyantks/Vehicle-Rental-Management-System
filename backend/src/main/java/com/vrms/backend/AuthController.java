
package com.vrms.backend;

import java.util.Map;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins="http://localhost:5173")
public class AuthController {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    public AuthController(CustomerRepository customerRepository,PasswordEncoder passwordEncoder) {
        this.customerRepository=customerRepository;
        this.passwordEncoder=passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String,String> data) {
        String name=data.get("name");
        String email=data.get("email");
        String phone=data.get("phone");
        String licenceNo=data.get("licenceNo");
        String address=data.getOrDefault("address","");
        String password=data.get("password");

        if(name==null || email==null || phone==null || licenceNo==null ||
           password==null || name.isBlank() || email.isBlank() ||
           phone.isBlank() || licenceNo.isBlank() || password.length()<8) {
            return ResponseEntity.badRequest().body(
                Map.of("message","Enter all required details. Password must be at least 8 characters.")
            );
        }

        if(customerRepository.findByEmail(email.trim()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                Map.of("message","An account with this email already exists.")
            );
        }

        Customer customer=new Customer();
        customer.setName(name.trim());
        customer.setEmail(email.trim().toLowerCase());
        customer.setPhone(phone.trim());
        customer.setLicenceNo(licenceNo.trim());
        customer.setAddress(address.trim());
        customer.setPasswordHash(passwordEncoder.encode(password));

        try {
            Customer saved=customerRepository.save(customer);
            return ResponseEntity.status(HttpStatus.CREATED).body(
                Map.of("message","Registration successful.","customerId",saved.getCustomerId(),"role","CUSTOMER")
            );
        } catch (org.springframework.dao.DataIntegrityViolationException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                Map.of("message","Email or driving licence is already registered.")
            );
        }
    }

    @PostMapping("/customer-login")
    public ResponseEntity<?> customerLogin(@RequestBody Map<String,String> data) {
        String email=data.get("email");
        String password=data.get("password");

        if(email==null || password==null) {
            return ResponseEntity.badRequest().body(Map.of("message","Email and password are required."));
        }

        Optional<Customer> result=customerRepository.findByEmail(email.trim().toLowerCase());

        if(result.isEmpty() || result.get().getPasswordHash()==null ||
           !passwordEncoder.matches(password,result.get().getPasswordHash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                Map.of("message","Invalid email or password.")
            );
        }

        Customer customer=result.get();

        return ResponseEntity.ok(Map.of(
            "message","Login successful.",
            "role","CUSTOMER",
            "customerId",customer.getCustomerId(),
            "name",customer.getName(),
            "email",customer.getEmail()
        ));
    }

    @PostMapping("/admin-login")
    public ResponseEntity<?> adminLogin(@RequestBody Map<String,String> data) {
        String email=data.get("email");
        String password=data.get("password");

        if(email==null || password==null ||
           !adminEmail.equalsIgnoreCase(email.trim()) ||
           !adminPassword.equals(password)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                Map.of("message","Invalid admin email or password.")
            );
        }

        return ResponseEntity.ok(Map.of(
            "message","Admin login successful.",
            "role","ADMIN",
            "email",adminEmail
        ));
    }
}
