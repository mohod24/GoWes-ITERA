import React from "react";
import { CheckCircle, XCircle, Bike, LogIn, RotateCcw } from "lucide-react";
import Navbar from "../components/Navbar";

export default function AdminDashboard({
  bookings,
  bikes,
  currentUser,
  setPage,
  logout,
  handleCheckIn,
  handleCancelBooking,
  handleReturnBike,
  handleToggleBikeStatus,
}) {
  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const activeRentals = bookings.filter((b) => b.status === "active");

  const statsData = {
    totalBikes: bikes.length,
    available: bikes.filter((b) => b.status === "tersedia").length,
    pendingBookings: pendingBookings.length,
    activeRentals: activeRentals.length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100">
      <Navbar
        page="admin"
        currentUser={currentUser}
        setPage={setPage}
        logout={logout}
      />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Dashboard Admin
        </h2>

        {/* Stats - HANYA 4 KOTAK */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-gray-800">
              {statsData.totalBikes}
            </div>
            <div className="text-sm text-gray-600">Total Sepeda</div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">
              {statsData.available}
            </div>
            <div className="text-sm text-gray-600">Tersedia</div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-yellow-600">
              {statsData.pendingBookings}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">
              {statsData.activeRentals}
            </div>
            <div className="text-sm text-gray-600">Aktif</div>
          </div>
        </div>

        {/* Pending Bookings */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <LogIn size={24} className="text-yellow-600" />
            Booking Menunggu Check-In ({pendingBookings.length})
          </h3>
          {pendingBookings.length === 0 ? (
            <p className="text-gray-600">Tidak ada booking menunggu check-in.</p>
          ) : (
            <div className="space-y-4">
              {pendingBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="border-2 border-yellow-200 rounded-lg p-4 bg-yellow-50"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-lg font-bold text-gray-800">
                          {booking.bookingCode}
                        </span>
                        <span className="px-2 py-0.5 bg-yellow-200 text-yellow-800 text-xs rounded font-semibold">
                          PENDING
                        </span>
                      </div>
                      <div className="font-semibold text-gray-800 mb-1">
                        {booking.name}
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>
                          <strong>Sepeda:</strong> {booking.bikeName}
                        </div>
                        <div>
                          <strong>Durasi:</strong> {booking.duration} jam
                        </div>
                        <div>
                          <strong>Email:</strong> {booking.email}
                        </div>
                        <div>
                          <strong>Telepon:</strong> {booking.phone}
                        </div>
                        <div>
                          <strong>Identitas:</strong> {booking.identity}
                        </div>
                        <div>
                          <strong>Tanggal Booking:</strong> {booking.bookingDate}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => handleCheckIn(booking.id)}
                        className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-semibold"
                      >
                        <CheckCircle size={18} />
                        Check-In
                      </button>
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-semibold"
                      >
                        <XCircle size={18} />
                        Batalkan
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Rentals */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Bike size={24} className="text-blue-600" />
            Rental Aktif ({activeRentals.length})
          </h3>
          {activeRentals.length === 0 ? (
            <p className="text-gray-600">Tidak ada rental aktif saat ini.</p>
          ) : (
            <div className="space-y-4">
              {activeRentals.map((booking) => (
                <div
                  key={booking.id}
                  className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-lg font-bold text-gray-800">
                          {booking.bookingCode}
                        </span>
                        <span className="px-2 py-0.5 bg-blue-200 text-blue-800 text-xs rounded font-semibold">
                          AKTIF
                        </span>
                      </div>
                      <div className="font-semibold text-gray-800 mb-1">
                        {booking.name}
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>
                          <strong>Sepeda:</strong> {booking.bikeName}
                        </div>
                        <div>
                          <strong>Durasi:</strong> {booking.duration} jam
                        </div>
                        <div>
                          <strong>Check-In:</strong> {booking.checkInDate}
                        </div>
                        <div>
                          <strong>Telepon:</strong> {booking.phone}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => handleReturnBike(booking.id)}
                        className="flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition font-semibold"
                      >
                        <RotateCcw size={18} />
                        Kembalikan
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bike Management */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Manajemen Status Sepeda
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bikes.map((bike) => (
              <div
                key={bike.id}
                className="border rounded-lg p-4 flex flex-col gap-2"
              >
                <div className="flex items-center gap-3">
                  <Bike
                    className={
                      bike.status === "tersedia"
                        ? "text-green-600"
                        : bike.status === "dipesan"
                        ? "text-amber-600"
                        : "text-red-600"
                    }
                    size={24}
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">
                      {bike.name}
                    </div>
                    <div className="text-xs text-gray-600">{bike.type}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      bike.status === "tersedia"
                        ? "bg-green-100 text-green-700"
                        : bike.status === "dipesan"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {bike.status === "tersedia"
                      ? "Tersedia"
                      : bike.status === "dipesan"
                      ? "Dipesan"
                      : "Dipinjam"}
                  </span>
                  <button
                    onClick={() => handleToggleBikeStatus(bike.id)}
                    className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Toggle
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}