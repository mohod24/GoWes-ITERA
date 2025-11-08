import React from "react";
import { Calendar, Clock, CreditCard, QrCode, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import { formatRupiah } from "../utils/paymentCalculator";

export default function MyBookingsPage({
  bookings,
  currentUser,
  setPage,
  logout,
  handlePayFromBookings,
}) {
  const myBookings = bookings.filter((b) => b.userId === currentUser?.id);

  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-yellow-100 text-yellow-700",
      active: "bg-green-100 text-green-700",
      completed: "bg-blue-100 text-blue-700",
      cancelled: "bg-red-100 text-red-700",
    };
    const labels = {
      pending: "Menunggu Check-In",
      active: "Sedang Aktif",
      completed: "Selesai",
      cancelled: "Dibatalkan",
    };
    return (
      <span className={`inline-block px-3 py-1 rounded text-sm font-semibold ${badges[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getPaymentStatusBadge = (paymentStatus) => {
    if (paymentStatus === "paid") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded text-sm font-semibold bg-green-100 text-green-700">
          <CheckCircle size={16} />
          Lunas
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded text-sm font-semibold bg-red-100 text-red-700">
          <XCircle size={16} />
          Belum Bayar
        </span>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100">
      <Navbar
        page="myBookings"
        currentUser={currentUser}
        setPage={setPage}
        logout={logout}
      />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Pesanan Saya
        </h2>

        {myBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 mb-4">
              Anda belum memiliki pesanan apapun.
            </p>
            <button
              onClick={() => setPage("bikes")}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Lihat Sepeda Tersedia
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {myBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {booking.bikeName}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {getStatusBadge(booking.status)}
                      {getPaymentStatusBadge(booking.paymentStatus)}
                    </div>
                  </div>
                </div>

                {/* Info Booking */}
                <div className="border-t pt-4 mb-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Informasi Booking:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <QrCode size={16} className="text-gray-400" />
                      <span className="text-gray-600">Kode:</span>
                      <span className="font-mono font-bold text-green-600">{booking.bookingCode}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      <span className="text-gray-600">Tanggal:</span>
                      <span className="font-semibold">{booking.bookingDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-gray-400" />
                      <span className="text-gray-600">Durasi:</span>
                      <span className="font-semibold">{booking.duration} jam</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard size={16} className="text-gray-400" />
                      <span className="text-gray-600">Total Harga:</span>
                      <span className="font-bold text-green-600">{formatRupiah(booking.totalPrice)}</span>
                    </div>
                  </div>
                </div>

                {/* Detail Personal */}
                <div className="border-t pt-4 mb-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Detail Personal:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                    <div>
                      <strong>Nama:</strong> {booking.name}
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
                  </div>
                </div>

                {/* Payment Info */}
                <div className="border-t pt-4 mb-4">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <CreditCard size={18} />
                    Informasi Pembayaran
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Harga Booking:</span>
                      <span className="font-semibold">{formatRupiah(booking.totalPrice)}</span>
                    </div>
                    
                    {booking.status === "completed" && booking.isLate && (
                      <>
                        <div className="flex justify-between text-red-600">
                          <span>Denda Keterlambatan:</span>
                          <span className="font-semibold">{formatRupiah(booking.lateFee)}</span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="text-gray-800 font-semibold">Total Akhir:</span>
                          <span className="font-bold text-red-600">{formatRupiah(booking.finalTotalPrice)}</span>
                        </div>
                        <div className="bg-red-50 border border-red-200 p-3 rounded mt-2">
                          <p className="text-xs text-red-700 flex items-center gap-2">
                            <AlertTriangle size={16} />
                            <span>
                              Terlambat {booking.actualDuration - booking.duration} jam. 
                              Denda: {formatRupiah(5000)}/jam
                            </span>
                          </p>
                        </div>
                      </>
                    )}
                    
                    {booking.paymentStatus === "paid" && booking.paidAt && (
                      <div className="bg-green-50 border border-green-200 p-3 rounded mt-2">
                        <p className="text-xs text-green-700">
                          <strong>✓ Dibayar pada:</strong> {booking.paidAt}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tombol Bayar (jika belum bayar) */}
                {booking.status === "pending" && booking.paymentStatus !== "paid" && (
                  <div className="border-t pt-4">
                    <button
                      onClick={() => handlePayFromBookings(booking)}
                      className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
                    >
                      <CreditCard size={20} />
                      Bayar Sekarang
                    </button>
                  </div>
                )}

                {/* QR CODE (jika sudah bayar & pending) */}
                {booking.status === "pending" && booking.paymentStatus === "paid" && (
                  <div className="border-t pt-4">
                    <div className="bg-yellow-50 border-2 border-yellow-200 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <QrCode size={18} />
                        Siap Check-In
                      </h4>
                      <div className="flex flex-col sm:flex-row items-start gap-4">
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 mb-2">
                            Tunjukkan QR code ini kepada admin untuk melakukan check-in:
                          </p>
                          <div className="bg-white p-3 rounded border">
                            <p className="text-xs text-gray-500">Kode Booking:</p>
                            <p className="font-mono text-lg font-bold text-green-600">{booking.bookingCode}</p>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${booking.bookingCode}`}
                            alt={`QR ${booking.bookingCode}`}
                            className="w-32 h-32 border-2 border-gray-300 rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Check-In Info (jika active) */}
                {booking.status === "active" && booking.checkInDate && (
                  <div className="border-t pt-4 bg-green-50 p-4 rounded">
                    <p className="text-sm text-green-700 mb-2">
                      <strong>✓ Check-in:</strong> {booking.checkInDate}
                    </p>
                    <p className="text-xs text-green-600">
                      Sepeda sedang dalam peminjaman. Kembalikan sesuai waktu yang ditentukan untuk menghindari denda.
                    </p>
                    <div className="mt-3 bg-white border border-green-200 p-3 rounded">
                      <p className="text-xs text-gray-600">
                        <strong>Info Denda:</strong> Denda keterlambatan {formatRupiah(5000)}/jam akan dikenakan jika melewati durasi booking.
                      </p>
                    </div>
                  </div>
                )}

                {/* Return Info (jika completed) */}
                {booking.status === "completed" && booking.returnDate && (
                  <div className={`border-t pt-4 p-4 rounded ${booking.isLate ? 'bg-red-50' : 'bg-blue-50'}`}>
                    <p className={`text-sm mb-2 ${booking.isLate ? 'text-red-700' : 'text-blue-700'}`}>
                      <strong>✓ Dikembalikan:</strong> {booking.returnDate}
                    </p>
                    {booking.isLate ? (
                      <div className="space-y-2">
                        <p className="text-xs text-red-600 flex items-center gap-2">
                          <AlertTriangle size={14} />
                          <span>
                            Sepeda dikembalikan terlambat {booking.actualDuration - booking.duration} jam
                          </span>
                        </p>
                        <div className="bg-white border border-red-200 p-3 rounded">
                          <div className="text-xs space-y-1">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Durasi Booking:</span>
                              <span className="font-semibold">{booking.duration} jam</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Durasi Aktual:</span>
                              <span className="font-semibold">{booking.actualDuration} jam</span>
                            </div>
                            <div className="flex justify-between text-red-600">
                              <span>Keterlambatan:</span>
                              <span className="font-bold">{booking.actualDuration - booking.duration} jam</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-blue-600">
                        Terima kasih telah mengembalikan sepeda tepat waktu! 🎉
                      </p>
                    )}
                  </div>
                )}

                {/* Cancelled Info */}
                {booking.status === "cancelled" && (
                  <div className="border-t pt-4 bg-red-50 p-4 rounded">
                    <p className="text-sm text-red-700">
                      <strong>✗ Dibatalkan</strong>
                    </p>
                    <p className="text-xs text-red-600 mt-1">
                      Booking ini telah dibatalkan.
                    </p>
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