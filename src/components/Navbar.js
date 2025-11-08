import React, { useState } from "react";
import { Bike, User, LogOut, Menu, X } from "lucide-react";

export default function Navbar({ page, currentUser, setPage, logout }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLanding = page === "landing";
  const isBikes = page === "bikes";
  const isMyBookings = page === "myBookings";
  const isAdminPage = page === "admin";
  const isAuth = page === "auth";

  const buildMenu = () => {
    if (currentUser) {
      return [
        !isLanding && {
          key: "home",
          label: "Beranda",
          onClick: () => setPage("landing"),
          className: "text-gray-600 hover:text-green-600 transition",
        },
        !isBikes && {
          key: "bikes",
          label: "Cari Sepeda",
          onClick: () => setPage("bikes"),
          className: "text-gray-600 hover:text-green-600 transition",
        },
        currentUser.role === "user" &&
          !isMyBookings && {
            key: "myBookings",
            label: "Pesanan Saya",
            onClick: () => setPage("myBookings"),
            className: "text-gray-600 hover:text-green-600 transition",
          },
        currentUser.role === "admin" &&
          !isAdminPage && {
            key: "admin",
            label: "Dashboard",
            onClick: () => setPage("admin"),
            className:
              "text-gray-100 bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded",
          },
        {
          key: "logout",
          label: (
            <span className="flex items-center gap-2">
              <LogOut size={18} />
              Keluar
            </span>
          ),
          onClick: () => logout(),
          className:
            "flex items-center space-x-1 hover:text-green-600 text-gray-600",
        },
      ].filter(Boolean);
    }

    return [
      !isLanding && {
        key: "home",
        label: "Beranda",
        onClick: () => setPage("landing"),
        className: "text-gray-600 hover:text-green-600 transition",
      },
      !isBikes && {
        key: "bikes",
        label: "Cari Sepeda",
        onClick: () => setPage("bikes"),
        className: "text-gray-600 hover:text-green-600 transition",
      },
      !isAuth && {
        key: "auth",
        label: "Masuk / Daftar",
        onClick: () => setPage("auth"),
        className: "text-gray-600 hover:text-green-600 transition",
      },
    ].filter(Boolean);
  };

  const desktopItems = buildMenu();
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

      {/* Mobile dropdown */}
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
}