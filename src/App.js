// src/App.js
import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

import { initialBikes, LS_BIKES, LS_BOOKINGS, LS_USER, LS_USERS } from "./lib/constants";
import useLocalStorageState from "./lib/storage";
import { weakHash } from "./lib/crypto";

import Landing from "./pages/Landing";
import Bikes from "./pages/Bikes";
import Booking from "./pages/Booking";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import MyBookings from "./pages/MyBookings";

// === API services (backend) ===
import {
  createBooking,
  listBookings,
  // berikut nanti bisa dipakai di Admin:
  checkInBooking,
  returnBooking,
  cancelBooking,
} from "./services/api";

export default function App() {
  const [page, setPage] = useState("landing");

  // simpanan localStorage
  const [bikes, setBikes] = useLocalStorageState(LS_BIKES, initialBikes);
  const [bookings, setBookings] = useLocalStorageState(LS_BOOKINGS, []);
  const [currentUser, setCurrentUser] = useLocalStorageState(LS_USER, null);
  const [users, setUsers] = useLocalStorageState(LS_USERS, []);

  // state lain
  const [selectedBike, setSelectedBike] = useState(null);
  const [pendingSelectedBike, setPendingSelectedBike] = useState(null);
  const [authTab, setAuthTab] = useState("login");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [regForm, setRegForm] = useState({ name: "", email: "", idNumber: "", password: "", confirm: "" });
  const [adminPwd, setAdminPwd] = useState("");
  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    phone: "",
    idNumber: "",
    duration: "1",
  });

  const isAdmin = currentUser?.role === "admin";

  const counts = useMemo(() => {
    const available = bikes.filter((b) => b.status === "tersedia").length;
    const rented = bikes.filter((b) => b.status === "dipinjam").length;
    const reserved = bikes.filter((b) => b.status === "dipesan").length;
    return { available, rented, reserved };
  }, [bikes]);

  const updateBikeStatus = (bikeId, newStatus) => {
    setBikes((prev) => prev.map((bike) => (bike.id === bikeId ? { ...bike, status: newStatus } : bike)));
  };

  const updateBookingStatus = (bookingId, patch) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === bookingId
          ? { ...booking, ...(typeof patch === "string" ? { status: patch } : patch) }
          : booking
      )
    );
  };

  // === Ambil data bookings dari backend sekali saat mount ===
  useEffect(() => {
    (async () => {
      try {
        const server = await listBookings();
        if (Array.isArray(server)) {
          setBookings(server);
        }
      } catch (e) {
        console.warn("Gagal memuat data dari API:", e.message);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // === Booking lewat backend ===
  const handleBooking = async () => {
    if (!currentUser || currentUser.role !== "user") {
      alert("Silakan daftar/masuk sebagai pengguna terlebih dahulu.");
      setPendingSelectedBike(selectedBike);
      setPage("auth");
      setAuthTab("login");
      return;
    }

    if (!bookingForm.name || !bookingForm.email || !bookingForm.phone || !bookingForm.idNumber) {
      alert("Mohon lengkapi semua data!");
      return;
    }

    if (!selectedBike || selectedBike.status !== "tersedia") {
      alert("Sepeda tidak tersedia.");
      return;
    }

    const payload = {
      userId: currentUser.id,
      userName: currentUser.name,
      bikeId: selectedBike.id,
      bikeName: selectedBike.name,
      name: bookingForm.name,
      email: bookingForm.email,
      phone: bookingForm.phone,
      idNumber: bookingForm.idNumber,
      duration: bookingForm.duration,
    };

    try {
      const serverBooking = await createBooking(payload);

      // Update UI lokal agar konsisten dengan perilaku lama
      setBookings((prev) => [...prev, serverBooking]);
      updateBikeStatus(selectedBike.id, "dipesan");

      alert(
        `Pemesanan Berhasil!\n\n` +
        `Kode Booking: ${serverBooking.bookingCode}\n\n` +
        `Silakan tunjukkan kode ini saat check-in di pos penyewaan.`
      );

      setBookingForm({ name: "", email: "", phone: "", idNumber: "", duration: "1" });
      setSelectedBike(null);
      setPage("myBookings");
    } catch (err) {
      alert("Gagal menyimpan ke server: " + err.message);
    }
  };

  // Auth helpers
  const logout = () => {
    setCurrentUser(null);
    setPage("landing");
  };

  const registerUser = () => {
    const { name, email, idNumber, password, confirm } = regForm;
    if (!name || !email || !password || !confirm) {
      alert("Nama, email, password wajib diisi");
      return;
    }
    if (password.length < 6) {
      alert("Password minimal 6 karakter");
      return;
    }
    if (password !== confirm) {
      alert("Konfirmasi password tidak cocok");
      return;
    }
    const emailLower = email.trim().toLowerCase();
    const exists = users.some((u) => u.email === emailLower);
    if (exists) {
      alert("Email sudah terdaftar. Silakan masuk.");
      setAuthTab("login");
      return;
    }
    const user = {
      id: `u_${Date.now()}`,
      role: "user",
      name: name.trim(),
      email: emailLower,
      idNumber: idNumber?.trim() || "",
      passHash: weakHash(password),
    };
    setUsers((prev) => [...prev, user]);
    alert("Pendaftaran berhasil! Silakan masuk dengan email & password tadi.");
    setRegForm({ name: "", email: "", idNumber: "", password: "", confirm: "" });
    setAuthTab("login");
  };

  const loginUser = () => {
    const emailLower = loginForm.email.trim().toLowerCase();
    const user = users.find((u) => u.email === emailLower && u.passHash === weakHash(loginForm.password));
    if (!user) {
      alert("Email atau password salah, atau akun belum terdaftar.");
      return;
    }
    setCurrentUser(user);
    if (pendingSelectedBike && pendingSelectedBike.status === "tersedia") {
      setSelectedBike(pendingSelectedBike);
      setPendingSelectedBike(null);
      setPage("booking");
    } else {
      setPage("bikes");
    }
    setLoginForm({ email: "", password: "" });
  };

  const loginAdmin = () => {
    if (adminPwd === "admin123") {
      setCurrentUser({ id: "admin", role: "admin", name: "Admin" });
      setAdminPwd("");
      setPage("admin");
    } else {
      alert("Password admin salah");
    }
  };

  // Router sederhana
  if (page === "landing") {
    return (
      <Landing
        page={page} setPage={setPage} currentUser={currentUser} logout={logout}
        counts={counts}
      />
    );
  }

  if (page === "bikes") {
    return (
      <Bikes
        page={page} setPage={setPage} currentUser={currentUser} logout={logout}
        bikes={bikes}
        setSelectedBike={setSelectedBike}
        setPendingSelectedBike={setPendingSelectedBike}
        setAuthTab={setAuthTab}
      />
    );
  }

  if (page === "booking") {
    return (
      <Booking
        page={page} setPage={setPage} currentUser={currentUser} logout={logout}
        selectedBike={selectedBike}
        bookingForm={bookingForm}
        setBookingForm={setBookingForm}
        handleBooking={handleBooking}
      />
    );
  }

  if (page === "admin" && isAdmin) {
    return (
      <Admin
        page={page} setPage={setPage} currentUser={currentUser} logout={logout}
        counts={counts}
        bookings={bookings}
        updateBikeStatus={updateBikeStatus}
        updateBookingStatus={updateBookingStatus}
      />
    );
  }

  if (page === "auth") {
    return (
      <Auth
        page={page} setPage={setPage} currentUser={currentUser} logout={logout}
        authTab={authTab} setAuthTab={setAuthTab}
        loginForm={loginForm} setLoginForm={setLoginForm}
        regForm={regForm} setRegForm={setRegForm}
        adminPwd={adminPwd} setAdminPwd={setAdminPwd}
        loginUser={loginUser} registerUser={registerUser} loginAdmin={loginAdmin}
      />
    );
  }

  if (page === "myBookings" && currentUser?.role === "user") {
    return (
      <MyBookings
        page={page} setPage={setPage} currentUser={currentUser} logout={logout}
        bookings={bookings}
      />
    );
  }

  // fallback
  setPage("landing");
  return null;
}
