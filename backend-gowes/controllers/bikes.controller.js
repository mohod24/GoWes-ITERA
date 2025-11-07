// backend-gowes/controllers/bikes.controller.js
let bikes = [
  { id: 1, name: "Sepeda MTB 01", type: "Mountain Bike", status: "tersedia" },
  { id: 2, name: "Sepeda MTB 02", type: "Mountain Bike", status: "tersedia" },
  { id: 3, name: "Sepeda Lipat 01", type: "Sepeda Lipat", status: "dipinjam" },
  { id: 4, name: "Sepeda Lipat 02", type: "Sepeda Lipat", status: "tersedia" },
  { id: 5, name: "Sepeda City 01", type: "City Bike", status: "tersedia" },
  { id: 6, name: "Sepeda City 02", type: "City Bike", status: "dipinjam" },
];

export const list = (req, res) => {
  res.json(bikes);
};

export const updateStatus = (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body || {};
  if (!["tersedia", "dipesan", "dipinjam"].includes(status || "")) {
    return res.status(400).json({ message: "Status tidak valid" });
    }
  const idx = bikes.findIndex(b => b.id === id);
  if (idx === -1) return res.status(404).json({ message: "Sepeda tidak ditemukan" });
  bikes[idx].status = status;
  res.json(bikes[idx]);
};
