// src/hooks/useAuth.js
import { useState } from "react";
import { ADMIN_PASSWORD } from "../utils/constants";

export const useAuth = () => {
  // State untuk menyimpan status login admin
  const [isAdmin, setIsAdmin] = useState(false);

  // Fungsi untuk login admin
  const login = () => {
    const password = prompt("Masukkan password admin:");
    
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      return true;
    } else {
      alert("Password salah!");
      return false;
    }
  };

  // Fungsi untuk logout admin
  const logout = () => {
    const confirmLogout = window.confirm("Yakin ingin logout?");
    
    if (confirmLogout) {
      setIsAdmin(false);
      return true;
    }
    return false;
  };

  // Return semua fungsi dan state yang bisa digunakan
  return {
    isAdmin,      // Status apakah user adalah admin
    login,        // Fungsi untuk login
    logout,       // Fungsi untuk logout
    setIsAdmin,   // Fungsi untuk set status admin manual (jika diperlukan)
  };
};