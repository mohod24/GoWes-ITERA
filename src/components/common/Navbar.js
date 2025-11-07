// src/components/common/Navbar.jsx
import React from "react";
import { Bike, LogOut, User } from "lucide-react";

export const Navbar = ({ isAdmin, onNavigate, onAdminLogin, onLogout }) => {
  if (isAdmin) {
    return (
      <nav className="bg-green-600 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <User size={32} />
            <span className="text-2xl font-bold">Dashboard Admin</span>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center space-x-2 hover:bg-green-700 px-4 py-2 rounded transition"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Bike className="text-green-600" size={32} />
          <span className="text-2xl font-bold text-green-600">
            Go-Wes ITERA
          </span>
        </div>
        <button
          onClick={onNavigate || onAdminLogin}
          className="text-gray-600 hover:text-green-600 transition"
        >
          {onNavigate ? "Beranda" : "Admin"}
        </button>
      </div>
    </nav>
  );
};