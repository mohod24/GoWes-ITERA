// src/pages/MyBookings.jsx
import React from "react";
import Navbar from "../components/Navbar";

export default function MyBookings({ page, setPage, currentUser, logout, bookings }) {
  const mine = bookings.filter((b) => b.userId === currentUser?.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar page={page} setPage={setPage} currentUser={currentUser} logout={logout} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Pesanan Saya</h1>

        {(!mine || mine.length === 0) ? (
          <div className="bg-white p-6 rounded-lg shadow text-gray-600">
            Belum ada pesanan. Mulai dari halaman{" "}
            <button className="text-green-600 underline" onClick={() => setPage("bikes")}>Daftar Sepeda</button>.
          </div>
        ) : (
          <div className="space-y-4">
            {mine.map((booking) => (
              <div key={booking.id} className="bg-white p-4 rounded-lg shadow">
                <div className="flex flex-wrap justify-between gap-2">
                  <div>
                    <div className="font-bold text-lg">{booking.bikeName}</div>
                    <div className="text-sm text-gray-600">Kode: {booking.bookingCode}</div>
                    <div className="text-sm text-gray-600">Durasi: {booking.duration} Jam</div>
                    <div className="text-sm text-gray-600">Dipesan: {booking.requestDate}</div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      booking.status === "pending" ? "bg-amber-100 text-amber-700" :
                      booking.status === "active" ? "bg-blue-100 text-blue-700" :
                      booking.status === "completed" ? "bg-green-100 text-green-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>

                {booking.status === "pending" && (
                  <div className="mt-4 flex items-center gap-4 border-t pt-4">
                    <img
                      src="/image/QR.png"
                      alt={`QR ${booking.bookingCode}`}
                      className="w-28 h-28 rounded-lg border"
                    />
                    <div className="text-sm text-gray-600">
                      Tunjukkan QR ini saat check-in. Pastikan kode booking cocok:
                      <div className="font-mono text-base text-gray-800">{booking.bookingCode}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
