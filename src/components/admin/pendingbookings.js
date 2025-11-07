// src/components/admin/PendingBookings.js
import React from "react";
import { Pagination } from "./pagination";

export const PendingBookings = ({
  bookings,
  currentPage,
  bookingsPerPage,
  onPageChange,
  onCheckIn,
}) => {
  // Filter hanya booking yang statusnya "pending" (belum check-in)
  const pendingBookings = bookings.filter((b) => b.status === "pending");

  // Hitung booking mana yang ditampilkan di halaman saat ini
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = pendingBookings.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4">Booking Pending (Check-In)</h2>
      
      {pendingBookings.length === 0 ? (
        <p className="text-gray-600">Tidak ada booking pending</p>
      ) : (
        <>
          <div className="space-y-4">
            {currentBookings.map((booking) => (
              <div
                key={booking.id}
                className="border border-gray-200 p-4 rounded-lg hover:shadow-md transition"
              >
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Informasi Booking */}
                  <div>
                    <div className="font-bold text-lg mb-2 text-green-600">
                      Kode: {booking.bookingCode}
                    </div>
                    <div className="text-gray-600">
                      <strong>Nama:</strong> {booking.name}
                    </div>
                    <div className="text-gray-600">
                      <strong>Sepeda:</strong> {booking.bikeName}
                    </div>
                    <div className="text-gray-600">
                      <strong>Durasi:</strong> {booking.duration} Jam
                    </div>
                    <div className="text-gray-600">
                      <strong>Telepon:</strong> {booking.phone}
                    </div>
                    <div className="text-gray-600">
                      <strong>Email:</strong> {booking.email}
                    </div>
                    <div className="text-gray-600">
                      <strong>ID:</strong> {booking.idNumber}
                    </div>
                  </div>

                  {/* Tombol Check-In */}
                  <div className="flex items-center justify-end">
                    <button
                      onClick={() => onCheckIn(booking)}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
                    >
                      ✓ Check-In Sekarang
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination - Navigasi Halaman */}
          <Pagination
            totalItems={pendingBookings.length}
            itemsPerPage={bookingsPerPage}
            currentPage={currentPage}
            onPageChange={onPageChange}
          />
        </>
      )}
    </div>
  );
};