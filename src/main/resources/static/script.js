const API = "/api";

let shows = [];


// ===============================
// LOAD SHOWS
// ===============================

async function loadShows() {

    const container = document.getElementById("showsContainer");
    const select = document.getElementById("showSelect");

    container.innerHTML = `
        <div class="loading">
            Loading shows...
        </div>
    `;

    try {

        const response = await fetch(`${API}/shows`);

        if (!response.ok) {
            throw new Error("Unable to load shows");
        }

        shows = await response.json();

        container.innerHTML = "";
        select.innerHTML = `<option value="">Choose a show</option>`;

        if (shows.length === 0) {

            container.innerHTML = `
                <div class="empty-bookings">
                    No shows available yet.
                </div>
            `;

            return;
        }

        shows.forEach(show => {

            const card = document.createElement("div");

            card.className = "show-card";

            card.innerHTML = `
                <div class="show-icon">🎬</div>

                <h3>${escapeHtml(show.title)}</h3>

                <p class="show-time">
                    🕐 ${formatDate(show.time)}
                </p>

                <span class="seat-status">
                    💺 ${show.totalSeats} seats
                </span>

                <button
                    class="show-book-btn"
                    onclick="selectShow(${show.id})">
                    Book Now
                </button>
            `;

            container.appendChild(card);


            const option = document.createElement("option");

            option.value = show.id;
            option.textContent = `${show.title} - ${formatDate(show.time)}`;

            select.appendChild(option);

        });

    } catch (error) {

        console.error(error);

        container.innerHTML = `
            <div class="empty-bookings">
                <strong>Unable to connect to the server.</strong>
                <br>
                Make sure Spring Boot is running.
            </div>
        `;
    }
}


// ===============================
// SELECT SHOW
// ===============================

function selectShow(id) {

    const select = document.getElementById("showSelect");

    select.value = id;

    document.querySelector(".booking-section")
        .scrollIntoView({
            behavior: "smooth"
        });
}


// ===============================
// CREATE STUDENT
// ===============================

async function createStudent(name, email) {

    const response = await fetch(`${API}/students`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            name: name,
            email: email
        })

    });

    if (!response.ok) {

        const error = await response.text();

        throw new Error(error || "Student creation failed");
    }

    return await response.json();
}


// ===============================
// CREATE BOOKING
// ===============================

document.getElementById("bookingForm")
    .addEventListener("submit", async function(event) {

        event.preventDefault();

        const name =
            document.getElementById("studentName").value.trim();

        const email =
            document.getElementById("studentEmail").value.trim();

        const showId =
            document.getElementById("showSelect").value;

        const numberOfSeats =
            parseInt(document.getElementById("seatCount").value);


        if (!showId) {

            showMessage(
                "Please select a show.",
                "error"
            );

            return;
        }


        try {

            const student =
                await createStudent(name, email);


            const response =
                await fetch(`${API}/bookings`, {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        studentId: student.id,

                        showId: parseInt(showId),

                        numberOfSeats: numberOfSeats

                    })

                });


            if (!response.ok) {

                const errorText =
                    await response.text();

                throw new Error(
                    errorText || "Booking failed"
                );
            }


            const booking =
                await response.json();


            document.getElementById("bookingForm")
                .reset();


            document.getElementById("modalMessage")
                .textContent =
                `Booking #${booking.id} has been confirmed successfully.`;


            document.getElementById("bookingModal")
                .classList.add("active");


            loadBookings();

            loadShows();


        } catch (error) {

            console.error(error);

            showMessage(
                error.message,
                "error"
            );

        }

    });


// ===============================
// LOAD BOOKINGS
// ===============================

async function loadBookings() {

    const container =
        document.getElementById("bookingsContainer");


    try {

        const response =
            await fetch(`${API}/bookings`);


        if (!response.ok) {

            throw new Error(
                "Unable to load bookings"
            );
        }


        const bookings =
            await response.json();


        if (bookings.length === 0) {

            container.innerHTML = `
                <div class="empty-bookings">
                    No bookings found yet.
                </div>
            `;

            return;
        }


        container.innerHTML = "";


        bookings.forEach(booking => {

            const card =
                document.createElement("div");


            card.className =
                "booking-card";


            card.innerHTML = `

                <div class="booking-info">

                    <h3>
                        🎬 ${escapeHtml(
                            booking.show?.title || "Show"
                        )}
                    </h3>

                    <p>
                        Student:
                        ${escapeHtml(
                            booking.student?.name || "Unknown"
                        )}
                    </p>

                    <p>
                        Seats:
                        ${booking.numberOfSeats}
                    </p>

                    <p>
                        Booking ID:
                        #${booking.id}
                    </p>

                </div>


                <div>

                    <span class="confirmed">
                        ${booking.status}
                    </span>

                    ${
                        booking.status === "CONFIRMED"
                        ?
                        `<br>
                        <button
                            class="cancel-btn"
                            onclick="cancelBooking(${booking.id})">
                            Cancel Booking
                        </button>`
                        :
                        ""
                    }

                </div>

            `;


            container.appendChild(card);

        });


    } catch (error) {

        console.error(error);

        container.innerHTML = `
            <div class="empty-bookings">
                Unable to load bookings.
            </div>
        `;
    }
}


// ===============================
// CANCEL BOOKING
// ===============================

async function cancelBooking(id) {

    const confirmed =
        confirm(
            "Are you sure you want to cancel this booking?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(`${API}/bookings/${id}`, {

                method: "DELETE"

            });


        if (!response.ok) {

            throw new Error(
                "Unable to cancel booking"
            );
        }


        alert(
            "Booking cancelled successfully."
        );


        loadBookings();
        loadShows();


    } catch (error) {

        alert(error.message);

    }
}


// ===============================
// HELPERS
// ===============================

function formatDate(dateString) {

    if (!dateString) {
        return "Time not available";
    }

    const date =
        new Date(dateString);


    return date.toLocaleString(
        "en-IN",
        {
            dateStyle: "medium",
            timeStyle: "short"
        }
    );
}


function escapeHtml(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function showMessage(message, type) {

    const element =
        document.getElementById("bookingMessage");


    element.textContent = message;

    element.style.marginTop = "15px";

    element.style.textAlign = "center";

    element.style.color =
        type === "error"
        ? "#d92d20"
        : "#027a48";
}


function closeModal() {

    document.getElementById("bookingModal")
        .classList.remove("active");

}


function scrollToShows() {

    document.getElementById("shows")
        .scrollIntoView({
            behavior: "smooth"
        });

}


function scrollToBookings() {

    document.getElementById("bookings")
        .scrollIntoView({
            behavior: "smooth"
        });

}


// ===============================
// START APPLICATION
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadShows();

        loadBookings();

    }
);