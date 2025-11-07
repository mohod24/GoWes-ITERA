// src/components/landing/HeroSection.js
import React from "react";

export const HeroSection = ({ onNavigate }) => {
  return (
    <div className="text-center mb-12">
      {/* Judul Utama */}
      <h1 className="text-5xl font-bold text-gray-800 mb-4">
        Selamat Datang di Go-Wes ITERA
      </h1>
      
      {/* Subtitle */}
      <p className="text-xl text-gray-600 mb-8">
        Sistem Penyewaan Sepeda Online di Kebun Raya ITERA
      </p>
      
      {/* Tombol Call-to-Action */}
      <button
        onClick={onNavigate}
        className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition shadow-lg hover:shadow-xl"
      >
        Mulai Menyewa Sepeda
      </button>
    </div>
  );
};