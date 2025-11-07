// src/App.jsx
import React, { useState } from "react";
import { LandingPage } from "./components/landing/landingpage";
import { BikeList } from "./components/bikes/bikelist";
import { BookingForm } from "./components/booking/bookingform";
import { AdminDashboard } from "./components/admin/admindashboard";
import { initialBikes, ADMIN_PASSWORD } from "./utils/constants";


function App() {
  const [page, setPage] = useState("landing");
  const [bikes, setBikes] = useState(initialBikes);
  const [bookings, setBookings] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedBike, setSelectedBike] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    phone: "",
    idNumber: "",
    duration: "1",
  });

  const handleAdminLogin = () => {
    const password = prompt("Masukkan password admin:");
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setPage("admin");
    } else {
      alert("Password salah!");
    }
  };

  const handleBooking = () => {
    if (
      !bookingForm.name ||
      !bookingForm.email ||
      !bookingForm.phone ||
      !bookingForm.idNumber
    ) {
      alert("Mohon lengkapi semua data!");
      return;
    }

    const newBooking = {
      id: Date.now(),
      bikeId: selectedBike.id,
      bikeName: selectedBike.name,
      ...bookingForm,
      bookingDate: new Date().toLocaleString("id-ID"),
      status: "pending",
      bookingCode: `GW${Date.now().toString().slice(-6)}`,
    };

    setBookings([...bookings, newBooking]);
    alert(
      `Pemesanan Berhasil!\n\nKode Booking: ${newBooking.bookingCode}\n\nSilakan tunjukkan kode ini saat check-in di pos penyewaan.`
    );

    setBookingForm({
      name: "",
      email: "",
      phone: "",
      idNumber: "",
      duration: "1",
    });
    setSelectedBike(null);
    setPage("bikes");
  };

  const updateBikeStatus = (bikeId, newStatus) => {
    setBikes(
      bikes.map((bike) =>
        bike.id === bikeId ? { ...bike, status: newStatus } : bike
      )
    );
  };

  const updateBookingStatus = (bookingId, newStatus) => {
    setBookings(
      bookings.map((booking) =>
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      )
    );
  };

  const availableBikes = bikes.filter((b) => b.status === "tersedia").length;
  const rentedBikes = bikes.filter((b) => b.status === "dipinjam").length;

  // Render pages
  if (page === "landing") {
    return (
      <LandingPage
        availableBikes={availableBikes}
        rentedBikes={rentedBikes}
        onNavigate={() => setPage("bikes")}
        onAdminLogin={handleAdminLogin}
      />
    );
  }

  if (page === "bikes") {
    return (
      <BikeList
        bikes={bikes}
        onBack={() => setPage("landing")}
        onSelectBike={(bike) => {
          setSelectedBike(bike);
          setPage("booking");
        }}
      />
    );
  }

  if (page === "booking" && selectedBike) {
    return (
      <BookingForm
        selectedBike={selectedBike}
        bookingForm={bookingForm}
        onFormChange={(field, value) =>
          setBookingForm({ ...bookingForm, [field]: value })
        }
        onSubmit={handleBooking}
        onBack={() => {
          setPage("bikes");
          setSelectedBike(null);
        }}
      />
    );
  }

  if (page === "admin" && isAdmin) {
    return (
      <AdminDashboard
        bikes={bikes}
        bookings={bookings}
        availableBikes={availableBikes}
        rentedBikes={rentedBikes}
        onUpdateBikeStatus={updateBikeStatus}
        onUpdateBookingStatus={updateBookingStatus}
        onLogout={() => {
          setIsAdmin(false);
          setPage("landing");
        }}
      />
    );
  }

  return null;
}

export default App;