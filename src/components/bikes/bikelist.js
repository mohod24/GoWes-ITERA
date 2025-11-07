// src/components/bikes/BikeList.jsx
import React from "react";
import { Navbar } from "../common/Navbar";
import { BikeCard } from "./bikecard";

export const BikeList = ({ bikes, onBack, onSelectBike }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onNavigate={onBack} />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Daftar Sepeda</h1>
        <p className="text-gray-600 mb-8">
          Pilih sepeda yang ingin Anda sewa
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {bikes.map((bike) => (
            <BikeCard key={bike.id} bike={bike} onSelect={onSelectBike} />
          ))}
        </div>
      </div>
    </div>
  );
};