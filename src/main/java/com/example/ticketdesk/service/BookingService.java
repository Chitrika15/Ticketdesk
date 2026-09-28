package com.example.ticketdesk.service;

import com.example.ticketdesk.dto.BookingRequest;
import com.example.ticketdesk.entity.Booking;
import com.example.ticketdesk.entity.BookingStatus;
import com.example.ticketdesk.entity.Show;
import com.example.ticketdesk.entity.Student;
import com.example.ticketdesk.repository.BookingRepository;
import com.example.ticketdesk.repository.ShowRepository;
import com.example.ticketdesk.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final StudentRepository studentRepository;
    private final ShowRepository showRepository;

    public BookingService(
            BookingRepository bookingRepository,
            StudentRepository studentRepository,
            ShowRepository showRepository) {

        this.bookingRepository = bookingRepository;
        this.studentRepository = studentRepository;
        this.showRepository = showRepository;
    }

    @Transactional
    public Booking createBooking(BookingRequest request) {

        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Show show = showRepository.findByIdForUpdate(request.getShowId())
                .orElseThrow(() -> new RuntimeException("Show not found"));

        Integer bookedSeats = bookingRepository.getBookedSeats(
                show.getId(),
                BookingStatus.CONFIRMED
        );

        int remainingSeats = show.getTotalSeats() - bookedSeats;

        if (request.getNumberOfSeats() > remainingSeats) {
            throw new RuntimeException(
                    "Not enough seats available. Remaining seats: "
                            + remainingSeats
            );
        }

        Booking booking = new Booking();

        booking.setStudent(student);
        booking.setShow(show);
        booking.setNumberOfSeats(request.getNumberOfSeats());
        booking.setStatus(BookingStatus.CONFIRMED);

        return bookingRepository.save(booking);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @Transactional
    public Booking cancelBooking(Long bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new RuntimeException("Booking is already cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);

        return bookingRepository.save(booking);
    }
}