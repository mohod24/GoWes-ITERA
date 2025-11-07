// src/pages/Bikes.jsx
import React from "react";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import Navbar from "../components/Navbar";

export default function Bikes({
  page, setPage, currentUser, logout,
  bikes, setSelectedBike, setPendingSelectedBike, setAuthTab
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar page={page} setPage={setPage} currentUser={currentUser} logout={logout} />

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
                      if (!currentUser) {
                        setPendingSelectedBike(bike);
                        setPage("auth");
                        setAuthTab("login");
                      } else {
                        setPage("booking");
                      }
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
