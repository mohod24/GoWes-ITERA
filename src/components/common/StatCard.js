// src/components/common/StatCard.jsx
import React from "react";

export const StatCard = ({ value, label, bgColor, textColor }) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow ${bgColor}`}>
      <div className={`text-3xl font-bold ${textColor}`}>{value}</div>
      <div className="text-gray-600">{label}</div>
    </div>
  );
};