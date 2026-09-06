<div align="center">

<img src="frontend/src/assets/logo.png" alt="RoamFit Logo" width="100" />

# RoamFit — Multi-Gym Access Platform

**Akses ratusan gym premium dengan satu akun, satu dompet kredit, satu PIN.**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Laravel](https://img.shields.io/badge/Laravel-13-FF2D20?logo=laravel&logoColor=white)](https://laravel.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)](https://vercel.com)
[![Render](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render&logoColor=white)](https://render.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[🌐 Live Demo](https://multi-gym-platform.vercel.app) · [📡 API Backend](https://roamfit-api.onrender.com) · [📖 API Contract](backend/API_Contract_Backend.md)

</div>

---

## 📋 Daftar Isi

- [Tentang Aplikasi](#-tentang-aplikasi)
- [Fitur Utama](#-fitur-utama)
- [Arsitektur Sistem](#-arsitektur-sistem)
- [Tech Stack](#-tech-stack)
- [Struktur Proyek](#-struktur-proyek)
- [Database Schema](#-database-schema)
- [API Reference](#-api-reference)
- [Alur Pengguna](#-alur-pengguna)
- [Setup & Instalasi](#-setup--instalasi)
- [Environment Variables](#-environment-variables)
- [Demo Accounts](#-demo-accounts)
- [Deployment](#-deployment)
- [Keamanan](#-keamanan)

---

## 🏋️ Tentang Aplikasi

**RoamFit** adalah platform akses multi-gym berbasis web yang menyelesaikan masalah fragmentasi kebugaran. Pengguna — terutama profesional nomaden — tidak perlu lagi terikat pada keanggotaan satu gym. Cukup dengan satu akun dan sistem kredit pay-per-visit, mereka bisa masuk ke semua gym dalam jaringan RoamFit menggunakan **Kode PIN unik 4 digit** yang digenerate saat check-in.

> **Model Bisnis:** Pengguna membeli paket kredit via Midtrans → Check-in di gym pilihan → PIN di-generate → Resepsionis Mitra validasi PIN → Kredit terpotong secara ACID.

### Masalah yang Diselesaikan

| Masalah | Solusi RoamFit |
|---------|---------------|
| Terpaksa bayar keanggotaan full di satu lokasi | Kredit pay-per-visit, bayar sesuai kunjungan |
| Tidak bisa akses gym lain saat bepergian | Satu akun, akses seluruh jaringan gym |
| Mitra gym kehilangan potensi pelanggan | Dashboard Mitra untuk validasi & track kunjungan |
| Kerumitan administrasi platform gym | Admin panel terpusat untuk manajemen penuh |

---

## ✨ Fitur Utama

### 👤 User (Member)
- **Katalog Gym** — Browse & cari gym berdasarkan nama, lokasi, fasilitas
- **Detail Gym** — Foto hero, informasi lengkap, rating fasilitas, harga kredit
- **Check-in & PIN Generator** — Generate PIN unik 4-digit dengan TTL 2 jam
- **Dompet Kredit** — Beli kredit via Midtrans (QRIS, Transfer, Kartu Kredit), histori transaksi terpadu (check-in + top-up)
- **Profil** — Edit nama, ganti password, badge tier member, total kunjungan
- **Google Sign-In** — Masuk cepat dengan akun Google via OAuth 2.0
- **Active Check-in Banner** — Floating banner saat ada check-in aktif (pending)

### 🏢 Mitra (Gym Partner)
- **Validasi PIN** — Input PIN pengunjung dengan form real-time
- **Dashboard Kunjungan** — Statistik & histori validasi harian
- **Profil Gym** — Kelola informasi, fasilitas, dan foto gym
- **Notifikasi Toast** — Feedback instan sukses/gagal validasi PIN

### 🛡️ Admin (Platform Owner)
- **Manajemen Gym** — CRUD lengkap data gym (termasuk buat akun Mitra baru secara atomik)
- **Manajemen Mitra** — Daftar & kelola akun organisasi mitra
- **Master Ledger** — Audit trail seluruh transaksi platform dengan filter & search
- **Executive Dashboard** — 4 KPI cards + grafik 7-hari aktivitas transaksi (Recharts)
- **Manajemen User** — Pantau semua member platform

---

## 🏗️ Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────┐
│                     PENGGUNA (Browser)                       │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTPS
┌───────────────────────────▼─────────────────────────────────┐
│              FRONTEND — Vercel Edge CDN                      │
│         React 19 SPA + TypeScript + Tailwind CSS            │
│    (TanStack Query · Zustand · React Hook Form · Zod)       │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTPS / REST JSON
┌───────────────────────────▼─────────────────────────────────┐
│          BACKEND API — Render.com (Docker Container)         │
│        Laravel 13 API-only + PHP 8.4 Alpine Linux            │
│    (Sanctum · MidtransService · Google OAuth · Resend)      │
└───────────────────────────┬─────────────────────────────────┘
                            │ TCP / SQL (IPv4 Pooler)
┌───────────────────────────▼─────────────────────────────────┐
│       DATABASE — Supabase Managed PostgreSQL 16              │
│         Region: ap-southeast-1 (Singapore)                   │
└─────────────────────────────────────────────────────────────┘

Third-party integrations:
  ├── Midtrans Snap API     → Payment Gateway (Top-up Kredit)
  ├── Google OAuth 2.0      → Social Login
  └── Gmail SMTP / Resend   → Email Transaksional (async defer)
```

### Keputusan Arsitektur Utama

| Keputusan | Alasan |
|-----------|--------|
| **Decoupled SPA + API** | Skalabilitas independen, zero-cost deployment |
| **Supabase IPv4 Pooler** | Render Free Tier tidak support IPv6 outbound |
| **`defer()` untuk email** | Respon API < 100ms, email tidak blocking thread |
| **`DB::transaction()` + `lockForUpdate()`** | ACID compliance, zero double-spend/double-credit |
| **`vercel.json` SPA rewrite** | Prevent 404 saat hard-refresh di rute dalam |
| **Hard timeout 3-4 detik** | Google/Midtrans failure tidak block API response |

---

## 🛠️ Tech Stack

### Frontend
| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| React | 19 | Core UI library (SPA) |
| TypeScript | 6 | Type safety |
| Vite | 8 | Build tool + HMR |
| Tailwind CSS | 4 | Utility-first styling (Dark Mode) |
| TanStack Query | 5 | Server state, caching, polling |
| Zustand | 5 | Global client state (auth, saldo) |
| React Router DOM | 7 | SPA routing |
| React Hook Form | 7 | Form management |
| Zod | 4 | Schema validation |
| Axios | 1 | HTTP client |
| Framer Motion | 13 | Animasi & transisi |
| Lucide React | 1 | Icon library |
| Recharts | 3 | Chart (Admin Dashboard) |
| `@react-oauth/google` | 0.13 | Google Sign-In |

### Backend
| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| Laravel | 13 | API framework (API-only mode) |
| PHP | 8.4 | Runtime |
| Laravel Sanctum | 4 | API token authentication |
| PostgreSQL | 16 | Primary database |
| Midtrans | Snap API | Payment gateway |
| Resend | 1 | Email transaksional |
| Docker (Alpine) | php:8.4-cli-alpine | Containerisasi backend |

### Infrastructure
| Layer | Platform |
|-------|---------|
| Frontend Hosting | Vercel (Edge CDN) |
| Backend Hosting | Render.com (Docker Web Service) |
| Database | Supabase (Managed PostgreSQL, Singapore) |
| CI/CD | GitHub Actions |
| Container | Docker (Alpine Linux PHP 8.4) |

---

## 📁 Struktur Proyek

```
multi-gym-platform/
├── frontend/                    # React SPA
│   ├── public/
│   │   └── logo.png             # Favicon & public asset
│   ├── src/
│   │   ├── assets/              # Gambar & logo
│   │   ├── components/
│   │   │   ├── cards/           # GymCard
│   │   │   ├── forms/           # GymForm, PinInput
│   │   │   ├── modals/          # ConfirmModal, CheckInConfirmModal,
│   │   │   │                    # TopupModal, LegalModal, PinDisplayModal
│   │   │   ├── shared/          # Logo, PageTransition
│   │   │   └── ui/              # Button, Input, Card, Badge, Skeleton,
│   │   │                        # PinDisplay, ToastContainer
│   │   ├── hooks/
│   │   │   ├── api/             # useGyms, useTransactions, useMitraAPI,
│   │   │   │                    # useMitrasOrg, useTopup
│   │   │   └── useDebounce.ts
│   │   ├── layouts/             # AdminLayout, MitraLayout,
│   │   │                        # UserLayout, ProtectedLayout
│   │   ├── lib/                 # axios instance
│   │   ├── pages/
│   │   │   ├── admin/           # AdminDashboard, GymManager,
│   │   │   │                    # MitraManager, Transactions
│   │   │   ├── auth/            # Login, Register
│   │   │   ├── guest/           # LandingPage
│   │   │   ├── mitra/           # MitraDashboard, MitraHistory,
│   │   │   │                    # MitraGymProfile
│   │   │   └── user/            # GymDiscovery, GymDetail, Profile,
│   │   │                        # WalletHistory, EditProfile,
│   │   │                        # Notifications, Security
│   │   ├── store/               # authStore, checkInStore, paymentStore,
│   │   │                        # toastStore
│   │   ├── types/               # TypeScript interfaces
│   │   └── utils/               # formatters
│   ├── .env.example             # Template environment variables
│   ├── vercel.json              # SPA rewrite rules
│   └── vite.config.ts
│
├── backend/                     # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/    # AuthController, GymController,
│   │   │                        # TransactionController, TopupController,
│   │   │                        # MitraController
│   │   ├── Models/              # User, Gym, Mitra, Transaction,
│   │   │                        # TopupPackage, TopupTransaction
│   │   └── Services/            # MidtransService
│   ├── database/
│   │   ├── migrations/          # Schema migrations
│   │   └── seeders/             # DatabaseSeeder, TopupPackageSeeder
│   ├── resources/views/emails/  # welcome.blade.php, topup_receipt.blade.php
│   ├── routes/api.php
│   ├── Dockerfile               # Alpine Linux PHP 8.4
│   └── .env.example
│
├── docker-compose.yml           # Local PostgreSQL development
└── README.md
```

---

## 🗄️ Database Schema

```mermaid
erDiagram
    USERS ||--o{ GYMS : "mengelola (mitra)"
    USERS ||--o{ TRANSACTIONS : "melakukan (user)"
    USERS ||--o{ TOPUP_TRANSACTIONS : "melakukan"
    GYMS ||--o{ TRANSACTIONS : "menerima"
    TOPUP_PACKAGES ||--o{ TOPUP_TRANSACTIONS : "digunakan"
    MITRAS ||--o{ GYMS : "memiliki"

    USERS {
        bigint id PK
        varchar name
        varchar email
        varchar password
        varchar role "admin|mitra|user"
        integer credit_balance
        boolean is_oauth_user
        timestamp created_at
    }

    GYMS {
        bigint id PK
        bigint mitra_id FK
        varchar name
        text location
        jsonb facilities
        integer credit_price
        jsonb photos
        text maps_url
    }

    TRANSACTIONS {
        bigint id PK
        bigint user_id FK
        bigint gym_id FK
        integer amount
        varchar pin_code
        varchar status "pending|completed|expired"
        timestamp expires_at
    }

    TOPUP_PACKAGES {
        uuid id PK
        varchar name
        integer credits
        integer price_idr
        boolean is_active
    }

    TOPUP_TRANSACTIONS {
        uuid id PK
        bigint user_id FK
        uuid topup_package_id FK
        varchar order_id
        integer amount_idr
        integer credits_added
        varchar status "pending|success|failed|cancel"
        varchar midtrans_transaction_id
    }

    MITRAS {
        bigint id PK
        bigint user_id FK
        varchar org_name
    }
```

### Logika Kredit (Ledger System)

```
User tekan Check-in
      │
      ▼
[transactions] status: PENDING
PIN digenerate, expires_at = now() + 2 jam
Kredit BELUM terpotong
      │
      ▼
Mitra input PIN → Validasi Berhasil
      │
      ▼
DB::transaction() + lockForUpdate():
  ├── users.credit_balance -= amount
  └── transactions.status = "completed"
      │
      ▼
Kredit RESMI terpotong (ACID guaranteed)

Jika PIN tidak divalidasi dalam 2 jam:
  └── status = "expired" → kredit tidak terpotong
```

---

## 📡 API Reference

**Base URL Production:** `https://roamfit-api.onrender.com/api`  
**Auth:** `Authorization: Bearer <sanctum_token>`

### Authentication

| Method | Endpoint | Access | Deskripsi |
|--------|----------|--------|-----------|
| `POST` | `/auth/register` | Public | Registrasi user baru |
| `POST` | `/auth/login` | Public | Login, mendapatkan Bearer token |
| `POST` | `/auth/google` | Public | Google OAuth Sign-In |
| `GET` | `/user` | All roles | Data user yang sedang login |
| `PUT` | `/user` | All roles | Update profil & password |
| `POST` | `/auth/logout` | All roles | Invalidate token |

### Gym Management

| Method | Endpoint | Access | Deskripsi |
|--------|----------|--------|-----------|
| `GET` | `/gyms` | User/Admin | Daftar semua gym aktif |
| `GET` | `/gyms/{id}` | User/Admin | Detail gym + relasi mitra |
| `POST` | `/gyms` | Admin | Buat gym baru (+ opsional buat akun Mitra) |
| `PUT` | `/gyms/{id}` | Admin | Update data gym |
| `DELETE` | `/gyms/{id}` | Admin | Hapus gym |

### Transaksi & Check-in

| Method | Endpoint | Access | Deskripsi |
|--------|----------|--------|-----------|
| `POST` | `/transactions/checkin` | User | Check-in ke gym, generate PIN |
| `GET` | `/transactions/{id}` | User | Polling status transaksi (real-time) |
| `GET` | `/transactions` | User/Admin | Histori transaksi terpadu |
| `POST` | `/transactions/validate` | Mitra | Validasi PIN pengunjung |

### Top-Up Kredit (Midtrans)

| Method | Endpoint | Access | Deskripsi |
|--------|----------|--------|-----------|
| `GET` | `/topup-packages` | Auth | Daftar paket kredit aktif |
| `POST` | `/topups` | User | Buat order top-up, dapat `snap_token` |
| `GET` | `/topups/{orderId}/status` | User | Cek status pembayaran |
| `POST` | `/topups/{orderId}/cancel` | User | Batalkan transaksi pending |
| `POST` | `/webhooks/midtrans` | System | Webhook callback Midtrans |

### Admin

| Method | Endpoint | Access | Deskripsi |
|--------|----------|--------|-----------|
| `GET` | `/users` | Admin | Daftar user (filter `?role=mitra\|user`) |
| `GET` | `/mitras` | Admin | Daftar organisasi mitra |

---

## 🔄 Alur Pengguna

### Alur Check-in (User → Mitra)

```
1. User browse GymDiscovery → pilih gym
2. User klik "Check-in" → CheckInConfirmModal tampil
3. User konfirmasi → POST /transactions/checkin
4. Backend: generate PIN 4-digit, set expires_at = now() + 2jam
           Status: PENDING (kredit BELUM terpotong)
5. Frontend: tampilkan PIN besar + countdown timer
6. User tunjukkan PIN ke resepsionis Mitra
7. Mitra input PIN di MitraDashboard → POST /transactions/validate
8. Backend: DB::transaction() {
              users.credit_balance -= amount
              transactions.status = "completed"
           }
9. Mitra: Toast "Validasi Berhasil" ✓
10. User: Banner "Active Check-in" menghilang, saldo terupdate
```

### Alur Top-Up Kredit

```
1. User klik "Beli Kredit" → TopupModal tampil
2. User pilih paket → POST /topups (payload: topup_package_id)
3. Backend: generate Midtrans Snap Token via MidtransService
4. Frontend: window.snap.pay(snap_token) → Midtrans Popup
5. User bayar (QRIS/Transfer/Kartu) di popup Midtrans
6. Midtrans: kirim webhook POST /webhooks/midtrans
7. Backend: validasi SHA512 signature → DB::transaction() {
              topup_transactions.status = "success"
              users.credit_balance += credits_added
           }
8. Frontend: auto-detect via polling → saldo terupdate real-time
9. Email konfirmasi terkirim (async defer, non-blocking)
```

---

## 🚀 Setup & Instalasi

### Prasyarat
- Node.js ≥ 20
- PHP ≥ 8.4 + Composer
- Docker Desktop (untuk database lokal)
- Git

### 1. Clone Repository

```bash
git clone https://github.com/Reykiraa/multi-gym-platform.git
cd multi-gym-platform
```

### 2. Setup Database Lokal (Docker)

```bash
docker-compose up -d
```

Database PostgreSQL tersedia di `localhost:5436` dengan:
- **DB:** `multi_gym_db`
- **User:** `multi_gym_user`
- **Password:** `multi_gym_password`

### 3. Setup Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Edit `.env` dengan konfigurasi database:
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5436
DB_DATABASE=multi_gym_db
DB_USERNAME=multi_gym_user
DB_PASSWORD=multi_gym_password
```

```bash
php artisan migrate --seed
php artisan serve   # Berjalan di http://localhost:8000
```

### 4. Setup Frontend

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_MIDTRANS_CLIENT_KEY=<your_midtrans_sandbox_client_key>
VITE_MIDTRANS_ENVIRONMENT=sandbox
VITE_GOOGLE_CLIENT_ID=<your_google_client_id>
```

```bash
npm run dev   # Berjalan di http://localhost:5173
```

---

## 🔐 Environment Variables

### Frontend (`frontend/.env`)

| Variable | Contoh | Deskripsi |
|----------|--------|-----------|
| `VITE_API_BASE_URL` | `http://localhost:8000/api` | URL base API backend |
| `VITE_MIDTRANS_CLIENT_KEY` | `Mid-client-xxxx` | Midtrans Client Key (Sandbox/Production) |
| `VITE_MIDTRANS_ENVIRONMENT` | `sandbox` | `sandbox` atau `production` |
| `VITE_GOOGLE_CLIENT_ID` | `964887421528-xxx.apps.googleusercontent.com` | Google OAuth Client ID |

> ⚠️ **JANGAN commit `.env`** ke repository. Gunakan `.env.example` sebagai template.

### Backend (`backend/.env`)

| Variable | Deskripsi |
|----------|-----------|
| `APP_KEY` | Laravel application key (generate via `artisan key:generate`) |
| `DB_CONNECTION` | `pgsql` |
| `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` | Koneksi PostgreSQL |
| `MIDTRANS_SERVER_KEY` | Midtrans Server Key (rahasia, hanya di backend) |
| `MIDTRANS_IS_PRODUCTION` | `false` untuk sandbox |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google OAuth credentials |
| `MAIL_*` | Konfigurasi SMTP email |
| `SANCTUM_STATEFUL_DOMAINS` | Domain frontend yang diizinkan |

---

## 🧪 Demo Accounts

Akun berikut tersedia setelah menjalankan `php artisan migrate --seed`:

| Role | Email | Password |
|------|-------|----------|
| 👑 **Admin** | `admin@multigym.com` | `password` |
| 🏢 **Mitra** | `mitra1@gym.com` | `password` |
| 👤 **User** | `user1@member.com` | `password` |

> Akun demo ini juga tersedia di [Live Demo](https://multi-gym-platform.vercel.app).

---

## ☁️ Deployment

### Frontend (Vercel)

1. Connect repositori GitHub ke Vercel
2. Set **Build Command:** `npm run build`
3. Set **Output Directory:** `dist`
4. Set **Root Directory:** `frontend`
5. Tambahkan semua environment variables di dashboard Vercel
6. Vercel otomatis deploy setiap push ke `main`

File [`frontend/vercel.json`](frontend/vercel.json) mengatur SPA rewrite agar semua rute diarahkan ke `index.html`.

### Backend (Render.com Docker)

1. Buat **Web Service** baru di Render, pilih type **Docker**
2. Arahkan ke folder `backend/`
3. Render akan menggunakan [`backend/Dockerfile`](backend/Dockerfile)
4. Tambahkan semua environment variables di dashboard Render
5. Set **Start Command:** sudah di-handle Dockerfile

### Database (Supabase)

1. Buat project baru di Supabase (region: Singapore `ap-southeast-1`)
2. Gunakan **IPv4 Connection Pooler** untuk koneksi dari Render
3. Format connection string: `postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres`
4. Jalankan `php artisan migrate --seed` dari environment backend

---

## 🔒 Keamanan

| Aspek | Implementasi |
|-------|-------------|
| **API Authentication** | Laravel Sanctum Bearer Token |
| **Role-based Access Control** | Middleware per-role di setiap rute API |
| **PIN Security** | TTL 2 jam (`expires_at`), auto-expire |
| **ACID Transactions** | `DB::transaction()` + `lockForUpdate()` pada semua mutasi kredit |
| **Idempotency** | Guard duplikasi webhook Midtrans |
| **Webhook Validation** | SHA512 signature key verification (Midtrans) |
| **CORS** | Konfigurasi ketat untuk allowed origins |
| **Sensitive Data** | `.env` tidak di-commit, credentials di-rotate setelah exposure |
| **Timeout** | Hard timeout 3-4 detik untuk semua outbound HTTP (Google, Midtrans) |
| **Non-blocking Email** | `defer()` isolasi SMTP agar tidak block API response |

---

## 🗺️ Routing Map

```
/                   → LandingPage (Guest)
/login              → Login
/register           → Register

/user/gyms          → GymDiscovery (Protected: User)
/user/gyms/:id      → GymDetail + Check-in
/user/wallet        → WalletHistory + Top-Up
/user/profile       → Profile
/user/profile/edit  → EditProfile
/user/profile/security → Security (Ganti Password)
/user/notifications → Notifications

/mitra/dashboard    → MitraDashboard + PIN Validation (Protected: Mitra)
/mitra/history      → MitraHistory
/mitra/gym-profile  → MitraGymProfile

/admin/dashboard    → AdminDashboard + KPI (Protected: Admin)
/admin/gyms         → GymManager (CRUD)
/admin/transactions → Master Ledger
/admin/mitra        → MitraManager
```

---

## 📈 Performance

- **API Response Time:** < 100ms (endpoint internal, tanpa blocking I/O)
- **Email Delivery:** Async via `defer()`, tidak mempengaruhi latensi API
- **Database Queries:** Index pada `email`, `role`, `pin_code+status`, `user_id`, `gym_id`
- **Frontend Caching:** TanStack Query dengan smart cache invalidation
- **CDN:** Vercel Edge Network untuk aset statis frontend

---

## 🤝 Kontribusi

Pull request sangat disambut. Untuk perubahan besar, buka issue terlebih dahulu untuk mendiskusikan apa yang ingin diubah.

1. Fork repositori
2. Buat branch fitur: `git checkout -b feat/nama-fitur`
3. Commit perubahan: `git commit -m 'feat: tambah fitur X'`
4. Push ke branch: `git push origin feat/nama-fitur`
5. Buat Pull Request ke `main`

---

<div align="center">

Dibuat dengan ❤️ oleh Tim RoamFit · © 2026 RoamFit Platform. All rights reserved.

</div>
