# TASK BRIEF: BACKEND DEVELOPER (API & DATABASE)
**Role:** Backend Developer (Agent/Human)
**Working Directory:** `/backend`
**Tech Stack:** Laravel 11 (API Only), PostgreSQL, Sanctum.

## 1. Tujuan Utama
Membangun RESTful API yang aman dan efisien untuk melayani aplikasi Frontend, serta mengelola integritas database terutama untuk transaksi pemotongan kredit (ACID compliance).

## 2. To-Do List & Pipeline Kerja

### Fase 1: Setup & Autentikasi (Hari 1-3)
- [ ] Inisialisasi project Laravel 11 di folder `/backend`.
- [ ] Konfigurasi koneksi PostgreSQL.
- [ ] Setup Laravel Sanctum untuk API Token.
- [ ] Buat Migration untuk tabel `users` (tambahkan kolom `role` dan `credit_balance`).
- [ ] Buat API Endpoint: `POST /api/auth/register` dan `POST /api/auth/login`.
- [ ] Buat API Endpoint: `GET /api/user` (untuk mengambil data user yang sedang login).
- [ ] **INTEGRASI:** Buat dokumentasi API (Postman Collection / Swagger) dan bagikan ke tim Frontend.

### Fase 2: Manajemen Gym (Hari 4-6)
- [ ] Buat Migration untuk tabel `gyms` (kolom: `mitra_id`, `name`, `location`, `facilities` [JSON], `credit_price`).
- [ ] Buat relasi One-to-Many dari `users` ke `gyms`.
- [ ] Buat API Endpoint: `GET /api/gyms` (Bisa diakses User).
- [ ] Buat API Endpoint CRUD Gym (Hanya bisa diakses oleh role `admin`).

### Fase 3 & 4: Core Transaksi Ledger (Hari 7-12)
- [ ] Buat Migration tabel `transactions` (`user_id`, `gym_id`, `amount`, `pin_code`, `status`, `expires_at`).
- [ ] Buat Endpoint `POST /api/transactions/checkin`:
      - Validasi saldo user.
      - Generate PIN 4-digit unik.
      - Set `expires_at` (+2 jam).
      - Insert status `pending`.
- [ ] Buat Endpoint `POST /api/transactions/validate` (Hanya untuk `mitra`):
      - Cocokkan PIN.
      - Gunakan `DB::transaction()` untuk potong `credit_balance` di tabel `users` dan update status `completed` di tabel `transactions`.
- [ ] Setup GitHub Actions `backend.yml` untuk testing PHPUnit/Pest.
