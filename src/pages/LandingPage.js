import React from "react";
import { Bike, Clock, MapPin, CheckCircle } from "lucide-react";
import Navbar from "../components/Navbar";

export default function LandingPage({ counts, setPage, currentUser, logout }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100 flex flex-col">
      <Navbar
        page="landing"
        currentUser={currentUser}
        setPage={setPage}
        logout={logout}
      />
      <div className="max-w-6xl mx-auto px-4 py-16 flex-grow">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Selamat Datang di Go-Wes ITERA
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Sistem Penyewaan Sepeda Online di Kebun Raya ITERA
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={() => setPage("bikes")}
              className="bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition shadow-lg"
            >
              Mulai Menyewa Sepeda
            </button>
            {!currentUser && (
              <button
                onClick={() => setPage("auth")}
                className="bg-white text-green-700 border border-green-600 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-50 transition"
              >
                Masuk / Daftar
              </button>
            )}
          </div>
        </div>

        {/* Fitur Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-2xl transition-shadow">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bike className="text-green-600" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">Booking Online</h3>
            <p className="text-gray-600">Pesan sepeda dari rumah, tanpa antre</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-2xl transition-shadow">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="text-blue-600" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">Real-Time Status</h3>
            <p className="text-gray-600">Lihat ketersediaan sepeda secara langsung</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-2xl transition-shadow">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-purple-600" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">Mudah & Cepat</h3>
            <p className="text-gray-600">Proses check-in yang simpel dan efisien</p>
          </div>
        </div>

        {/* Statistik 3 Status */}
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Statistik Hari Ini
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <Bike className="mx-auto text-green-600 mb-3" size={48} />
              <div className="text-4xl font-bold text-green-600">
                {counts.available}
              </div>
              <div className="text-gray-600 font-semibold mt-2">Sepeda Tersedia</div>
            </div>
            <div className="text-center p-6 bg-amber-50 rounded-lg">
              <Clock className="mx-auto text-amber-600 mb-3" size={48} />
              <div className="text-4xl font-bold text-amber-600">
                {counts.reserved}
              </div>
              <div className="text-gray-600 font-semibold mt-2">Sudah Dipesan</div>
            </div>
            <div className="text-center p-6 bg-red-50 rounded-lg">
              <MapPin className="mx-auto text-red-600 mb-3" size={48} />
              <div className="text-4xl font-bold text-red-600">
                {counts.rented}
              </div>
              <div className="text-gray-600 font-semibold mt-2">Sedang Dipinjam</div>
            </div>
          </div>
        </div>

        {/* Tentang Section */}
        <div className="mt-12 bg-white rounded-lg shadow p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Tentang Go-Wes ITERA
          </h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto leading-relaxed">
            Go-Wes ITERA adalah sistem penyewaan sepeda online yang memudahkan masyarakat umum untuk menikmati keindahan Kebun Raya ITERA. Dengan berbagai pilihan sepeda yang tersedia, Anda dapat memilih sepeda yang sesuai dengan kebutuhan Anda dan langsung melakukan pemesanan secara online. Nikmati pengalaman bersepeda yang menyegarkan di salah satu taman terindah, tanpa perlu repot mengantre.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <p className="text-lg font-semibold mb-1">
              © {new Date().getFullYear()} Go-Wes ITERA
            </p>
            <p className="text-sm opacity-90">
              Kelompok 4 LKMO HMIF ITERA (Tim Transportasi)
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}