// src/components/landing/LandingPage.js
import React from "react";
import { Bike, Clock, MapPin } from "lucide-react";
import { Navbar } from "../common/Navbar";
import { HeroSection } from "./herosection";
import { FeatureCard } from "./featurecard";

export const LandingPage = ({
  availableBikes,
  rentedBikes,
  onNavigate,
  onAdminLogin,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100">
      {/* Navbar */}
      <Navbar onAdminLogin={onAdminLogin} />

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Hero Section - Bagian Utama */}
        <HeroSection onNavigate={onNavigate} />

        {/* Feature Cards - 3 Kartu Fitur */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <FeatureCard
            icon={Bike}
            title="Booking Online"
            description="Pesan sepeda dari rumah, tanpa antre"
            bgColor="bg-green-100 text-green-600"
          />
          <FeatureCard
            icon={Clock}
            title="Real-Time Status"
            description="Lihat ketersediaan sepeda secara langsung"
            bgColor="bg-blue-100 text-blue-600"
          />
          <FeatureCard
            icon={MapPin}
            title="Mudah & Cepat"
            description="Proses check-in yang simpel dan efisien"
            bgColor="bg-purple-100 text-purple-600"
          />
        </div>

        {/* Statistik Hari Ini */}
        <div className="mt-16 bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Statistik Hari Ini
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Sepeda Tersedia */}
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-4xl font-bold text-green-600">
                {availableBikes}
              </div>
              <div className="text-gray-600">Sepeda Tersedia</div>
            </div>

            {/* Sedang Dipinjam */}
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-4xl font-bold text-red-600">
                {rentedBikes}
              </div>
              <div className="text-gray-600">Sedang Dipinjam</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};