// backend-gowes/controllers/auth.controller.js

const weakHash = (s = "") => {
  let h = 0; for (let i = 0; i < s.length; i++) { h = (h << 5) - h + s.charCodeAt(i); h |= 0; }
  return String(h);
};

let users = []; // in-memory demo
let sessions = new Map(); // token -> user

export const register = (req, res) => {
  const { name, email, idNumber = "", password } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ message: "Nama, email, password wajib" });
  const e = String(email).trim().toLowerCase();
  if (users.some(u => u.email === e)) return res.status(409).json({ message: "Email sudah terdaftar" });

  const user = { id: `u_${Date.now()}`, role: "user", name: name.trim(), email: e, idNumber, passHash: weakHash(password) };
  users.push(user);
  res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
};

export const login = (req, res) => {
  const { email, password } = req.body || {};
  const e = String(email || "").trim().toLowerCase();
  const user = users.find(u => u.email === e && u.passHash === weakHash(password || ""));
  if (!user) return res.status(401).json({ message: "Email atau password salah" });
  const token = "t_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
  sessions.set(token, { id: user.id, name: user.name, email: user.email, role: user.role });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
};

export const me = (req, res) => {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  const session = sessions.get(token);
  if (!session) return res.status(401).json({ message: "Unauthorized" });
  res.json(session);
};
