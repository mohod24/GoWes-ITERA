import React, { useState, useMemo } from "react";
import "./App.css";
import useLocalStorageState from "./hooks/useLocalStorageState";
import useToast from "./hooks/useToast";
import ToastContainer from "./components/ToastContainer";
import weakHash from "./utils/weakHash";
import initialBikes from "./data/initialsBikes";
import { calculateTotalPrice, calculateActualDuration } from "./utils/paymentCalculator";

// Pages
import LandingPage from "./pages/LandingPage";
import BikeListPage from "./pages/BikeListPage";
import BookingPage from "./pages/BookingPage";
import AdminDashboard from "./pages/AdminDashboard";
import AuthPage from "./pages/AuthPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import PaymentPage from "./pages/PaymentPage";

function App() {
  // Toast System
  const { toasts, removeToast, success, error, warning, info } = useToast();

  // State Management
  const [bikes, setBikes] = useLocalStorageState("bikes", initialBikes);
  const [bookings, setBookings] = useLocalStorageState("bookings", []);
  const [users, setUsers] = useLocalStorageState("users", []);
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState("landing");
  
  // Pending bike untuk flow login
  const [pendingSelectedBike, setPendingSelectedBike] = useState(null);
  
  // Selected booking untuk payment
  const [selectedBookingForPayment, setSelectedBookingForPayment] = useState(null);

  // Auth Forms
  const [authTab, setAuthTab] = useState("login");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [adminLoginForm, setAdminLoginForm] = useState({
    email: "",
    password: "",
  });

  // Booking Form
  const [bookingForm, setBookingForm] = useState({
    bike: null,
    name: "",
    email: "",
    phone: "",
    identity: "",
    duration: 1,
  });

  // Counts untuk statistik 3 status
  const counts = useMemo(() => {
    const available = bikes.filter((b) => b.status === "tersedia").length;
    const reserved = bikes.filter((b) => b.status === "dipesan").length;
    const rented = bikes.filter((b) => b.status === "dipinjam").length;
    return { available, reserved, rented };
  }, [bikes]);

  // Auth Handlers
  const handleLogin = () => {
    const user = users.find(
      (u) =>
        u.email === loginForm.email &&
        u.passwordHash === weakHash(loginForm.password) &&
        u.role === "user"
    );
    if (user) {
      setCurrentUser(user);
      setLoginForm({ email: "", password: "" });
      
      if (pendingSelectedBike && pendingSelectedBike.status === "tersedia") {
        setBookingForm({
          bike: pendingSelectedBike,
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          identity: "",
          duration: 1,
        });
        setPendingSelectedBike(null);
        setPage("booking");
        success(`Selamat datang, ${user.name}! Lanjutkan booking Anda.`);
      } else {
        setPage("landing");
        success(`Selamat datang kembali, ${user.name}!`);
      }
    } else {
      error("Email atau password salah!");
    }
  };

  const handleRegister = () => {
    if (users.find((u) => u.email === registerForm.email)) {
      error("Email sudah terdaftar!");
      return;
    }
    const newUser = {
      id: Date.now(),
      name: registerForm.name,
      email: registerForm.email,
      phone: registerForm.phone,
      passwordHash: weakHash(registerForm.password),
      role: "user",
    };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    setRegisterForm({ name: "", email: "", phone: "", password: "" });
    
    if (pendingSelectedBike && pendingSelectedBike.status === "tersedia") {
      setBookingForm({
        bike: pendingSelectedBike,
        name: newUser.name || "",
        email: newUser.email || "",
        phone: newUser.phone || "",
        identity: "",
        duration: 1,
      });
      setPendingSelectedBike(null);
      setPage("booking");
      success(`Registrasi berhasil! Selamat datang, ${newUser.name}!`);
    } else {
      setPage("landing");
      success(`Registrasi berhasil! Selamat bergabung, ${newUser.name}!`);
    }
  };

  const handleAdminLogin = () => {
    if (
      adminLoginForm.email === "admin@itera.ac.id" &&
      adminLoginForm.password === "admin123"
    ) {
      const admin = {
        id: "admin",
        name: "Admin",
        email: "admin@itera.ac.id",
        role: "admin",
      };
      setCurrentUser(admin);
      setPage("admin");
      setAdminLoginForm({ email: "", password: "" });
      success("Login admin berhasil! Selamat datang di Dashboard.");
    } else {
      error("Email atau password admin salah!");
    }
    setBookingForm({
      bike,
      name: currentUser.name || "",
      email: currentUser.email || "",
      phone: currentUser.phone || "",
      identity: "",
      duration: 1,
    });
    setPage("booking");
  };

  const logout = () => {
    const userName = currentUser?.name;
    setCurrentUser(null);
    setPendingSelectedBike(null);
    setPage("landing");
    info(`Sampai jumpa, ${userName}! Anda telah logout.`);
  };

  // Booking Handlers
  const handleBookBike = (bike) => {
    if (!currentUser) {
      setPendingSelectedBike(bike);
      warning("Silakan login atau daftar terlebih dahulu untuk booking!");
      setPage("auth");
      setAuthTab("login");
      return;
    }
    if (currentUser.role === "admin") {
      error("Admin tidak bisa melakukan booking!");
      return;
    }
    setBookingForm({
      bike,
      name: currentUser.name || "",
      email: currentUser.email || "",
      phone: currentUser.phone || "",
      identity: "",
      duration: 1,
    });
    setPage("booking");
  };

  const handleSubmitBooking = () => {
    const bookingCode = `GW${Date.now().toString().slice(-6)}`;
    const priceCalc = calculateTotalPrice(bookingForm.duration);
    
    const newBooking = {
      id: Date.now(),
      userId: currentUser.id,
      bikeId: bookingForm.bike.id,
      bikeName: bookingForm.bike.name,
      name: bookingForm.name,
      email: bookingForm.email,
      phone: bookingForm.phone,
      identity: bookingForm.identity,
      duration: bookingForm.duration,
      bookingCode: bookingCode,
      status: "pending",
      paymentStatus: "unpaid",
      totalPrice: priceCalc.totalPrice,
      bookingDate: new Date().toLocaleString("id-ID"),
    };
    
    setBookings([...bookings, newBooking]);
    
    setBikes(
      bikes.map((bike) =>
        bike.id === bookingForm.bike.id ? { ...bike, status: "dipesan" } : bike
      )
    );
    
    setBookingForm({
      bike: null,
      name: "",
      email: "",
      phone: "",
      identity: "",
      duration: 1,
    });
    
    success(`Pemesanan berhasil! Kode booking: ${bookingCode}`);
    
    // Arahkan ke halaman pembayaran
    setSelectedBookingForPayment(newBooking);
    setPage("payment");
  };

  // Payment Handler
  const handlePaymentSuccess = (bookingId) => {
    setBookings(
      bookings.map((b) =>
        b.id === bookingId ? { ...b, paymentStatus: "paid", paidAt: new Date().toLocaleString("id-ID") } : b
      )
    );
    
    success("Pembayaran berhasil! Tunjukkan QR code ke admin untuk check-in.");
    setSelectedBookingForPayment(null);
    setPage("myBookings");
  };

  const handlePayFromBookings = (booking) => {
    setSelectedBookingForPayment(booking);
    setPage("payment");
  };

  // Admin Handlers
  const handleCheckIn = (bookingId) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    if (booking.paymentStatus !== "paid") {
      error("Pembayaran belum lunas! Tidak bisa check-in.");
      return;
    }

    setBookings(
      bookings.map((b) =>
        b.id === bookingId
          ? { 
              ...b, 
              status: "active", 
              checkInDate: new Date().toLocaleString("id-ID"),
              checkInTime: new Date().toISOString(), // Untuk kalkulasi nanti
            }
          : b
      )
    );
    
    setBikes(
      bikes.map((bike) =>
        bike.id === booking.bikeId ? { ...bike, status: "dipinjam" } : bike
      )
    );
    
    success(`Check-in berhasil untuk ${booking.name}! Sepeda ${booking.bikeName} sekarang sedang dipinjam.`);
  };

  const handleCancelBooking = (bookingId) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    setBookings(
      bookings.map((b) =>
        b.id === bookingId ? { ...b, status: "cancelled" } : b
      )
    );
    
    setBikes(
      bikes.map((bike) =>
        bike.id === booking.bikeId ? { ...bike, status: "tersedia" } : bike
      )
    );
    
    warning(`Booking ${booking.bookingCode} telah dibatalkan.`);
  };

  const handleReturnBike = (bookingId) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    // Hitung durasi aktual dan denda jika terlambat
    const actualDuration = calculateActualDuration(booking.checkInTime);
    const priceCalc = calculateTotalPrice(booking.duration, actualDuration);

    setBookings(
      bookings.map((b) =>
        b.id === bookingId
          ? { 
              ...b, 
              status: "completed", 
              returnDate: new Date().toLocaleString("id-ID"),
              actualDuration: actualDuration,
              lateFee: priceCalc.lateFee,
              finalTotalPrice: priceCalc.totalPrice,
              isLate: priceCalc.isLate,
            }
          : b
      )
    );
    
    setBikes(
      bikes.map((bike) =>
        bike.id === booking.bikeId ? { ...bike, status: "tersedia" } : bike
      )
    );
    
    if (priceCalc.isLate) {
      warning(`Sepeda ${booking.bikeName} dikembalikan terlambat ${actualDuration - booking.duration} jam! Denda: Rp ${priceCalc.lateFee.toLocaleString()}`);
    } else {
      success(`Sepeda ${booking.bikeName} berhasil dikembalikan tepat waktu! Terima kasih.`);
    }
  };

  const handleToggleBikeStatus = (bikeId) => {
    const bike = bikes.find((b) => b.id === bikeId);
    setBikes(
      bikes.map((b) =>
        b.id === bikeId
          ? {
              ...b,
              status: b.status === "tersedia" ? "dipinjam" : "tersedia",
            }
          : b
      )
    );
    info(`Status ${bike?.name} diubah menjadi ${bike?.status === "tersedia" ? "dipinjam" : "tersedia"}.`);
  };

  // Routing
  return (
    <div className="App">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {page === "landing" && (
        <LandingPage
          counts={counts}
          setPage={setPage}
          currentUser={currentUser}
          logout={logout}
        />
      )}

      {page === "bikes" && (
        <BikeListPage
          bikes={bikes}
          currentUser={currentUser}
          setPage={setPage}
          logout={logout}
          handleBookBike={handleBookBike}
        />
      )}

      {page === "booking" && (
        <BookingPage
          bookingForm={bookingForm}
          setBookingForm={setBookingForm}
          currentUser={currentUser}
          setPage={setPage}
          logout={logout}
          handleSubmitBooking={handleSubmitBooking}
        />
      )}

      {page === "payment" && (
        <PaymentPage
          booking={selectedBookingForPayment}
          currentUser={currentUser}
          setPage={setPage}
          logout={logout}
          handlePaymentSuccess={handlePaymentSuccess}
          showSuccess={success}
          showError={error}
          showWarning={warning}
        />
      )}

      {page === "admin" && (
        <AdminDashboard
          bookings={bookings}
          bikes={bikes}
          currentUser={currentUser}
          setPage={setPage}
          logout={logout}
          handleCheckIn={handleCheckIn}
          handleCancelBooking={handleCancelBooking}
          handleReturnBike={handleReturnBike}
          handleToggleBikeStatus={handleToggleBikeStatus}
        />
      )}

      {page === "auth" && (
        <AuthPage
          authTab={authTab}
          setAuthTab={setAuthTab}
          loginForm={loginForm}
          setLoginForm={setLoginForm}
          registerForm={registerForm}
          setRegisterForm={setRegisterForm}
          adminLoginForm={adminLoginForm}
          setAdminLoginForm={setAdminLoginForm}
          currentUser={currentUser}
          setPage={setPage}
          logout={logout}
          handleLogin={handleLogin}
          handleRegister={handleRegister}
          handleAdminLogin={handleAdminLogin}
        />
      )}

      {page === "myBookings" && (
        <MyBookingsPage
          bookings={bookings}
          currentUser={currentUser}
          setPage={setPage}
          logout={logout}
          handlePayFromBookings={handlePayFromBookings}
        />
      )}
    </div>
  );
}

export default App;