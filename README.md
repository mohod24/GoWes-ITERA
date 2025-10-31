# Go-Wes ITERA

### Sistem Penyewaan Sepeda Online di Kebun Raya ITERA

## 📋 Deskripsi Project

Go-Wes ITERA adalah aplikasi web untuk mempermudah proses penyewaan sepeda di Kebun Raya ITERA. Pengunjung dapat memesan sepeda secara online, melihat ketersediaan real-time, dan admin dapat mengelola booking dan status sepeda dengan mudah.

## ✨ Fitur Utama

### Untuk Pengunjung:

- 🚴 **Lihat Daftar Sepeda** - Lihat semua sepeda dengan status real-time
- 📝 **Booking Online** - Pesan sepeda dari rumah tanpa antre
- 🎫 **Kode Booking** - Dapatkan kode unik untuk check-in
- ⏱️ **Pilih Durasi** - Pilih durasi penyewaan 1-4 jam

### Untuk Admin:

- 📊 **Dashboard Statistik** - Lihat statistik sepeda tersedia, dipinjam, dan booking
- ✅ **Check-In Booking** - Proses check-in dengan scan kode booking
- 🔄 **Pengembalian Sepeda** - Update status sepeda saat dikembalikan
- 🔧 **Manajemen Status** - Toggle status sepeda tersedia/dipinjam

## 🛠️ Tech Stack

- **Frontend:** React.js 18
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **State Management:** React Hooks (useState)

## 📦 Instalasi

### Prerequisites

- Node.js (versi 14 atau lebih tinggi)
- npm atau yarn

### Langkah Instalasi

1. **Clone atau Download Project**

   ```bash
   # Jika menggunakan Git
   git clone <repository-url>
   cd go-wes-itera
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Jalankan Development Server**

   ```bash
   npm start
   ```

4. **Buka Browser**
   ```
   http://localhost:3000
   ```

## 📁 Struktur Folder

```
go-wes-itera/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── App.js              # Main component
│   ├── App.css             # App styles
│   ├── index.js            # Entry point
│   └── index.css           # Global styles
├── package.json            # Dependencies
└── README.md              # Dokumentasi
```

## 🎯 Cara Penggunaan

### Pengunjung

1. **Buka Website**

   - Akses halaman landing page
   - Klik "Mulai Menyewa Sepeda"

2. **Pilih Sepeda**

   - Browse daftar sepeda yang tersedia
   - Lihat status ketersediaan real-time
   - Klik "Pesan Sepeda" pada sepeda yang diinginkan

3. **Isi Form Booking**

   - Masukkan Nama Lengkap
   - Masukkan Email
   - Masukkan No. Telepon
   - Masukkan NIM/No. Identitas
   - Pilih Durasi Penyewaan
   - Klik "Konfirmasi Pemesanan"

4. **Simpan Kode Booking**

   - Catat kode booking yang muncul (format: GW123456)
   - Tunjukkan kode ini saat check-in di pos penyewaan

5. **Check-In di Pos**
   - Datang ke pos penyewaan Kebun Raya ITERA
   - Tunjukkan kode booking ke petugas
   - Petugas akan melakukan check-in
   - Sepeda siap digunakan!

### Admin

1. **Login Admin**

   - Klik "Admin" di pojok kanan atas
   - Masukkan password: `admin123`
   - Akan masuk ke Dashboard Admin

2. **Check-In Booking**

   - Lihat daftar "Booking Pending"
   - Verifikasi kode booking pengunjung
   - Klik tombol "Check-In"
   - Status sepeda otomatis berubah menjadi "Dipinjam"

3. **Proses Pengembalian**

   - Lihat daftar "Rental Aktif"
   - Saat pengunjung mengembalikan sepeda
   - Klik tombol "Kembalikan"
   - Status sepeda otomatis berubah menjadi "Tersedia"

4. **Manajemen Status Sepeda**
   - Scroll ke section "Status Semua Sepeda"
   - Lihat status semua sepeda
   - Gunakan "Toggle Status" untuk mengubah status manual jika diperlukan

## 🔐 Kredensial Admin

- **Username:** (tidak diperlukan)
- **Password:** `admin123`

**⚠️ PENTING:** Ganti password default di production!

## 🚀 Build untuk Production

Untuk build aplikasi untuk deployment:

```bash
npm run build
```

File production akan tersimpan di folder `build/`

## 📝 Customisasi

### Menambah Sepeda Baru

Edit array `initialBikes` di `src/App.js`:

```javascript
const initialBikes = [
  {
    id: 7,
    name: "Sepeda Baru 01",
    type: "Road Bike",
    status: "tersedia",
    imageUrl: "URL_GAMBAR_SEPEDA",
  },
  // ... sepeda lainnya
];
```

### Mengubah Password Admin

Edit fungsi `handleAdminLogin` di `src/App.js`:

```javascript
const handleAdminLogin = () => {
  const password = prompt("Masukkan password admin:");
  if (password === "PASSWORD_BARU_ANDA") {
    // ...
  }
};
```

### Mengganti Warna Tema

Warna utama menggunakan Tailwind CSS:

- Primary: `green-600` (#16a34a)
- Hover: `green-700` (#15803d)

Ubah di class Tailwind yang digunakan dalam komponen.

## 🔮 Pengembangan Selanjutnya

Fitur yang bisa ditambahkan:

- [ ] Backend API (Node.js + Express)
- [ ] Database (MongoDB/PostgreSQL)
- [ ] Autentikasi JWT
- [ ] QR Code untuk booking
- [ ] Notifikasi Email/WhatsApp
- [ ] Payment Gateway
- [ ] Rating & Review sepeda
- [ ] Laporan dan Analytics
- [ ] Export data CSV/Excel
- [ ] Multi-language support

## 🐛 Troubleshooting

### Error: Module not found

```bash
# Hapus node_modules dan install ulang
rm -rf node_modules
npm install
```

### Tailwind CSS tidak loading

- Pastikan CDN Tailwind ada di `public/index.html`
- Atau install Tailwind secara lokal

### Port 3000 sudah digunakan

```bash
# Gunakan port lain
PORT=3001 npm start
```

## 📄 Lisensi

Project ini dibuat untuk keperluan internal Kebun Raya ITERA.

## 👥 Kontributor

- Mahasiswa ITERA

## 📧 Kontak

Untuk pertanyaan atau saran:

- Email: contact@itera.ac.id
- Website: https://itera.ac.id

## 🙏 Acknowledgments

- React Team
- Tailwind CSS
- Lucide Icons
- Unsplash (untuk gambar sepeda)

---

**Dibuat dengan ❤️ untuk Kebun Raya ITERA**
