// src/components/admin/BikeStatus.js
import React from "react";

export const BikeStatus = ({ bikes, onToggleStatus }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Status Semua Sepeda</h2>
      
      <div className="grid md:grid-cols-2 gap-4">
        {bikes.map((bike) => (
          <div
            key={bike.id}
            className="border border-gray-200 p-4 rounded-lg hover:shadow-md transition"
          >
            <div className="flex justify-between items-center">
              {/* Informasi Sepeda */}
              <div>
                <div className="font-bold text-lg">{bike.name}</div>
                <div className="text-sm text-gray-600">{bike.type}</div>
                <div
                  className={`text-sm font-semibold mt-2 ${
                    bike.status === "tersedia"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {bike.status === "tersedia" ? (
                    <span>✓ Tersedia</span>
                  ) : (
                    <span>✗ Dipinjam</span>
                  )}
                </div>
              </div>

              {/* Tombol Toggle Status */}
              <button
                onClick={() => onToggleStatus(bike.id, bike.status)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition text-sm font-semibold"
              >
                Toggle Status
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};