package com.example.ticketdesk.service;

import com.example.ticketdesk.entity.Show;
import com.example.ticketdesk.repository.BookingRepository;
import com.example.ticketdesk.repository.ShowRepository;
import com.example.ticketdesk.entity.BookingStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShowService {

    private final ShowRepository showRepository;
    private final BookingRepository bookingRepository;

    public ShowService(
            ShowRepository showRepository,
            BookingRepository bookingRepository) {
        this.showRepository = showRepository;
        this.bookingRepository = bookingRepository;
    }

    public Show createShow(Show show) {
        return showRepository.save(show);
    }

    public List<Show> getAllShows() {
        return showRepository.findAll();
    }

    public Show getShow(Long id) {
        return showRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Show not found"));
    }

    public int getRemainingSeats(Long showId) {

        Show show = getShow(showId);

        Integer bookedSeats = bookingRepository.getBookedSeats(
                showId,
                BookingStatus.CONFIRMED
        );

        return show.getTotalSeats() - bookedSeats;
    }
}