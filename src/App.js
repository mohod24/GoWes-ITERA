import React, { useEffect, useMemo, useState } from "react";
import {
  Bike,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import "./App.css";

// ====== Data awal ======
const initialBikes = [
  { id: 1, name: "Sepeda MTB 01", type: "Mountain Bike", status: "tersedia", imageUrl: "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=400" },
  { id: 2, name: "Sepeda MTB 02", type: "Mountain Bike", status: "tersedia", imageUrl: "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=400" },
  { id: 3, name: "Sepeda Lipat 01", type: "Sepeda Lipat", status: "dipinjam", imageUrl: "https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=400" },
  { id: 4, name: "Sepeda Lipat 02", type: "Sepeda Lipat", status: "tersedia", imageUrl: "https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=400" },
  { id: 5, name: "Sepeda City 01", type: "City Bike", status: "tersedia", imageUrl: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=400" },
  { id: 6, name: "Sepeda City 02", type: "City Bike", status: "dipinjam", imageUrl: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=400" },
];

// ====== Helpers persistensi ======
const LS_BIKES = "gowes_bikes";
const LS_BOOKINGS = "gowes_bookings";
const LS_USER = "gowes_user"; // user yang sedang login (role: user/admin)
const LS_USERS = "gowes_users"; // daftar akun terdaftar (role: user)

function useLocalStorageState(key, fallback) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (e) {}
  }, [key, state]);

  return [state, setState];
}

// (DEMO) hashing sangat sederhana, BUKAN untuk produksi
function weakHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return String(h);
}

export default function App() {
  const [page, setPage] = useState("landing");
  const [bikes, setBikes] = useLocalStorageState(LS_BIKES, initialBikes);
  const [bookings, setBookings] = useLocalStorageState(LS_BOOKINGS, []);
  const [currentUser, setCurrentUser] = useLocalStorageState(LS_USER, null);
  const [users, setUsers] = useLocalStorageState(LS_USERS, []); // {id,name,email,idNumber,passHash,role:"user"}

  const [selectedBike, setSelectedBike] = useState(null);
  const [pendingSelectedBike, setPendingSelectedBike] = useState(null); // simpan niat booking saat belum login
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = currentUser?.role === "admin";

  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    phone: "",
    idNumber: "",
    duration: "1",
  });

  // ====== State untuk halaman AUTH (diletakkan di top-level agar tidak melanggar rules of hooks) ======
  const [authTab, setAuthTab] = useState("login"); // "login" | "register" | "admin"
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [regForm, setRegForm] = useState({ name: "", email: "", idNumber: "", password: "", confirm: "" });
  const [adminPwd, setAdminPwd] = useState("");

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
      prev.map((booking) => (booking.id === bookingId ? { ...booking, ...(typeof patch === "string" ? { status: patch } : patch) } : booking))
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

    alert(`Pemesanan Berhasil!

Kode Booking: ${newBooking.bookingCode}

Silakan tunjukkan kode ini saat check-in di pos penyewaan.`);

    setBookingForm({ name: "", email: "", phone: "", idNumber: "", duration: "1" });
    setSelectedBike(null);
    setPage("myBookings");
  };

  // ====== Auth Helpers ======
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
    // jika sebelumnya user menekan Pesan Sepeda, arahkan ke booking dengan sepeda tersebut
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

  // ====== Navbar ======
// Pastikan di import:
// import { Bike, MapPin, Clock, CheckCircle, XCircle, User, LogOut, Menu, X } from "lucide-react";

// HAPUS pemakaian prop { right } di semua tempat. Panggil <Navbar /> saja.
const Navbar = () => {
  const isLanding = page === "landing";
  const isBikes = page === "bikes";
  const isMyBookings = page === "myBookings";
  const isAdminPage = page === "admin";
  const isAuth = page === "auth";

  // Satu-satunya builder urutan menu (dipakai desktop & mobile)
  const buildMenu = () => {
    if (currentUser) {
      // Urutan desktop: Beranda → Cari Sepeda → (Pesanan Saya|Dashboard) → Keluar
      return [
        !isLanding && { key: "home", label: "Beranda", onClick: () => setPage("landing"), className: "text-gray-600 hover:text-green-600 transition" },
        !isBikes && { key: "bikes", label: "Cari Sepeda", onClick: () => setPage("bikes"), className: "text-gray-600 hover:text-green-600 transition" },
        currentUser.role === "user" && !isMyBookings && { key: "myBookings", label: "Pesanan Saya", onClick: () => setPage("myBookings"), className: "text-gray-600 hover:text-green-600 transition" },
        currentUser.role === "admin" && !isAdminPage && { key: "admin", label: "Dashboard", onClick: () => setPage("admin"), className: "text-gray-100 bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded" },
        {
          key: "logout",
          label: (<span className="flex items-center gap-2"><LogOut size={18} />Keluar</span>),
          onClick: () => logout(),
          className: "flex items-center space-x-1 hover:text-green-600 text-gray-600",
        },
      ].filter(Boolean);
    }

    // Guest: Beranda → Cari Sepeda → Masuk/Daftar
    return [
      !isLanding && { key: "home", label: "Beranda", onClick: () => setPage("landing"), className: "text-gray-600 hover:text-green-600 transition" },
      !isBikes && { key: "bikes", label: "Cari Sepeda", onClick: () => setPage("bikes"), className: "text-gray-600 hover:text-green-600 transition" },
      !isAuth && { key: "auth", label: "Masuk / Daftar", onClick: () => setPage("auth"), className: "text-gray-600 hover:text-green-600 transition" },
    ].filter(Boolean);
  };

  const desktopItems = buildMenu();

  // Mobile: gunakan URUTAN YANG SAMA persis dengan desktop,
  // hanya ganti className agar rata kiri dan penuh.
  const mobileItems = desktopItems.map((it) => ({
    ...it,
    className:
      it.key === "logout"
        ? "text-left w-full py-2 text-red-600 hover:text-red-700 flex items-center gap-2"
        : "text-left w-full py-2 text-gray-700 hover:text-green-700",
  }));

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Brand */}
        <div className="flex items-center space-x-2">
          <Bike className="text-green-600" size={32} />
          <span className="text-2xl font-bold text-green-600">Go-Wes ITERA</span>
        </div>

        {/* Desktop menu */}
        <div className="hidden sm:flex items-center gap-3">
          {currentUser && (
            <div className="flex items-center text-sm text-gray-600 gap-2">
              <User size={18} />
              <span className="font-semibold">{currentUser.name}</span>
              <span className="px-2 py-0.5 text-xs rounded bg-green-100 text-green-700">
                {currentUser.role}
              </span>
            </div>
          )}

          {desktopItems.map((it) => (
            <button key={it.key} onClick={it.onClick} className={it.className}>
              {it.label}
            </button>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden p-2 rounded hover:bg-gray-100"
          aria-label="Menu"
          aria-expanded={mobileOpen ? "true" : "false"}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

      </div>

      {/* Mobile dropdown (URUTAN SAMA DENGAN DESKTOP) */}
      {mobileOpen && (
        <div className="sm:hidden border-t bg-white">
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-2 items-start">
            {currentUser && (
              <div className="w-full flex items-center justify-between py-2">
                <div className="flex items-center gap-2 text-gray-700">
                  <User size={18} />
                  <span className="font-semibold">{currentUser.name}</span>
                </div>
                <span className="px-2 py-0.5 text-xs rounded bg-green-100 text-green-700">
                  {currentUser.role}
                </span>
              </div>
            )}

            {mobileItems.map((it) => (
              <button
                key={it.key}
                className={it.className}
                onClick={() => {
                  it.onClick();
                  setMobileOpen(false);
                }}
              >
                {it.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};






  // ====== Pages ======
  if (page === "landing") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">Selamat Datang di Go-Wes ITERA</h1>
            <p className="text-xl text-gray-600 mb-8">Sistem Penyewaan Sepeda Online di Kebun Raya ITERA</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setPage("bikes")} className="bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition shadow-lg">
                Mulai Menyewa Sepeda
              </button>
              {!currentUser && (
                <button onClick={() => setPage("auth")} className="bg-white text-green-700 border border-green-600 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-50 transition">
                  Masuk / Daftar
                </button>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center card-hover animate-fade-in">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bike className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Booking Online</h3>
              <p className="text-gray-600">Pesan sepeda dari rumah, tanpa antre</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg text-center card-hover animate-fade-in">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Real-Time Status</h3>
              <p className="text-gray-600">Lihat ketersediaan sepeda secara langsung</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg text-center card-hover animate-fade-in">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="text-purple-600" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Mudah & Cepat</h3>
              <p className="text-gray-600">Proses check-in yang simpel dan efisien</p>
            </div>
          </div>

          <div className="mt-16 bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">Statistik Hari Ini</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-4xl font-bold text-green-600">{counts.available}</div>
                <div className="text-gray-600">Sepeda Tersedia</div>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-lg">
                <div className="text-4xl font-bold text-amber-600">{counts.reserved}</div>
                <div className="text-gray-600">Sudah Dipesan</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-4xl font-bold text-red-600">{counts.rented}</div>
                <div className="text-gray-600">Sedang Dipinjam</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (page === "bikes") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar right={<button onClick={() => setPage("landing")} className="text-gray-600 hover:text-green-600 transition">Beranda</button>} />

        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">Daftar Sepeda</h1>
          <p className="text-gray-600 mb-8">Pilih sepeda yang ingin Anda sewa</p>

          <div className="grid md:grid-cols-3 gap-6">
            {bikes.map((bike) => (
              <div key={bike.id} className="bg-white rounded-lg shadow-lg overflow-hidden card-hover animate-fade-in">
                <img src={bike.imageUrl} alt={bike.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2">{bike.name}</h3>
                  <p className="text-gray-600 mb-3">{bike.type}</p>

                  <div className="flex items-center mb-4">
                    {bike.status === "tersedia" && (<><CheckCircle className="text-green-600 mr-2" size={20} /><span className="text-green-600 font-semibold">Tersedia</span></>)}
                    {bike.status === "dipesan" && (<><Clock className="text-amber-600 mr-2" size={20} /><span className="text-amber-600 font-semibold">Dipesan</span></>)}
                    {bike.status === "dipinjam" && (<><XCircle className="text-red-600 mr-2" size={20} /><span className="text-red-600 font-semibold">Dipinjam</span></>)}
                  </div>

                  <button
                    onClick={() => {
                      if (bike.status === "tersedia") {
                        setSelectedBike(bike);
                        if (!currentUser) { setPendingSelectedBike(bike); setPage("auth"); setAuthTab("login"); }
                        else { setPage("booking"); }
                      }
                    }}
                    disabled={bike.status !== "tersedia"}
                    className={`w-full py-2 rounded-lg font-semibold transition ${
                      bike.status === "tersedia" ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {bike.status === "tersedia" ? "Pesan Sepeda" : bike.status === "dipesan" ? "Sudah Dipesan" : "Tidak Tersedia"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (page === "booking" && selectedBike) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar right={<button onClick={() => { setPage("bikes"); setSelectedBike(null); }} className="text-gray-600 hover:text-green-600 transition">Kembali</button>} />

        <div className="max-w-2xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">Form Pemesanan</h1>
          <p className="text-gray-600 mb-8">Isi data diri untuk melanjutkan pemesanan</p>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6">
            <div className="font-semibold">Sepeda Dipilih:</div>
            <div className="text-lg">{selectedBike.name} - {selectedBike.type}</div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Nama Lengkap *</label>
              <input type="text" value={bookingForm.name} onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent" placeholder="Masukkan nama lengkap" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Email *</label>
              <input type="email" value={bookingForm.email} onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent" placeholder="email@example.com" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">No. Telepon *</label>
              <input type="tel" value={bookingForm.phone} onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent" placeholder="08xxxxxxxxxx" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">NIM / No. Identitas *</label>
              <input type="text" value={bookingForm.idNumber} onChange={(e) => setBookingForm({ ...bookingForm, idNumber: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent" placeholder="NIM atau No. KTP" />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Durasi Penyewaan *</label>
              <select value={bookingForm.duration} onChange={(e) => setBookingForm({ ...bookingForm, duration: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent">
                <option value="1">1 Jam</option>
                <option value="2">2 Jam</option>
                <option value="3">3 Jam</option>
                <option value="4">4 Jam</option>
              </select>
            </div>
            <button onClick={handleBooking} className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition">Konfirmasi Pemesanan</button>
          </div>
        </div>
      </div>
    );
  }

  if (page === "admin" && isAdmin) {
    const pendingBookings = bookings.filter((b) => b.status === "pending");
    const activeRentals = bookings.filter((b) => b.status === "active");

    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-green-600 text-white shadow-md">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <User size={32} />
              <span className="text-2xl font-bold">Dashboard Admin</span>
            </div>
            <button onClick={logout} className="flex items-center space-x-2 hover:bg-green-700 px-4 py-2 rounded transition">
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Manajemen Penyewaan Sepeda</h1>

          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow"><div className="text-3xl font-bold text-green-600">{counts.available}</div><div className="text-gray-600">Sepeda Tersedia</div></div>
            <div className="bg-white p-6 rounded-lg shadow"><div className="text-3xl font-bold text-amber-600">{counts.reserved}</div><div className="text-gray-600">Sudah Dipesan</div></div>
            <div className="bg-white p-6 rounded-lg shadow"><div className="text-3xl font-bold text-red-600">{counts.rented}</div><div className="text-gray-600">Sedang Dipinjam</div></div>
            <div className="bg-white p-6 rounded-lg shadow"><div className="text-3xl font-bold text-blue-600">{activeRentals.length}</div><div className="text-gray-600">Rental Aktif</div></div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Booking Pending (Check-In)</h2>
            {pendingBookings.length === 0 ? (
              <p className="text-gray-600">Tidak ada booking pending</p>
            ) : (
              <div className="space-y-4">
                {pendingBookings.map((booking) => (
                  <div key={booking.id} className="border border-gray-200 p-4 rounded-lg">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="font-bold text-lg mb-2">Kode: {booking.bookingCode}</div>
                        <div className="text-gray-600">Nama: {booking.name}</div>
                        <div className="text-gray-600">Sepeda: {booking.bikeName}</div>
                        <div className="text-gray-600">Durasi: {booking.duration} Jam</div>
                        <div className="text-gray-600">Telepon: {booking.phone}</div>
                        <div className="text-gray-600">Pesan: {booking.requestDate}</div>
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => { updateBikeStatus(booking.bikeId, "dipinjam"); updateBookingStatus(booking.id, { status: "active", checkInDate: new Date().toLocaleString("id-ID") }); alert("Check-in berhasil! Status sepeda diubah ke Dipinjam"); }} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">Check-In</button>
                        <button onClick={() => { updateBikeStatus(booking.bikeId, "tersedia"); updateBookingStatus(booking.id, "cancelled"); }} className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition">Batalkan</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Rental Aktif (Pengembalian)</h2>
            {activeRentals.length === 0 ? (
              <p className="text-gray-600">Tidak ada rental aktif</p>
            ) : (
              <div className="space-y-4">
                {activeRentals.map((booking) => (
                  <div key={booking.id} className="border border-gray-200 p-4 rounded-lg">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="font-bold text-lg mb-2">Kode: {booking.bookingCode}</div>
                        <div className="text-gray-600">Nama: {booking.name}</div>
                        <div className="text-gray-600">Sepeda: {booking.bikeName}</div>
                        <div className="text-gray-600">Check-in: {booking.checkInDate}</div>
                      </div>
                      <div className="flex items-center justify-end">
                        <button onClick={() => { updateBikeStatus(booking.bikeId, "tersedia"); updateBookingStatus(booking.id, "completed"); alert("Pengembalian berhasil! Status sepeda diubah ke Tersedia"); }} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">Kembalikan</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Status Semua Sepeda</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {bikes.map((bike) => (
                <div key={bike.id} className="border border-gray-200 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-bold">{bike.name}</div>
                      <div className="text-sm text-gray-600">{bike.type}</div>
                      <div className={`text-sm font-semibold mt-1 ${bike.status === "tersedia" ? "text-green-600" : bike.status === "dipesan" ? "text-amber-600" : "text-red-600"}`}>
                        {bike.status === "tersedia" ? "Tersedia" : bike.status === "dipesan" ? "Dipesan" : "Dipinjam"}
                      </div>
                    </div>
                    <button onClick={() => { const cycle = { tersedia: "dipesan", dipesan: "dipinjam", dipinjam: "tersedia" }; updateBikeStatus(bike.id, cycle[bike.status]); }} className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition text-sm">Toggle Status</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (page === "auth") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-10">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex mb-6 border-b overflow-x-auto">
              <button onClick={() => setAuthTab("login")} className={`flex-1 py-2 font-semibold ${authTab === "login" ? "text-green-600 border-b-2 border-green-600" : "text-gray-500"}`}>Masuk</button>
              <button onClick={() => setAuthTab("register")} className={`flex-1 py-2 font-semibold ${authTab === "register" ? "text-green-600 border-b-2 border-green-600" : "text-gray-500"}`}>Daftar</button>
              <button onClick={() => setAuthTab("admin")} className={`flex-1 py-2 font-semibold ${authTab === "admin" ? "text-green-600 border-b-2 border-green-600" : "text-gray-500"}`}>Admin</button>
            </div>

            {authTab === "login" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Email</label>
                  <input type="email" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-600" placeholder="email@contoh.com" value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Password</label>
                  <input type="password" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-600" placeholder="••••••••" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} />
                </div>
                <button onClick={loginUser} className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition">Masuk</button>
              </div>
            )}

            {authTab === "register" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Nama Lengkap</label>
                  <input className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-600" placeholder="Nama Anda" value={regForm.name} onChange={(e) => setRegForm({ ...regForm, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Email</label>
                  <input type="email" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-600" placeholder="email@contoh.com" value={regForm.email} onChange={(e) => setRegForm({ ...regForm, email: e.target.value })} />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">NIM / No. Identitas (opsional)</label>
                  <input className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-600" placeholder="NIM atau No. KTP" value={regForm.idNumber} onChange={(e) => setRegForm({ ...regForm, idNumber: e.target.value })} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Password</label>
                    <input type="password" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-600" placeholder="Minimal 6 karakter" value={regForm.password} onChange={(e) => setRegForm({ ...regForm, password: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Ulangi Password</label>
                    <input type="password" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-600" placeholder="Ketik ulang password" value={regForm.confirm} onChange={(e) => setRegForm({ ...regForm, confirm: e.target.value })} />
                  </div>
                </div>
                <button onClick={registerUser} className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition">Daftar</button>
                <p className="text-sm text-gray-500">Dengan mendaftar, Anda menyetujui simulasi penyimpanan data lokal (localStorage) untuk keperluan demo.</p>
              </div>
            )}

            {authTab === "admin" && (
              <div className="space-y-4">
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 text-sm text-yellow-800">Login admin hanya untuk petugas pos penyewaan.</div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Password Admin</label>
                  <input type="password" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-600" placeholder="••••••••" value={adminPwd} onChange={(e) => setAdminPwd(e.target.value)} />
                </div>
                <button onClick={loginAdmin} className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition">Masuk sebagai Admin</button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (page === "myBookings" && currentUser?.role === "user") {
    const mine = bookings.filter((b) => b.userId === currentUser.id);

    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar right={<button onClick={() => setPage("bikes")} className="text-gray-600 hover:text-green-600 transition">Cari Sepeda</button>} />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Pesanan Saya</h1>
          {mine.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow text-gray-600">Belum ada pesanan. Mulai dari halaman <button className="text-green-600 underline" onClick={() => setPage("bikes")}>Daftar Sepeda</button>.</div>
          ) : (
            <div className="space-y-4">
              {mine.map((booking) => (
                <div key={booking.id} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex flex-wrap justify-between gap-2">
                    <div>
                      <div className="font-bold text-lg">{booking.bikeName}</div>
                      <div className="text-sm text-gray-600">Kode: {booking.bookingCode}</div>
                      <div className="text-sm text-gray-600">Durasi: {booking.duration} Jam</div>
                      <div className="text-sm text-gray-600">Dipesan: {booking.requestDate}</div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${booking.status === "pending" ? "bg-amber-100 text-amber-700" : booking.status === "active" ? "bg-blue-100 text-blue-700" : booking.status === "completed" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>

                  {booking.status === "pending" && (
                    <div className="mt-4 flex items-center gap-4 border-t pt-4">
                      <img
                        src="/image/QR.png"
                        alt={`QR ${booking.bookingCode}`}
                        className="w-28 h-28 rounded-lg border"
                      />
                      <div className="text-sm text-gray-600">
                        Bayar Menggunakan Kode QR. Pastikan kode booking cocok:
                        <div className="font-mono text-base text-gray-800">{booking.bookingCode}</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
