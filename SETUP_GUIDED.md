# 📘 Panduan Setup Project Go-Wes ITERA

## 🎯 Persiapan Awal

### 1. Install Node.js

Download dan install Node.js dari [nodejs.org](https://nodejs.org/)

- Pilih versi LTS (Long Term Support)
- Verifikasi instalasi:

```bash
node --version
npm --version
```

### 2. Install Text Editor

Pilih salah satu:

- **Visual Studio Code** (Recommended) - [code.visualstudio.com](https://code.visualstudio.com/)
- Sublime Text
- Atom
- WebStorm

## 📥 Download & Extract Project

### Opsi 1: Download ZIP

1. Download file project yang sudah diberikan
2. Extract ke folder yang diinginkan
3. Buka folder project di terminal/command prompt

### Opsi 2: Clone dari Git (jika menggunakan Git)

```bash
git clone <repository-url>
cd go-wes-itera
```

## 🔧 Setup Project

### Step 1: Buka Terminal di Folder Project

```bash
cd path/to/go-wes-itera
```

### Step 2: Install Dependencies

```bash
npm install lucide-react
```

Tunggu hingga proses selesai (sekitar 2-5 menit tergantung koneksi internet)

### Step 3: Jalankan Development Server

```bash
npm start
```

### Step 4: Buka di Browser

Otomatis terbuka di `http://localhost:3000`

Jika tidak otomatis terbuka, buka browser manual dan akses:

```
http://localhost:3000
```

## 📂 Struktur File Project

```
go-wes-itera/
│
├── public/                 # File statis
│   └── index.html         # HTML utama
│
├── src/                   # Source code
│   ├── App.js            # Komponen utama aplikasi
│   ├── App.css           # Style untuk App
│   ├── index.js          # Entry point React
│   └── index.css         # Global styles
│
├── node_modules/         # Dependencies (auto-generated)
│
├── package.json          # Info project & dependencies
├── package-lock.json     # Lock file dependencies
├── .gitignore           # File yang diabaikan Git
└── README.md            # Dokumentasi project

```

## ✏️ Editing Code

### Menggunakan VS Code

1. **Buka Project**

```bash
code .
```

2. **Install Extension yang Direkomendasikan:**

   - ES7+ React/Redux/React-Native snippets
   - Tailwind CSS IntelliSense
   - Prettier - Code formatter
   - Auto Rename Tag

3. **Mulai Editing**
   - File utama ada di `src/App.js`
   - Edit dan save (Ctrl+S / Cmd+S)
   - Browser akan auto-reload

## 🔄 Command yang Sering Digunakan

### Start Development Server

```bash
npm start
```

Server berjalan di port 3000

### Build untuk Production

```bash
npm run build
```

Membuat folder `build/` yang siap di-deploy

### Stop Server

Tekan `Ctrl + C` di terminal

### Install Library Baru

```bash
npm install nama-library
```

## 🎨 Customisasi

### 1. Mengubah Data Sepeda

Edit file `src/App.js`, cari `initialBikes`:

```javascript
const initialBikes = [
  {
    id: 1,
    name: "Nama Sepeda",
    type: "Tipe Sepeda",
    status: "tersedia",
    imageUrl: "URL_GAMBAR",
  },
  // Tambahkan sepeda lainnya
];
```

### 2. Mengubah Password Admin

Edit file `src/App.js`, cari `handleAdminLogin`:

```javascript
if (password === 'admin123') {  // Ganti dengan password baru
```

### 3. Mengubah Warna

Gunakan Tailwind CSS classes:

- `bg-green-600` → Background hijau
- `text-green-600` → Text hijau
- `hover:bg-green-700` → Hover hijau lebih gelap

Ganti `green` dengan warna lain: `blue`, `red`, `purple`, dll.

## 🐛 Troubleshooting

### Problem: npm command not found

**Solusi:** Install Node.js terlebih dahulu

### Problem: Port 3000 sudah digunakan

**Solusi:**

```bash
# Windows
set PORT=3001 && npm start

# Mac/Linux
PORT=3001 npm start
```

### Problem: Cannot find module

**Solusi:**

```bash
rm -rf node_modules
npm install
```

### Problem: Tailwind CSS tidak muncul

**Solusi:**

- Cek `public/index.html` ada CDN Tailwind
- Atau install Tailwind local:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Problem: Browser tidak auto-reload

**Solusi:**

- Hard refresh: `Ctrl + F5` atau `Cmd + Shift + R`
- Clear cache browser
- Restart development server

## 📱 Testing di Mobile

### Cara 1: Menggunakan IP Lokal

1. Cari IP komputer Anda

   ```bash
   # Windows
   ipconfig

   # Mac/Linux
   ifconfig
   ```

2. Buka di mobile browser:
   ```
   http://192.168.x.x:3000
   ```

### Cara 2: Ngrok (untuk public access)

```bash
# Install ngrok
npm install -g ngrok

# Jalankan
ngrok http 3000
```

## 🚀 Deploy ke Production

### Opsi 1: Netlify (Recommended - Gratis)

1. Build project: `npm run build`
2. Buat akun di [netlify.com](https://netlify.com)
3. Drag & drop folder `build/` ke Netlify
4. Done! Dapat URL public

### Opsi 2: Vercel (Gratis)

1. Install Vercel CLI: `npm i -g vercel`
2. Di folder project: `vercel`
3. Follow instruksi
4. Done! Dapat URL public

### Opsi 3: GitHub Pages

1. Install gh-pages:

   ```bash
   npm install --save-dev gh-pages
   ```

2. Tambahkan di `package.json`:

   ```json
   "homepage": "https://username.github.io/go-wes-itera",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```

3. Deploy:
   ```bash
   npm run deploy
   ```

## 📚 Resources untuk Belajar Lebih Lanjut

### React

- [React Official Docs](https://react.dev/)
- [React Tutorial](https://react.dev/learn)

### Tailwind CSS

- [Tailwind Docs](https://tailwindcss.com/docs)
- [Tailwind UI Components](https://tailwindui.com/)

### JavaScript

- [MDN Web Docs](https://developer.mozilla.org/)
- [JavaScript.info](https://javascript.info/)

## 💡 Tips

1. **Gunakan Git untuk Version Control**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Buat Branch untuk Fitur Baru**

   ```bash
   git checkout -b feature-nama-fitur
   ```

3. **Backup Kode Secara Berkala**

   - Push ke GitHub/GitLab
   - Atau simpan di Google Drive/Dropbox

4. **Test di Berbagai Browser**

   - Chrome
   - Firefox
   - Safari
   - Edge

5. **Optimize Gambar**
   - Gunakan format WebP
   - Compress sebelum upload
   - Ukuran maksimal 500KB per gambar

## 🆘 Bantuan Lebih Lanjut

Jika masih ada masalah:

1. Cek error message di console browser (F12)
2. Cek error message di terminal
3. Google error message
4. Tanya di Stack Overflow
5. Baca dokumentasi React & Tailwind

## ✅ Checklist Setup

- [ ] Node.js terinstall
- [ ] Text editor terinstall
- [ ] Project di-download dan di-extract
- [ ] `npm install` berhasil
- [ ] `npm start` berjalan tanpa error
- [ ] Browser terbuka di localhost:3000
- [ ] Aplikasi berjalan dengan baik
- [ ] Bisa login admin dengan password `admin123`
- [ ] Bisa booking sepeda
- [ ] Bisa check-in dan pengembalian

---

**Selamat coding! 🎉**

Jika ada pertanyaan, jangan ragu untuk bertanya!
