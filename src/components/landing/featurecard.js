// src/components/landing/FeatureCard.js
import React from "react";

export const FeatureCard = ({ icon: Icon, title, description, bgColor }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition">
      {/* Icon dengan Background Berwarna */}
      <div
        className={`${bgColor} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}
      >
        <Icon size={32} />
      </div>
      
      {/* Judul Fitur */}
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      
      {/* Deskripsi Fitur */}
      <p className="text-gray-600">{description}</p>
    </div>
  );
};