import React, { useState } from "react";
import {
  Bike,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  User,
  LogOut,
} from "lucide-react";
import "./App.css";
// pagination state moved into the App component


const initialBikes = [
  {
    id: 1,
    name: "Sepeda MTB 01",
    type: "Mountain Bike",
    status: "tersedia",
    imageUrl:
      "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=400",
  },
  {
    id: 2,
    name: "Sepeda MTB 02",
    type: "Mountain Bike",
    status: "tersedia",
    imageUrl:
      "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=400",
  },
  {
    id: 3,
    name: "Sepeda Lipat 01",
    type: "Sepeda Lipat",
    status: "dipinjam",
    imageUrl:
      "https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=400",
  },
  {
    id: 4,
    name: "Sepeda Lipat 02",
    type: "Sepeda Lipat",
    status: "tersedia",
    imageUrl:
      "https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=400",
  },
  {
    id: 5,
    name: "Sepeda City 01",
    type: "City Bike",
    status: "tersedia",
    imageUrl:
      "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=400",
  },
  {
    id: 6,
    name: "Sepeda City 02",
    type: "City Bike",
    status: "dipinjam",
    imageUrl:
      "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=400",
  },
];

function App() {
  const [page, setPage] = useState("landing");
  const [bikes, setBikes] = useState(initialBikes);
  const [bookings, setBookings] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  // pagination state for admin booking list
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 5; // Menampilkan 5 pesanan per halaman

  const [selectedBike, setSelectedBike] = useState(null);
  
  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    phone: "",
    idNumber: "",
    duration: "1",
  });

  const handleBooking = () => {
    if (
      !bookingForm.name ||
      !bookingForm.email ||
      !bookingForm.phone ||
      !bookingForm.idNumber
    ) {
      alert("Mohon lengkapi semua data!");
      return;
    };

    const newBooking = {
      id: Date.now(),
      bikeId: selectedBike.id,
      bikeName: selectedBike.name,
      ...bookingForm,
      bookingDate: new Date().toLocaleString("id-ID"),
      status: "pending",
      bookingCode: `GW${Date.now().toString().slice(-6)}`,
    };

    setBookings([...bookings, newBooking]);

    alert(
      `Pemesanan Berhasil!\n\nKode Booking: ${newBooking.bookingCode}\n\nSilakan tunjukkan kode ini saat check-in di pos penyewaan.`
    );

    setBookingForm({
      name: "",
      email: "",
      phone: "",
      idNumber: "",
      duration: "1",
    });
    setSelectedBike(null);
    setPage("bikes");
  };

  const handleCheckIn = (booking) => {
  updateBikeStatus(booking.bikeId, "dipinjam"); // Update bike status
  updateBookingStatus(booking.id, "active"); // Update booking status to active

    // Show confirmation alert
    alert("Check-in berhasil! Status sepeda diubah ke Dipinjam");
  };

  const handleAdminLogin = () => {
    const password = prompt("Masukkan password admin:");
    if (password === "admin123") {
      setIsAdmin(true);
      setPage("admin");
    } else {
      alert("Password salah!");
    }
  };

  const updateBikeStatus = (bikeId, newStatus) => {
    setBikes(
      bikes.map((bike) =>
        bike.id === bikeId ? { ...bike, status: newStatus } : bike
      )
    );
  };

  const updateBookingStatus = (bookingId, newStatus) => {
    setBookings(
      bookings.map((booking) =>
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      )
    );
  };

  const availableBikes = bikes.filter((b) => b.status === "tersedia").length;
  const rentedBikes = bikes.filter((b) => b.status === "dipinjam").length;

  if (page === "landing") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100">
        <nav className="bg-white shadow-md">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Bike className="text-green-600" size={32} />
              <span className="text-2xl font-bold text-green-600">
                Go-Wes ITERA
              </span>
            </div>
            <button
              onClick={handleAdminLogin}
              className="text-gray-600 hover:text-green-600 transition"
            >
              Admin
            </button>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              Selamat Datang di Go-Wes ITERA
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Sistem Penyewaan Sepeda Online di Kebun Raya ITERA
            </p>
            <button
              onClick={() => setPage("bikes")}
              className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition shadow-lg"
            >
              Mulai Menyewa Sepeda
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bike className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Booking Online</h3>
              <p className="text-gray-600">
                Pesan sepeda dari rumah, tanpa antre
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Real-Time Status</h3>
              <p className="text-gray-600">
                Lihat ketersediaan sepeda secara langsung
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="text-purple-600" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Mudah & Cepat</h3>
              <p className="text-gray-600">
                Proses check-in yang simpel dan efisien
              </p>
            </div>
          </div>

          <div className="mt-16 bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Statistik Hari Ini
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-4xl font-bold text-green-600">
                  {availableBikes}
                </div>
                <div className="text-gray-600">Sepeda Tersedia</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-4xl font-bold text-red-600">
                  {rentedBikes}
                </div>
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
        <nav className="bg-white shadow-md">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Bike className="text-green-600" size={32} />
              <span className="text-2xl font-bold text-green-600">
                Go-Wes ITERA
              </span>
            </div>
            <button
              onClick={() => setPage("landing")}
              className="text-gray-600 hover:text-green-600 transition"
            >
              Beranda
            </button>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">Daftar Sepeda</h1>
          <p className="text-gray-600 mb-8">
            Pilih sepeda yang ingin Anda sewa
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {bikes.map((bike) => (
              <div
                key={bike.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <img
                  src={bike.imageUrl}
                  alt={bike.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2">{bike.name}</h3>
                  <p className="text-gray-600 mb-3">{bike.type}</p>

                  <div className="flex items-center mb-4">
                    {bike.status === "tersedia" ? (
                      <>
                        <CheckCircle
                          className="text-green-600 mr-2"
                          size={20}
                        />
                        <span className="text-green-600 font-semibold">
                          Tersedia
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="text-red-600 mr-2" size={20} />
                        <span className="text-red-600 font-semibold">
                          Dipinjam
                        </span>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      if (bike.status === "tersedia") {
                        setSelectedBike(bike);
                        setPage("booking");
                      }
                    }}
                    disabled={bike.status !== "tersedia"}
                    className={`w-full py-2 rounded-lg font-semibold transition ${
                      bike.status === "tersedia"
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {bike.status === "tersedia"
                      ? "Pesan Sepeda"
                      : "Tidak Tersedia"}
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
        <nav className="bg-white shadow-md">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Bike className="text-green-600" size={32} />
              <span className="text-2xl font-bold text-green-600">
                Go-Wes ITERA
              </span>
            </div>
            <button
              onClick={() => {
                setPage("bikes");
                setSelectedBike(null);
              }}
              className="text-gray-600 hover:text-green-600 transition"
            >
              Kembali
            </button>
          </div>
        </nav>

        <div className="max-w-2xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">Form Pemesanan</h1>
          <p className="text-gray-600 mb-8">
            Isi data diri untuk melanjutkan pemesanan
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6">
            <div className="font-semibold">Sepeda Dipilih:</div>
            <div className="text-lg">
              {selectedBike.name} - {selectedBike.type}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Nama Lengkap *
              </label>
              <input
                type="text"
                value={bookingForm.name}
                onChange={(e) =>
                  setBookingForm({ ...bookingForm, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                placeholder="Masukkan nama lengkap"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Email *
              </label>
              <input
                type="email"
                value={bookingForm.email}
                onChange={(e) =>
                  setBookingForm({ ...bookingForm, email: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                placeholder="email@example.com"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                No. Telepon *
              </label>
              <input
                type="tel"
                value={bookingForm.phone}
                onChange={(e) =>
                  setBookingForm({ ...bookingForm, phone: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                placeholder="08xxxxxxxxxx"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                NIM / No. Identitas *
              </label>
              <input
                type="text"
                value={bookingForm.idNumber}
                onChange={(e) =>
                  setBookingForm({ ...bookingForm, idNumber: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                placeholder="NIM atau No. KTP"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Durasi Penyewaan *
              </label>
              <select
                value={bookingForm.duration}
                onChange={(e) =>
                  setBookingForm({ ...bookingForm, duration: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
              >
                <option value="1">1 Jam</option>
                <option value="2">2 Jam</option>
                <option value="3">3 Jam</option>
                <option value="4">4 Jam</option>
              </select>
            </div>

            <button
              onClick={handleBooking}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Konfirmasi Pemesanan
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (page === "admin" && isAdmin) {
    const pendingBookings = bookings.filter((b) => b.status === "pending");
    const activeRentals = bookings.filter((b) => b.status === "active");
    // pagination calculations for pending bookings
    const indexOfLastBooking = currentPage * bookingsPerPage;
    const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
    const currentBookings = pendingBookings.slice(indexOfFirstBooking, indexOfLastBooking);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-green-600 text-white shadow-md">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <User size={32} />
              <span className="text-2xl font-bold">Dashboard Admin</span>
            </div>
            <button
              onClick={() => {
                setIsAdmin(false);
                setPage("landing");
              }}
              className="flex items-center space-x-2 hover:bg-green-700 px-4 py-2 rounded transition"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">
            Manajemen Penyewaan Sepeda
          </h1>

          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-3xl font-bold text-green-600">
                {availableBikes}
              </div>
              <div className="text-gray-600">Sepeda Tersedia</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-3xl font-bold text-red-600">
                {rentedBikes}
              </div>
              <div className="text-gray-600">Sedang Dipinjam</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-3xl font-bold text-blue-600">
                {pendingBookings.length}
              </div>
              <div className="text-gray-600">Booking Pending</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-3xl font-bold text-purple-600">
                {activeRentals.length}
              </div>
              <div className="text-gray-600">Rental Aktif</div>
            </div>
          </div>

    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4">Booking Pending (Check-In)</h2>
      {pendingBookings.length === 0 ? (
        <p className="text-gray-600">Tidak ada booking pending</p>
      ) : (
        <div className="space-y-4">
          {currentBookings.map((booking) => (
            <div
              key={booking.id}
              className="border border-gray-200 p-4 rounded-lg"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="font-bold text-lg mb-2">
                    Kode: {booking.bookingCode}
                  </div>
                  <div className="text-gray-600">Nama: {booking.name}</div>
                  <div className="text-gray-600">Sepeda: {booking.bikeName}</div>
                  <div className="text-gray-600">Durasi: {booking.duration} Jam</div>
                  <div className="text-gray-600">Telepon: {booking.phone}</div>
                </div>
                <div className="flex items-center justify-end">
                  <button
                    onClick={() => {
                      handleCheckIn(booking);
                      alert("Check-in berhasil! Status sepeda diubah ke Dipinjam");
                    }}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    Check-In
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="pagination flex justify-center mt-4">
        {Array.from({ length: Math.ceil(pendingBookings.length / bookingsPerPage) }, (_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className="px-4 py-2 mx-1 border border-gray-300 rounded-lg hover:bg-gray-200"
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">
              Rental Aktif (Pengembalian)
            </h2>
            {activeRentals.length === 0 ? (
              <p className="text-gray-600">Tidak ada rental aktif</p>
            ) : (
              <div className="space-y-4">
                {activeRentals.map((booking) => (
                  <div
                    key={booking.id}
                    className="border border-gray-200 p-4 rounded-lg"
                  >
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="font-bold text-lg mb-2">
                          Kode: {booking.bookingCode}
                        </div>
                        <div className="text-gray-600">
                          Nama: {booking.name}
                        </div>
                        <div className="text-gray-600">
                          Sepeda: {booking.bikeName}
                        </div>
                        <div className="text-gray-600">
                          Check-in: {booking.bookingDate}
                        </div>
                      </div>
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => {
                            updateBikeStatus(booking.bikeId, "tersedia");
                            updateBookingStatus(booking.id, "completed");
                            alert(
                              "Pengembalian berhasil! Status sepeda diubah ke Tersedia"
                            );
                          }}
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                          Kembalikan
                        </button>
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
                <div
                  key={bike.id}
                  className="border border-gray-200 p-4 rounded-lg"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-bold">{bike.name}</div>
                      <div className="text-sm text-gray-600">{bike.type}</div>
                      <div
                        className={`text-sm font-semibold mt-1 ${
                          bike.status === "tersedia"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {bike.status === "tersedia" ? "Tersedia" : "Dipinjam"}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const newStatus =
                          bike.status === "tersedia" ? "dipinjam" : "tersedia";
                        updateBikeStatus(bike.id, newStatus);
                      }}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition text-sm"
                    >
                      Toggle Status
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default App;
