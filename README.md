# SI-WARGA: Sistem Dashboard Administrasi Data Kependudukan RT/RW

**SI-WARGA** adalah sistem informasi modern dan interaktif untuk pengelolaan data kependudukan tingkat RT/RW berbasis **Bun Workspaces**, **ElysiaJS**, **Drizzle ORM**, **`bun:sqlite`**, dan **SvelteKit** dengan komunikasi end-to-end type-safe melalui **Eden Treaty**.

---

## Daftar Isi
1. [Fitur Unggulan](#fitur-unggulan)
2. [Arsitektur Monorepo](#arsitektur-monorepo)
3. [Teknologi yang Digunakan](#teknologi-yang-digunakan)
4. [Prasyarat Sistem](#prasyarat-sistem)
5. [Panduan Instalasi & Menjalankan](#panduan-instalasi--menjalankan)
6. [Dokumentasi API Backend](#dokumentasi-api-backend)
7. [Struktur Pangkalan Data](#struktur-pangkalan-data)
8. [Panduan Penggunaan Fitur](#panduan-penggunaan-fitur)

---

## Fitur Unggulan

### 1. Otomasi NIK Cerdas (16 Digit NIK Parser)
Form pendaftaran dilengkapi fitur otomatisasi pengisian data berbasis struktur baku NIK Indonesia:
- **Deteksi Jenis Kelamin**: Otomatis mendeteksi Laki-laki atau Perempuan (aturan tanggal > 40 untuk perempuan).
- **Pengisian Tanggal Lahir**: Otomatis mengekstrak tanggal, bulan, dan tahun lahir (termasuk deteksi abad 19xx dan 20xx) ke kalender HTML `YYYY-MM-DD`.
- **Deteksi Provinsi Asal**: Mengidentifikasi kode provinsi dari 2 digit awal NIK (misal: Jawa Barat, DKI Jakarta, Jawa Tengah, Bali, dsb.) serta menyediakan tombol cepat untuk pengisian Tempat Lahir.
- **Tombol Kendali Otomasi**: Pengurus dapat mengaktifkan atau mematikan fitur otomatisasi NIK kapan saja.

### 2. Statistik Demografi Riil (Live SQLite Query)
Seluruh kartu metrik dan diagram batang dihitung langsung dari query SQLite, bukan angka tiruan:
- Total jiwa terdaftar
- Jumlah Kepala Keluarga (KK unik)
- Rasio perbandingan gender (Pria vs Perempuan)
- Komposisi kelompok usia: Balita (0-4 thn), Anak & Remaja (5-17 thn), Usia Produktif (18-59 thn), dan Lansia (60+ thn)
- Jumlah warga penerima Bantuan Sosial (Bansos)
- Sebaran populasi warga per Rukun Tetangga (RT 01 s/d RT 05)

### 3. Manajemen Data Kependudukan (CRUD Lengkap)
- Pendaftaran warga baru dengan validasi ketat (NIK & No KK tepat 16 digit numerik, pengecekan duplikasi NIK).
- Pembaruan (Edit) data identitas, status perkawinan, domisili, pekerjaan, dan kontak telepon.
- Kartu rincian lengkap kependudukan (KTP & KK view).
- Penghapusan data dengan dialog konfirmasi keamanan.

### 4. Pencarian & Multi-Filter Real-Time
- Pencarian cepat berdasarkan nama, NIK, No KK, atau pekerjaan.
- Filter terpadu berdasarkan RT, jenis kelamin, peran keluarga (Kepala Keluarga, Istri, Anak), dan status Bansos.
- Tombol Reset Filter cepat.

### 5. Ekspor Data Administrasi (CSV)
- Mengunduh seluruh data warga ke file `.csv` dengan encoding UTF-8 BOM, kompatibel langsung dengan Microsoft Excel dan Google Sheets tanpa masalah karakter.

### 6. Desain Antarmuka Modern & Aksesibilitas
- **White Mode Default**: Tampilan bersih, terang, dan profesional dengan palet warna civic emerald dan netral slate.
- **Toggle Mode Gelap**: Mendukung Dark Mode penuh dengan persistensi preferensi di `localStorage`.
- **Responsif Mobile**: Menggunakan menu laci (drawer) pada layar seluler dengan target sentuh tombol minimal 44px.
- **Aksesibilitas Penuh**: Navigasi keyboard (Tab, Enter, Escape untuk menutup modal) dengan indikator fokus kontras tinggi (WCAG AA).

---

## Arsitektur Monorepo

Proyek ini dibangun menggunakan arsitektur native Bun Workspaces tanpa memerlukan kode generator pihak ketiga:

```text
warga-dashboard/
├── package.json                      # Root configuration & scripts
├── README.md                         # Dokumentasi lengkap proyek
├── design.md                         # Spesifikasi teknis arsitektur
├── .gitignore                        # Konfigurasi pengabaian file Git
├── packages/
│   ├── backend/                      # Service Backend ElysiaJS
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── drizzle.config.ts
│   │   ├── sqlite.db                 # Pangkalan data lokal SQLite
│   │   └── src/
│   │       ├── index.ts              # Server entry point & ekspor tipe App
│   │       ├── db/
│   │       │   ├── index.ts          # Inisialisasi DB & Drizzle ORM
│   │       │   └── schema.ts         # Skema tabel citizens
│   │       └── routes/
│   │           └── citizens.ts       # Endpoint CRUD, kalkulasi stats, & seed data
│   └── frontend/                     # Web Client SvelteKit
│       ├── package.json
│       ├── tsconfig.json
│       ├── svelte.config.js
│       ├── vite.config.ts
│       └── src/
│           ├── app.html              # HTML Shell dengan font Plus Jakarta Sans
│           ├── lib/
│           │   ├── api.ts            # Client Eden Treaty type-safe (treaty<App>)
│           │   ├── nikParser.ts      # Parser utilitas 16 digit NIK Indonesia
│           │   └── components/
│           │       ├── Sidebar.svelte    # Menu navigasi & status koneksi DB
│           │       ├── Header.svelte     # Aksi utama, tema, & tombol ekspor
│           │       ├── StatCard.svelte   # Kartu indikator metrik riil
│           │       ├── CitizenTable.svelte # Tabel data warga interaktif
│           │       └── CitizenModal.svelte # Modal Tambah, Ubah, Rincian, & Hapus
│           └── routes/
│               ├── +layout.svelte        # Layout dasar & pengatur tema
│               ├── +page.svelte          # Halaman utama dashboard kependudukan
│               └── layout.css            # Styling tema Tailwind CSS v4
```

---

## Teknologi yang Digunakan

| Komponen | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Runtime** | Bun 1.4+ | Eksekusi TypeScript ultra-cepat berbasis JavaScriptCore |
| **Backend Framework** | ElysiaJS 1.4+ | Framework HTTP performa tinggi dengan JIT compilation |
| **Database** | `bun:sqlite` | Driver SQLite lokal native tanpa latensi jaringan eksternal |
| **ORM** | Drizzle ORM 0.39+ | Type-safe ORM ringan |
| **Client Type-Safety**| Eden Treaty | Menghubungkan tipe data backend ke frontend langsung |
| **Frontend Framework**| SvelteKit 2 & Svelte 5 | Reaktivitas berbasis Runes (`$state`, `$derived`, `$props`) |
| **Bundler & Build** | Vite 8 | Kompilasi instan dan Hot Module Replacement (HMR) |
| **Styling** | Tailwind CSS v4 | CSS-first zero-runtime utility styling |
| **Ikon** | Lucide Svelte | Set ikon SVG proporsional |

---

## Prasyarat Sistem

Pastikan di komputer Anda telah terpasang:
1. **Bun** (v1.0.0 atau versi yang lebih baru)
   - Cek versi: `bun -v`
   - Instalasi (jika belum ada): `powershell -c "irm bun.sh/install.ps1 | iex"`
2. **Git**
   - Cek versi: `git --version`

---

## Panduan Instalasi & Menjalankan

### 1. Kloning Repositori
```bash
git clone https://github.com/Muis89/SiWarga.git
cd SiWarga
```

### 2. Pasang Dependensi
Jalankan perintah ini di direktori utama:
```bash
bun install
```

### 3. Menjalankan Server Pengembangan

#### Opsi A: Jalankan Semua Sekaligus (Direkomendasikan)
Cukup jalankan satu perintah berikut:
```bash
bun run dev
```
Perintah ini akan menyalakan:
- Backend di `http://localhost:3001`
- Frontend di `http://localhost:5173`

Buka browser Anda dan akses:
👉 **http://localhost:5173**

#### Opsi B: Jalankan Secara Terpisah
Jika ingin memantau log backend dan frontend di jendela terminal berbeda:

**Terminal 1 (Backend):**
```bash
bun run dev:backend
```

**Terminal 2 (Frontend):**
```bash
bun run dev:frontend
```

---

## Dokumentasi API Backend

Semua endpoint berada di bawah awalan `/api/citizens`:

| Metode | Endpoint | Deskripsi | Parameter / Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/citizens` | Mengambil daftar warga terpaginasi | Query: `search`, `rt`, `rw`, `gender`, `statusKeluarga`, `statusBantuan`, `page`, `limit` |
| `GET` | `/api/citizens/stats` | Mengambil kalkulasi statistik riil | Tanpa parameter |
| `GET` | `/api/citizens/:id` | Mengambil rincian data satu warga | Param: `id` (integer) |
| `POST` | `/api/citizens` | Mendaftarkan data warga baru | Body: JSON data warga lengkap |
| `PUT` | `/api/citizens/:id` | Memperbarui data warga | Param: `id`, Body: field yang ingin diubah |
| `DELETE` | `/api/citizens/:id` | Menghapus data warga | Param: `id` |
| `POST` | `/api/citizens/seed` | Mengisi data simulasi awal warga | Tanpa parameter |

---

## Struktur Pangkalan Data

Tabel `citizens` pada SQLite menyimpan kolom-kolom berikut:

| Nama Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | INTEGER | Primary Key, Auto Increment |
| `nik` | TEXT(16) | Nomor Induk Kependudukan (Unik, Wajib) |
| `no_kk` | TEXT(16) | Nomor Kartu Keluarga (Wajib) |
| `nama_lengkap` | TEXT | Nama lengkap sesuai KTP |
| `jenis_kelamin` | TEXT | Laki-laki / Perempuan |
| `tempat_lahir` | TEXT | Kota/Kabupaten kelahiran |
| `tanggal_lahir` | TEXT | Tanggal lahir (format YYYY-MM-DD) |
| `agama` | TEXT | Islam, Kristen, Katolik, Hindu, Buddha, Konghucu |
| `pendidikan` | TEXT | SD, SMP, SMA/SMK, Diploma, S1, S2, S3, Belum Sekolah |
| `pekerjaan` | TEXT | Profesi / mata pencaharian |
| `status_pernikahan`| TEXT | Belum Kawin, Kawin, Cerai Hidup, Cerai Mati |
| `status_keluarga` | TEXT | Kepala Keluarga, Istri, Anak, Famili Lain |
| `alamat` | TEXT | Alamat domisili |
| `rt` | TEXT(3) | Nomor RT (misal: 001) |
| `rw` | TEXT(3) | Nomor RW (misal: 003) |
| `nomor_telepon` | TEXT | Kontak telepon / WhatsApp (Opsional, Nullable) |
| `golongan_darah` | TEXT | A, B, AB, O, Tidak Tahu |
| `status_bantuan` | TEXT | Penerima Bantuan / Bukan Penerima |
| `created_at` | TEXT | Timestamp pendaftaran |
| `updated_at` | TEXT | Timestamp pembaruan terakhir |

---

## Panduan Penggunaan Fitur

1. **Memuat Data Awal**:
   Saat pertama kali dijalankan dan database masih kosong, klik tombol kuning **"Muat Data Contoh Warga"** untuk mengisi 10 data simulasi awal secara instan.
2. **Pendaftaran Warga Baru**:
   - Klik tombol hijau **"Tambah Warga"**.
   - Masukkan 16 digit NIK. Fitur otomatisasi akan langsung mendeteksi jenis kelamin, tanggal lahir, dan provinsi asal.
   - Lengkapi data No KK, Nama, Pekerjaan, dan Alamat, lalu klik **"Daftarkan Warga"**.
3. **Pencarian & Penyaringan**:
   - Ketikkan nama, NIK, atau pekerjaan pada kotak pencarian di atas tabel.
   - Gunakan menu tarik-turun untuk menyaring warga berdasarkan RT, jenis kelamin, peran keluarga, atau status penerima bansos.
4. **Mengekspor Data**:
   - Klik tombol **"Ekspor CSV"** di sudut kanan atas untuk mengunduh rekapan data kependudukan ke format spreadsheet.
5. **Mengganti Tema Tampilan**:
   - Klik tombol pengalih tema di header untuk beralih antara **White Mode** dan **Dark Mode**.
