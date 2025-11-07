// src/components/booking/BookingForm.jsx
import React from "react";
import { Navbar } from "../common/Navbar";

export const BookingForm = ({
  selectedBike,
  bookingForm,
  onFormChange,
  onSubmit,
  onBack,
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onNavigate={onBack} />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Form Pemesanan</h1>
        <p className="text-gray-600 mb-8">
          Isi data diri untuk melanjutkan pemesanan
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6">
          <div className="font-semibold">Sepeda Dipilih:</div>
          <div className="text-lg">
            {selectedBike.name} - {selectedBike.type}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Nama Lengkap *
            </label>
            <input
              type="text"
              value={bookingForm.name}
              onChange={(e) => onFormChange("name", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
              placeholder="Masukkan nama lengkap"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Email *
            </label>
            <input
              type="email"
              value={bookingForm.email}
              onChange={(e) => onFormChange("email", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
              placeholder="email@example.com"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              No. Telepon *
            </label>
            <input
              type="tel"
              value={bookingForm.phone}
              onChange={(e) => onFormChange("phone", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
              placeholder="08xxxxxxxxxx"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              NIM / No. Identitas *
            </label>
            <input
              type="text"
              value={bookingForm.idNumber}
              onChange={(e) => onFormChange("idNumber", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
              placeholder="NIM atau No. KTP"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Durasi Penyewaan *
            </label>
            <select
              value={bookingForm.duration}
              onChange={(e) => onFormChange("duration", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
            >
              <option value="1">1 Jam</option>
              <option value="2">2 Jam</option>
              <option value="3">3 Jam</option>
              <option value="4">4 Jam</option>
            </select>
          </div>

          <button
            onClick={onSubmit}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Konfirmasi Pemesanan
          </button>
        </div>
      </div>
    </div>
  );
};