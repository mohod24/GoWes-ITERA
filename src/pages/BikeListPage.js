import React, { useState } from "react";
import { Bike, Filter } from "lucide-react";
import Navbar from "../components/Navbar";

export default function BikeListPage({
  bikes,
  currentUser,
  setPage,
  logout,
  handleBookBike,
}) {
  const [filterType, setFilterType] = useState("semua");

  const filtered =
    filterType === "semua"
      ? bikes
      : bikes.filter((b) => b.type === filterType);

  const types = ["semua", "Mountain Bike", "Sepeda Lipat", "City Bike"];

  const getStatusBadge = (status) => {
    if (status === "tersedia") {
      return "bg-green-100 text-green-700";
    } else if (status === "dipesan") {
      return "bg-amber-100 text-amber-700";
    } else {
      return "bg-red-100 text-red-700";
    }
  };

  const getStatusLabel = (status) => {
    if (status === "tersedia") {
      return "Tersedia";
    } else if (status === "dipesan") {
      return "Sudah Dipesan";
    } else {
      return "Sedang Dipinjam";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100">
      <Navbar
        page="bikes"
        currentUser={currentUser}
        setPage={setPage}
        logout={logout}
      />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Bike size={32} className="text-green-600" />
            Daftar Sepeda
          </h2>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-600" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {types.map((t) => (
                <option key={t} value={t}>
                  {t === "semua" ? "Semua Jenis" : t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              Tidak ada sepeda ditemukan untuk filter ini.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((bike) => (
            <div
              key={bike.id}
              className="bg-white rounded-lg shadow hover:shadow-xl transition overflow-hidden"
            >
              <img
                src={bike.imageUrl}
                alt={bike.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-800 mb-1">
                  {bike.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3">{bike.type}</p>
                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded text-sm font-semibold ${getStatusBadge(
                      bike.status
                    )}`}
                  >
                    {getStatusLabel(bike.status)}
                  </span>
                  <button
                    disabled={bike.status !== "tersedia"}
                    onClick={() => handleBookBike(bike)}
                    className={`px-4 py-2 rounded font-semibold transition ${
                      bike.status === "tersedia"
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {bike.status === "tersedia" ? "Pesan" : "Tidak Tersedia"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}