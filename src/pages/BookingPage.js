import React from "react";
import { Calendar, User, Mail, Phone, BadgeCheck, Clock, CreditCard, ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar";
import { calculateTotalPrice, formatRupiah } from "../utils/paymentCalculator";

export default function BookingPage({
  bookingForm,
  setBookingForm,
  currentUser,
  setPage,
  logout,
  handleSubmitBooking,
}) {
  const priceInfo = calculateTotalPrice(bookingForm.duration);

  const handleChange = (field, value) => {
    setBookingForm({ ...bookingForm, [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!bookingForm.name || !bookingForm.email || !bookingForm.phone || !bookingForm.identity) {
      alert("Mohon lengkapi semua data!");
      return;
    }
    
    if (bookingForm.duration < 1 || bookingForm.duration > 12) {
      alert("Durasi minimal 1 jam dan maksimal 12 jam!");
      return;
    }
    
    handleSubmitBooking();
  };

  if (!bookingForm.bike) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100">
        <Navbar page="booking" currentUser={currentUser} setPage={setPage} logout={logout} />
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-600 mb-4">Tidak ada sepeda yang dipilih.</p>
            <button
              onClick={() => setPage("bikes")}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Pilih Sepeda
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100">
      <Navbar page="booking" currentUser={currentUser} setPage={setPage} logout={logout} />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button
          onClick={() => setPage("bikes")}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-4 font-semibold"
        >
          <ArrowLeft size={20} />
          Kembali ke Daftar Sepeda
        </button>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Form Booking Sepeda</h2>

          <div className="mb-6 p-4 bg-green-50 rounded-lg border-2 border-green-200">
            <div className="flex items-center gap-4">
              <img
                src={bookingForm.bike.imageUrl}
                alt={bookingForm.bike.name}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-800">{bookingForm.bike.name}</h3>
                <p className="text-sm text-gray-600">{bookingForm.bike.type}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <User size={18} />
                Nama Lengkap
              </label>
              <input
                type="text"
                value={bookingForm.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Masukkan nama lengkap"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Mail size={18} />
                Email
              </label>
              <input
                type="email"
                value={bookingForm.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="email@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Phone size={18} />
                Nomor Telepon
              </label>
              <input
                type="tel"
                value={bookingForm.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="08xxxxxxxxxx"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <BadgeCheck size={18} />
                Nomor Identitas (KTP/KTM)
              </label>
              <input
                type="text"
                value={bookingForm.identity}
                onChange={(e) => handleChange("identity", e.target.value)}
                placeholder="Nomor KTP atau KTM"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Clock size={18} />
                Durasi Peminjaman (Jam)
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleChange("duration", Math.max(1, bookingForm.duration - 1))}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition"
                >
                  -
                </button>
                <input
                  type="number"
                  value={bookingForm.duration}
                  onChange={(e) => handleChange("duration", Math.max(1, Math.min(12, parseInt(e.target.value) || 1)))}
                  min="1"
                  max="12"
                  className="w-20 text-center px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-bold text-lg"
                  required
                />
                <button
                  type="button"
                  onClick={() => handleChange("duration", Math.min(12, bookingForm.duration + 1))}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition"
                >
                  +
                </button>
                <span className="text-gray-600 font-semibold">Jam</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Minimal 1 jam, maksimal 12 jam per booking
              </p>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <CreditCard size={20} />
                Informasi Harga
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Harga per jam:</span>
                  <span className="font-semibold">{formatRupiah(10000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Durasi:</span>
                  <span className="font-semibold">{bookingForm.duration} jam</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Perhitungan:</span>
                  <span className="font-semibold">
                    {bookingForm.duration} × {formatRupiah(10000)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border-2 border-green-200 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Total Pembayaran</div>
                  <div className="text-xs text-gray-500">
                    Harus dibayar sebelum check-in
                  </div>
                </div>
                <div className="text-3xl font-bold text-green-600">
                  {formatRupiah(priceInfo.totalPrice)}
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>⚠️ Perhatian:</strong> Jika terlambat mengembalikan sepeda, akan dikenakan denda{" "}
                <strong>{formatRupiah(5000)}/jam</strong> untuk setiap jam keterlambatan.
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
            >
              <Calendar size={20} />
              Lanjutkan ke Pembayaran
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}