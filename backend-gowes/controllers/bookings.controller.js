// backend-gowes/controllers/bookings.controller.js

// Penyimpanan sementara di memori (demo)
let bookings = [];
let nextId = 1;

// GET /api/bookings
export const list = (_req, res) => {
  res.json(bookings);
};

// POST /api/bookings
export const create = (req, res) => {
  const {
    userId, userName, bikeId, bikeName,
    name, email, phone, idNumber, duration
  } = req.body || {};

  if (!userId || !bikeId || !name || !email || !phone || !idNumber || !duration) {
    return res.status(400).json({ message: "Field wajib belum lengkap." });
  }

  const id = nextId++;
  const bookingCode = "GW" + String(Date.now()).slice(-6);
  const now = new Date().toLocaleString("id-ID");

  const newBooking = {
    id,
    userId,
    userName: userName || name,
    bikeId,
    bikeName,
    name,
    email,
    phone,
    idNumber,
    duration: String(duration),
    requestDate: now,
    checkInDate: null,
    status: "pending",
    bookingCode,
  };

  bookings.push(newBooking);
  res.status(201).json(newBooking);
};

// GET /api/bookings/:id
export const getOne = (req, res) => {
  const id = Number(req.params.id);
  const found = bookings.find(b => b.id === id);
  if (!found) return res.status(404).json({ message: "Booking tidak ditemukan" });
  res.json(found);
};

// PATCH /api/bookings/:id/checkin
export const checkIn = (req, res) => {
  const id = Number(req.params.id);
  const found = bookings.find(b => b.id === id);
  if (!found) return res.status(404).json({ message: "Booking tidak ditemukan" });
  found.status = "active";
  found.checkInDate = new Date().toLocaleString("id-ID");
  res.json(found);
};

// PATCH /api/bookings/:id/return
export const returnBike = (req, res) => {
  const id = Number(req.params.id);
  const found = bookings.find(b => b.id === id);
  if (!found) return res.status(404).json({ message: "Booking tidak ditemukan" });
  found.status = "completed";
  res.json(found);
};

// DELETE /api/bookings/:id  (mark as cancelled)
export const cancel = (req, res) => {
  const id = Number(req.params.id);
  const found = bookings.find(b => b.id === id);
  if (!found) return res.status(404).json({ message: "Booking tidak ditemukan" });
  found.status = "cancelled";
  res.json(found);
};
