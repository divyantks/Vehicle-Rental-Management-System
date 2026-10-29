import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { Navigate, Routes, Route } from "react-router-dom";
import AdminDashboard from "./AdminDashboard.jsx";
import Login from "./Login.jsx";

function App() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [fuel, setFuel] = useState("All");
  const [transmission, setTransmission] = useState("All");
  const [sort, setSort] = useState("default");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [booking, setBooking] = useState({
    name: "",
    email: "",
    phone: "",
    licenceNo: "",
    address: "",
    startDate: "",
    endDate: "",
  });
  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  const [customerEmail, setCustomerEmail] = useState(
    () => localStorage.getItem("driveEaseEmail") || "",
  );
  const [emailInput, setEmailInput] = useState(
    () => localStorage.getItem("driveEaseEmail") || "",
  );
  const [myBookings, setMyBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState("");
  const [bookingsSearched, setBookingsSearched] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8080/api/vehicles")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load vehicles");
        return response.json();
      })
      .then((data) => setVehicles(data))
      .catch(() =>
        setError("Unable to load vehicles. Please check the backend."),
      )
      .finally(() => setLoading(false));
  }, []);

  async function loadBookings(email) {
    if (!email.trim()) {
      setBookingsError("Please enter your email address.");
      return;
    }

    setBookingsLoading(true);
    setBookingsError("");
    setBookingsSearched(true);

    try {
      const response = await fetch(
        `http://localhost:8080/api/bookings/my?email=${encodeURIComponent(email.trim())}`,
      );

      if (!response.ok) {
        throw new Error("Unable to load bookings. Please try again.");
      }

      const data = await response.json();
      setMyBookings(data);
      setCustomerEmail(email.trim());
      setEmailInput(email.trim());
      localStorage.setItem("driveEaseEmail", email.trim());
    } catch (err) {
      setBookingsError(err.message || "Unable to load bookings.");
      setMyBookings([]);
    } finally {
      setBookingsLoading(false);
    }
  }

  useEffect(() => {
    if (customerEmail) {
      loadBookings(customerEmail);
    }
  }, []);

  const filteredVehicles = useMemo(() => {
    let result = vehicles.filter((vehicle) => {
      const matchesSearch = vehicle.model
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesFuel = fuel === "All" || vehicle.fuelType === fuel;
      const matchesTransmission =
        transmission === "All" || vehicle.transmission === transmission;

      return matchesSearch && matchesFuel && matchesTransmission;
    });

    if (sort === "low") {
      result.sort((a, b) => Number(a.rentalRate) - Number(b.rentalRate));
    } else if (sort === "high") {
      result.sort((a, b) => Number(b.rentalRate) - Number(a.rentalRate));
    }

    return result;
  }, [vehicles, search, fuel, transmission, sort]);

  function resetFilters() {
    setSearch("");
    setFuel("All");
    setTransmission("All");
    setSort("default");
  }

  function openBooking(vehicle) {
    setSelectedVehicle(vehicle);
    setBookingMessage("");
    setBookingError("");
    setBooking({
      name: "",
      email: customerEmail,
      phone: "",
      licenceNo: "",
      address: "",
      startDate: "",
      endDate: "",
    });
  }

  function closeBooking() {
    if (!bookingLoading) {
      setSelectedVehicle(null);
      setBookingMessage("");
      setBookingError("");
    }
  }

  const today = new Date().toLocaleDateString("en-CA");
  const rentalDays =
    booking.startDate && booking.endDate
      ? Math.round(
          (new Date(booking.endDate + "T00:00:00") -
            new Date(booking.startDate + "T00:00:00")) /
            86400000,
        )
      : 0;

  const totalAmount =
    selectedVehicle && rentalDays > 0
      ? Number(selectedVehicle.rentalRate) * rentalDays
      : 0;

  async function submitBooking(event) {
    event.preventDefault();
    setBookingError("");
    setBookingMessage("");

    if (!selectedVehicle) return;

    if (booking.endDate <= booking.startDate) {
      setBookingError("Return date must be after pickup date.");
      return;
    }

    setBookingLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...booking,
          vehicleId: String(selectedVehicle.vehicleId),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to create booking.");
      }

      setBookingMessage(
        `Booking submitted successfully! Booking ID: ${data.bookingId}. Total: ₹${Number(data.totalAmount).toLocaleString("en-IN")} for ${data.days} day(s). Status: ${data.status}.`,
      );

      setEmailInput(booking.email);
      setCustomerEmail(booking.email);
      localStorage.setItem("driveEaseEmail", booking.email);

      setVehicles((current) =>
        current.map((vehicle) =>
          vehicle.vehicleId === selectedVehicle.vehicleId
            ? { ...vehicle, status: "Rented" }
            : vehicle,
        ),
      );

      await loadBookings(booking.email);
    } catch (err) {
      setBookingError(err.message || "Something went wrong. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  }

  function formatDate(date) {
    if (!date) return "—";

    return new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function getStatusClass(status) {
    return (status || "unknown").toLowerCase();
  }

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/admin"
        element={
          localStorage.getItem("driveEaseRole") === "ADMIN" ? (
            <AdminDashboard />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route
        path="/customer"
        element={
          localStorage.getItem("driveEaseRole") === "CUSTOMER" ? (
            <div className="app">
              <nav className="navbar">
                <h2>
                  Drive<span>Ease</span>
                </h2>
                <div className="nav-links">
                  <a href="#home">Home</a>
                  <a href="#vehicles">Vehicles</a>
                  <a href="#my-bookings">My Bookings</a>
                  <a href="#about">About</a>
                </div>
                <button
                  className="nav-button"
                  onClick={() =>
                    document
                      .getElementById("vehicles")
                      .scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Explore Cars
                </button>
              </nav>

              <section className="hero" id="home">
                <div className="hero-content">
                  <p className="eyebrow">YOUR JOURNEY, YOUR RULES</p>
                  <h1>
                    Find your perfect
                    <br />
                    ride. <span>Drive your way.</span>
                  </h1>
                  <p className="hero-description">
                    Discover the right vehicle for every journey. Simple
                    rentals, transparent pricing, and total freedom.
                  </p>
                  <button
                    onClick={() =>
                      document
                        .getElementById("vehicles")
                        .scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    Browse Vehicles →
                  </button>
                </div>
                <div className="hero-decoration">
                  DRIVE
                  <br />
                  YOUR
                  <br />
                  WAY.
                </div>
              </section>

              <section className="vehicles-section" id="vehicles">
                <div className="section-heading">
                  <div>
                    <p className="eyebrow">OUR COLLECTION</p>
                    <h2>Choose your ride</h2>
                  </div>
                  <p>Find a vehicle that fits your journey.</p>
                </div>

                <div className="vehicle-filters">
                  <input
                    type="text"
                    placeholder="Search by vehicle model..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />

                  <select
                    value={fuel}
                    onChange={(event) => setFuel(event.target.value)}
                  >
                    <option value="All">All Fuel Types</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="CNG">CNG</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>

                  <select
                    value={transmission}
                    onChange={(event) => setTransmission(event.target.value)}
                  >
                    <option value="All">All Transmissions</option>
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                  </select>

                  <select
                    value={sort}
                    onChange={(event) => setSort(event.target.value)}
                  >
                    <option value="default">Sort by Price</option>
                    <option value="low">Price: Low to High</option>
                    <option value="high">Price: High to Low</option>
                  </select>

                  <button className="reset-button" onClick={resetFilters}>
                    Reset
                  </button>
                </div>

                {loading && <p className="message">Loading vehicles...</p>}
                {error && <p className="message error">{error}</p>}

                {!loading && !error && (
                  <>
                    <p className="results-count">
                      Showing {filteredVehicles.length} of {vehicles.length}{" "}
                      vehicles
                    </p>

                    {filteredVehicles.length === 0 ? (
                      <div className="no-results">
                        <h3>No vehicles found</h3>
                        <p>Try changing your search or filters.</p>
                        <button className="reset-button" onClick={resetFilters}>
                          Clear Filters
                        </button>
                      </div>
                    ) : (
                      <div className="vehicle-grid">
                        {filteredVehicles.map((vehicle) => (
                          <article
                            className="vehicle-card"
                            key={vehicle.vehicleId}
                          >
                            <div className="vehicle-visual">
                              <div className="vehicle-placeholder">
                                {vehicle.model}
                              </div>
                              <span className="vehicle-category">
                                VEHICLE #{vehicle.vehicleId}
                              </span>
                              <span
                                className={`status ${getStatusClass(vehicle.status)}`}
                              >
                                {vehicle.status}
                              </span>
                            </div>
                            <div className="vehicle-details">
                              <h3>{vehicle.model}</h3>
                              <p className="registration">
                                {vehicle.registrationNo}
                              </p>
                              <div className="vehicle-specs">
                                <span>{vehicle.fuelType}</span>
                                <span>{vehicle.transmission}</span>
                              </div>
                              <div className="vehicle-bottom">
                                <p>
                                  <strong>
                                    ₹
                                    {Number(vehicle.rentalRate).toLocaleString(
                                      "en-IN",
                                    )}
                                  </strong>{" "}
                                  / day
                                </p>
                                <button
                                  disabled={vehicle.status !== "Available"}
                                  onClick={() => openBooking(vehicle)}
                                >
                                  {vehicle.status === "Available"
                                    ? "Book Now"
                                    : "Unavailable"}
                                </button>
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </section>

              <section className="my-bookings-section" id="my-bookings">
                <div className="section-heading">
                  <div>
                    <p className="eyebrow">YOUR RESERVATIONS</p>
                    <h2>My Bookings</h2>
                  </div>
                  <p>View your rental history and booking status.</p>
                </div>

                <form
                  className="my-bookings-search"
                  onSubmit={(event) => {
                    event.preventDefault();
                    loadBookings(emailInput);
                  }}
                >
                  <input
                    type="email"
                    placeholder="Enter the email used for booking"
                    value={emailInput}
                    onChange={(event) => setEmailInput(event.target.value)}
                    required
                  />
                  <button type="submit" disabled={bookingsLoading}>
                    {bookingsLoading ? "Loading..." : "Find My Bookings"}
                  </button>
                </form>

                {bookingsError && (
                  <p className="booking-error">{bookingsError}</p>
                )}

                {bookingsLoading && (
                  <p className="message">Loading your bookings...</p>
                )}

                {!bookingsLoading &&
                  bookingsSearched &&
                  !bookingsError &&
                  (myBookings.length === 0 ? (
                    <div className="no-results">
                      <h3>No bookings found</h3>
                      <p>We couldn't find any bookings for {customerEmail}.</p>
                    </div>
                  ) : (
                    <>
                      <p className="results-count">
                        Showing {myBookings.length} booking(s) for{" "}
                        {customerEmail}
                      </p>

                      <div className="my-bookings-grid">
                        {myBookings.map((item) => {
                          const vehicle = vehicles.find(
                            (current) => current.vehicleId === item.vehicleId,
                          );

                          return (
                            <article
                              className="my-booking-card"
                              key={item.bookingId}
                            >
                              <div className="my-booking-top">
                                <div>
                                  <p className="eyebrow">BOOKING ID</p>
                                  <h3>#{item.bookingId}</h3>
                                </div>
                                <span
                                  className={`booking-status ${getStatusClass(item.status)}`}
                                >
                                  {item.status}
                                </span>
                              </div>

                              <div className="my-booking-vehicle">
                                <h3>
                                  {vehicle?.model ||
                                    `Vehicle #${item.vehicleId}`}
                                </h3>
                                <p>Vehicle ID: {item.vehicleId}</p>
                                {vehicle && (
                                  <p>
                                    {vehicle.fuelType} · {vehicle.transmission}
                                  </p>
                                )}
                              </div>

                              <div className="my-booking-dates">
                                <div>
                                  <span>Pickup</span>
                                  <strong>{formatDate(item.startDate)}</strong>
                                </div>
                                <div>
                                  <span>Return</span>
                                  <strong>{formatDate(item.endDate)}</strong>
                                </div>
                              </div>

                              <div className="my-booking-bottom">
                                <span>Total estimated amount</span>
                                <strong>
                                  ₹
                                  {Number(
                                    item.totalEstimatedAmount,
                                  ).toLocaleString("en-IN")}
                                </strong>
                              </div>

                              <p className="booking-created">
                                Booked on:{" "}
                                {item.bookingDate
                                  ? formatDate(item.bookingDate.slice(0, 10))
                                  : "—"}
                              </p>
                            </article>
                          );
                        })}
                      </div>
                    </>
                  ))}
              </section>

              <footer id="about">
                <h2>
                  Drive<span>Ease</span>
                </h2>
                <p>Your journey starts here.</p>
                <p>Vehicle Rental Management System · College Project</p>
              </footer>

              {selectedVehicle && (
                <div className="booking-overlay" onClick={closeBooking}>
                  <div
                    className="booking-modal"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <button
                      className="booking-close"
                      onClick={closeBooking}
                      disabled={bookingLoading}
                    >
                      ×
                    </button>
                    <p className="eyebrow">DRIVE EASE RESERVATIONS</p>
                    <h2>Book {selectedVehicle.model}</h2>
                    <p className="booking-rate">
                      ₹
                      {Number(selectedVehicle.rentalRate).toLocaleString(
                        "en-IN",
                      )}{" "}
                      per day
                    </p>

                    {bookingMessage ? (
                      <div className="booking-success">
                        <h3>🎉 Booking submitted</h3>
                        <p>{bookingMessage}</p>
                        <button onClick={closeBooking}>Done</button>
                      </div>
                    ) : (
                      <form className="booking-form" onSubmit={submitBooking}>
                        <h3>Customer details</h3>
                        <input
                          placeholder="Full name"
                          value={booking.name}
                          onChange={(event) =>
                            setBooking({ ...booking, name: event.target.value })
                          }
                          required
                        />
                        <input
                          type="email"
                          placeholder="Email address"
                          value={booking.email}
                          onChange={(event) =>
                            setBooking({
                              ...booking,
                              email: event.target.value,
                            })
                          }
                          required
                        />
                        <input
                          type="tel"
                          placeholder="Phone number"
                          value={booking.phone}
                          onChange={(event) =>
                            setBooking({
                              ...booking,
                              phone: event.target.value,
                            })
                          }
                          required
                        />
                        <input
                          placeholder="Driving licence number"
                          value={booking.licenceNo}
                          onChange={(event) =>
                            setBooking({
                              ...booking,
                              licenceNo: event.target.value,
                            })
                          }
                          required
                        />
                        <input
                          placeholder="Address (optional)"
                          value={booking.address}
                          onChange={(event) =>
                            setBooking({
                              ...booking,
                              address: event.target.value,
                            })
                          }
                        />

                        <h3>Rental dates</h3>
                        <div className="booking-dates">
                          <label>
                            Pickup date
                            <input
                              type="date"
                              min={today}
                              value={booking.startDate}
                              onChange={(event) =>
                                setBooking({
                                  ...booking,
                                  startDate: event.target.value,
                                })
                              }
                              required
                            />
                          </label>
                          <label>
                            Return date
                            <input
                              type="date"
                              min={booking.startDate || today}
                              value={booking.endDate}
                              onChange={(event) =>
                                setBooking({
                                  ...booking,
                                  endDate: event.target.value,
                                })
                              }
                              required
                            />
                          </label>
                        </div>

                        <div className="booking-total">
                          <span>
                            {rentalDays > 0
                              ? `${rentalDays} rental day(s)`
                              : "Select your rental dates"}
                          </span>
                          <strong>
                            ₹{totalAmount.toLocaleString("en-IN")}
                          </strong>
                        </div>

                        {bookingError && (
                          <p className="booking-error">{bookingError}</p>
                        )}

                        <button
                          className="booking-submit"
                          type="submit"
                          disabled={bookingLoading}
                        >
                          {bookingLoading ? "Submitting..." : "Confirm Booking"}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
