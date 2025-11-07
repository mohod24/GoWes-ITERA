// src/components/bikes/BikeCard.js
import React from "react";
import { CheckCircle, XCircle } from "lucide-react";

export const BikeCard = ({ bike, onSelect }) => {
  // Cek apakah sepeda tersedia atau tidak
  const isAvailable = bike.status === "tersedia";

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Gambar Sepeda */}
      <img
        src={bike.imageUrl}
        alt={bike.name}
        className="w-full h-48 object-cover"
      />
      
      {/* Konten Kartu */}
      <div className="p-4">
        {/* Nama Sepeda */}
        <h3 className="text-xl font-bold mb-2">{bike.name}</h3>
        
        {/* Tipe Sepeda */}
        <p className="text-gray-600 mb-3">{bike.type}</p>
        
        {/* Status Ketersediaan */}
        <div className="flex items-center mb-4">
          {isAvailable ? (
            <>
              <CheckCircle className="text-green-600 mr-2" size={20} />
              <span className="text-green-600 font-semibold">Tersedia</span>
            </>
          ) : (
            <>
              <XCircle className="text-red-600 mr-2" size={20} />
              <span className="text-red-600 font-semibold">Dipinjam</span>
            </>
          )}
        </div>
        
        {/* Tombol Pesan */}
        <button
          onClick={() => isAvailable && onSelect(bike)}
          disabled={!isAvailable}
          className={`w-full py-2 rounded-lg font-semibold transition ${
            isAvailable
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isAvailable ? "Pesan Sepeda" : "Tidak Tersedia"}
        </button>
      </div>
    </div>
  );
};