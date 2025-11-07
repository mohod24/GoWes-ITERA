// src/components/admin/AdminDashboard.js
import React, { useState } from "react";
import { Navbar } from "../common/Navbar";
import { StatCard } from "../common/StatCard";
import { PendingBookings } from "./pendingbookings";
import { ActiveRentals } from "./activerentals";
import { BikeStatus } from "./bikestatus";
import { BOOKINGS_PER_PAGE } from "../../utils/constants";

export const AdminDashboard = ({
  bikes,
  bookings,
  availableBikes,
  rentedBikes,
  onUpdateBikeStatus,
  onUpdateBookingStatus,
  onLogout,
}) => {
  // State untuk pagination (navigasi halaman)
  const [currentPage, setCurrentPage] = useState(1);

  // Hitung jumlah booking berdasarkan status
  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const activeRentals = bookings.filter((b) => b.status === "active");

  // Fungsi untuk Check-In (dari pending ke active)
  const handleCheckIn = (booking) => {
    onUpdateBikeStatus(booking.bikeId, "dipinjam"); // Ubah status sepeda jadi "dipinjam"
    onUpdateBookingStatus(booking.id, "active"); // Ubah status booking jadi "active"
    alert(`Check-in berhasil untuk ${booking.name}!\nSepeda: ${booking.bikeName}`);
  };

  // Fungsi untuk Pengembalian (dari active ke completed)
  const handleReturn = (booking) => {
    onUpdateBikeStatus(booking.bikeId, "tersedia"); // Ubah status sepeda jadi "tersedia"
    onUpdateBookingStatus(booking.id, "completed"); // Ubah status booking jadi "completed"
    alert(`Pengembalian berhasil!\nSepeda ${booking.bikeName} sekarang tersedia.`);
  };

  // Fungsi untuk Toggle Status Sepeda (manual)
  const handleToggleStatus = (bikeId, currentStatus) => {
    const newStatus = currentStatus === "tersedia" ? "dipinjam" : "tersedia";
    onUpdateBikeStatus(bikeId, newStatus);
    alert(`Status sepeda berhasil diubah ke: ${newStatus}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar Admin */}
      <Navbar isAdmin={true} onLogout={onLogout} />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Manajemen Penyewaan Sepeda</h1>

        {/* Statistik Dashboard - 4 Kartu */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <StatCard
            value={availableBikes}
            label="Sepeda Tersedia"
            textColor="text-green-600"
          />
          <StatCard
            value={rentedBikes}
            label="Sedang Dipinjam"
            textColor="text-red-600"
          />
          <StatCard
            value={pendingBookings.length}
            label="Booking Pending"
            textColor="text-blue-600"
          />
          <StatCard
            value={activeRentals.length}
            label="Rental Aktif"
            textColor="text-purple-600"
          />
        </div>

        {/* Section 1: Pending Bookings - Perlu Check-In */}
        <PendingBookings
          bookings={bookings}
          currentPage={currentPage}
          bookingsPerPage={BOOKINGS_PER_PAGE}
          onPageChange={setCurrentPage}
          onCheckIn={handleCheckIn}
        />

        {/* Section 2: Active Rentals - Sepeda yang Sedang Dipinjam */}
        <ActiveRentals
          bookings={bookings}
          onReturn={handleReturn}
        />

        {/* Section 3: Bike Status - Status Semua Sepeda */}
        <BikeStatus
          bikes={bikes}
          onToggleStatus={handleToggleStatus}
        />
      </div>
    </div>
  );
};