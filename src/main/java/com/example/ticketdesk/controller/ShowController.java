package com.example.ticketdesk.controller;

import com.example.ticketdesk.entity.Show;
import com.example.ticketdesk.service.ShowService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/shows")
public class ShowController {

    private final ShowService showService;

    public ShowController(ShowService showService) {
        this.showService = showService;
    }

    @PostMapping
    public ResponseEntity<Show> createShow(
            @Valid @RequestBody Show show) {

        return ResponseEntity.ok(
                showService.createShow(show)
        );
    }

    @GetMapping
    public ResponseEntity<List<Show>> getAllShows() {
        return ResponseEntity.ok(
                showService.getAllShows()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Show> getShow(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                showService.getShow(id)
        );
    }

    @GetMapping("/{id}/seats")
    public ResponseEntity<Map<String, Object>> getRemainingSeats(
            @PathVariable Long id) {

        Show show = showService.getShow(id);

        int remaining = showService.getRemainingSeats(id);

        return ResponseEntity.ok(
                Map.of(
                        "showId", show.getId(),
                        "title", show.getTitle(),
                        "totalSeats", show.getTotalSeats(),
                        "remainingSeats", remaining
                )
        );
    }
}