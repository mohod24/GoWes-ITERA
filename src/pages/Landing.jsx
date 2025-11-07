// src/pages/Landing.jsx
import React from "react";
import { Bike, Clock, MapPin } from "lucide-react";
import Navbar from "../components/Navbar";

export default function Landing({ counts, currentUser, page, setPage, logout }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100">
      <Navbar page={page} setPage={setPage} currentUser={currentUser} logout={logout} />

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Selamat Datang di Go-Wes ITERA</h1>
          <p className="text-xl text-gray-600 mb-8">Sistem Penyewaan Sepeda Online di Kebun Raya ITERA</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => setPage("bikes")} className="bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition shadow-lg">
              Mulai Menyewa Sepeda
            </button>
            {!currentUser && (
              <button onClick={() => setPage("auth")} className="bg-white text-green-700 border border-green-600 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-50 transition">
                Masuk / Daftar
              </button>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center card-hover animate-fade-in">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bike className="text-green-600" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Booking Online</h3>
            <p className="text-gray-600">Pesan sepeda dari rumah, tanpa antre</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg text-center card-hover animate-fade-in">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="text-blue-600" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Real-Time Status</h3>
            <p className="text-gray-600">Lihat ketersediaan sepeda secara langsung</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg text-center card-hover animate-fade-in">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="text-purple-600" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Mudah & Cepat</h3>
            <p className="text-gray-600">Proses check-in yang simpel dan efisien</p>
          </div>
        </div>

        <div className="mt-16 bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-center">Statistik Hari Ini</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-4xl font-bold text-green-600">{counts.available}</div>
              <div className="text-gray-600">Sepeda Tersedia</div>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <div className="text-4xl font-bold text-amber-600">{counts.reserved}</div>
              <div className="text-gray-600">Sudah Dipesan</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-4xl font-bold text-red-600">{counts.rented}</div>
              <div className="text-gray-600">Sedang Dipinjam</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
