package com.example.ticketdesk.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class BookingRequest {

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotNull(message = "Show ID is required")
    private Long showId;

    @NotNull(message = "Number of seats is required")
    @Positive(message = "Number of seats must be greater than zero")
    private Integer numberOfSeats;

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Long getShowId() {
        return showId;
    }

    public void setShowId(Long showId) {
        this.showId = showId;
    }

    public Integer getNumberOfSeats() {
        return numberOfSeats;
    }

    public void setNumberOfSeats(Integer numberOfSeats) {
        this.numberOfSeats = numberOfSeats;
    }
}