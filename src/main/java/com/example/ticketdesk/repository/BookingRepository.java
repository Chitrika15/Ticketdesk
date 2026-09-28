package com.example.ticketdesk.repository;

import com.example.ticketdesk.entity.Booking;
import com.example.ticketdesk.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("""
        SELECT COALESCE(SUM(b.numberOfSeats), 0)
        FROM Booking b
        WHERE b.show.id = :showId
        AND b.status = :status
    """)
    Integer getBookedSeats(
            @Param("showId") Long showId,
            @Param("status") BookingStatus status
    );
}