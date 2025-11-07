// src/pages/Auth.jsx
import React from "react";
import Navbar from "../components/Navbar";

export default function Auth({
  page, setPage, currentUser, logout,
  authTab, setAuthTab,
  loginForm, setLoginForm,
  regForm, setRegForm,
  adminPwd, setAdminPwd,
  loginUser, registerUser, loginAdmin
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar page={page} setPage={setPage} currentUser={currentUser} logout={logout} />

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
