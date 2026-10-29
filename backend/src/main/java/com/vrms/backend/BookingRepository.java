
package com.vrms.backend;

import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking,Integer> {

    boolean existsByVehicleIdAndStatusInAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
        Integer vehicleId,
        java.util.Collection<String> statuses,
        LocalDate endDate,
        LocalDate startDate
    );
    long countByStatusIgnoreCase(String status);

    List<Booking> findByCustomerIdOrderByBookingDateDesc(Integer customerId);
}
