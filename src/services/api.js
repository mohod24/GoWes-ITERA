// src/services/api.js
const API_URL = "http://localhost:3001";

async function jsonFetch(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

// --- Bookings API ---
export function listBookings() {
  return jsonFetch(`${API_URL}/api/bookings`);
}

export function createBooking(payload) {
  return jsonFetch(`${API_URL}/api/bookings`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function checkInBooking(id) {
  return jsonFetch(`${API_URL}/api/bookings/${id}/checkin`, { method: "PATCH" });
}

export function returnBooking(id) {
  return jsonFetch(`${API_URL}/api/bookings/${id}/return`, { method: "PATCH" });
}

export function cancelBooking(id) {
  return jsonFetch(`${API_URL}/api/bookings/${id}`, { method: "DELETE" });
}
