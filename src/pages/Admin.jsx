// src/pages/Admin.jsx
import React from "react";
import Navbar from "../components/Navbar";
import { User } from "lucide-react";

export default function Admin({
  page, setPage, currentUser, logout,
  counts, bookings, updateBikeStatus, updateBookingStatus
}) {
  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const activeRentals = bookings.filter((b) => b.status === "active");

  if (currentUser?.role !== "admin") {
    setPage("landing");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar page={page} setPage={setPage} currentUser={currentUser} logout={logout} />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-2">
          <User size={28} />
          <h1 className="text-3xl font-bold">Dashboard Admin</h1>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8 mt-2">
          <div className="bg-white p-6 rounded-lg shadow"><div className="text-3xl font-bold text-green-600">{counts.available}</div><div className="text-gray-600">Sepeda Tersedia</div></div>
          <div className="bg-white p-6 rounded-lg shadow"><div className="text-3xl font-bold text-amber-600">{counts.reserved}</div><div className="text-gray-600">Sudah Dipesan</div></div>
          <div className="bg-white p-6 rounded-lg shadow"><div className="text-3xl font-bold text-red-600">{counts.rented}</div><div className="text-gray-600">Sedang Dipinjam</div></div>
          <div className="bg-white p-6 rounded-lg shadow"><div className="text-3xl font-bold text-blue-600">{activeRentals.length}</div><div className="text-gray-600">Rental Aktif</div></div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Booking Pending (Check-In)</h2>
          {pendingBookings.length === 0 ? (
            <p className="text-gray-600">Tidak ada booking pending</p>
          ) : (
            <div className="space-y-4">
              {pendingBookings.map((booking) => (
                <div key={booking.id} className="border border-gray-200 p-4 rounded-lg">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="font-bold text-lg mb-2">Kode: {booking.bookingCode}</div>
                      <div className="text-gray-600">Nama: {booking.name}</div>
                      <div className="text-gray-600">Sepeda: {booking.bikeName}</div>
                      <div className="text-gray-600">Durasi: {booking.duration} Jam</div>
                      <div className="text-gray-600">Telepon: {booking.phone}</div>
                      <div className="text-gray-600">Pesan: {booking.requestDate}</div>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          updateBikeStatus(booking.bikeId, "dipinjam");
                          updateBookingStatus(booking.id, { status: "active", checkInDate: new Date().toLocaleString("id-ID") });
                          alert("Check-in berhasil! Status sepeda diubah ke Dipinjam");
                        }}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                      >
                        Check-In
                      </button>
                      <button
                        onClick={() => {
                          updateBikeStatus(booking.bikeId, "tersedia");
                          updateBookingStatus(booking.id, "cancelled");
                        }}
                        className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
                      >
                        Batalkan
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Rental Aktif (Pengembalian)</h2>
          {activeRentals.length === 0 ? (
            <p className="text-gray-600">Tidak ada rental aktif</p>
          ) : (
            <div className="space-y-4">
              {activeRentals.map((booking) => (
                <div key={booking.id} className="border border-gray-200 p-4 rounded-lg">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="font-bold text-lg mb-2">Kode: {booking.bookingCode}</div>
                      <div className="text-gray-600">Nama: {booking.name}</div>
                      <div className="text-gray-600">Sepeda: {booking.bikeName}</div>
                      <div className="text-gray-600">Check-in: {booking.checkInDate}</div>
                    </div>
                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => {
                          updateBikeStatus(booking.bikeId, "tersedia");
                          updateBookingStatus(booking.id, "completed");
                          alert("Pengembalian berhasil! Status sepeda diubah ke Tersedia");
                        }}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                      >
                        Kembalikan
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Status Semua Sepeda</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {/** Catatan: hanya tampilan status dan tombol toggle sederhana */}
            {/* Jika ingin lihat detail foto dsb, bisa reuse kartu di halaman Bikes */}
            {counts && /* safe-guard */ null}
          </div>
        </div>
      </div>
    </div>
  );
}
