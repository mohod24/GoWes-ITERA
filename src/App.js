// src/App.js
import React, { useMemo, useState } from "react";
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

  const handleBooking = () => {
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

    const newBooking = {
      id: Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      bikeId: selectedBike.id,
      bikeName: selectedBike.name,
      ...bookingForm,
      requestDate: new Date().toLocaleString("id-ID"),
      checkInDate: null,
      status: "pending",
      bookingCode: `GW${Date.now().toString().slice(-6)}`,
    };

    setBookings((prev) => [...prev, newBooking]);
    updateBikeStatus(selectedBike.id, "dipesan");

    alert(`Pemesanan Berhasil!\n\nKode Booking: ${newBooking.bookingCode}\n\nSilakan tunjukkan kode ini saat check-in di pos penyewaan.`);

    setBookingForm({ name: "", email: "", phone: "", idNumber: "", duration: "1" });
    setSelectedBike(null);
    setPage("myBookings");
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
