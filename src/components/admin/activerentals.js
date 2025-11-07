// src/components/admin/ActiveRentals.js
import React from "react";

export const ActiveRentals = ({ bookings, onReturn }) => {
  // Filter hanya booking yang statusnya "active" (sedang dipinjam)
  const activeRentals = bookings.filter((b) => b.status === "active");

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4">Rental Aktif (Pengembalian)</h2>
      
      {activeRentals.length === 0 ? (
        <p className="text-gray-600">Tidak ada rental aktif</p>
      ) : (
        <div className="space-y-4">
          {activeRentals.map((booking) => (
            <div
              key={booking.id}
              className="border border-gray-200 p-4 rounded-lg hover:shadow-md transition"
            >
              <div className="grid md:grid-cols-2 gap-4">
                {/* Informasi Rental */}
                <div>
                  <div className="font-bold text-lg mb-2 text-blue-600">
                    Kode: {booking.bookingCode}
                  </div>
                  <div className="text-gray-600">
                    <strong>Nama:</strong> {booking.name}
                  </div>
                  <div className="text-gray-600">
                    <strong>Sepeda:</strong> {booking.bikeName}
                  </div>
                  <div className="text-gray-600">
                    <strong>Check-in:</strong> {booking.bookingDate}
                  </div>
                  <div className="text-gray-600">
                    <strong>Durasi:</strong> {booking.duration} Jam
                  </div>
                  <div className="text-gray-600">
                    <strong>Telepon:</strong> {booking.phone}
                  </div>
                </div>

                {/* Tombol Pengembalian */}
                <div className="flex items-center justify-end">
                  <button
                    onClick={() => onReturn(booking)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                  >
                    ↩ Kembalikan Sepeda
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};