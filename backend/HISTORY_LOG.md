## [2026-08-25] - Phase 1: Setup & Autentikasi
- **Fitur Selesai:** Registrasi User, Login terpusat (3 Roles), dan Endpoint Get Current User. Pengkondisian tabel `users` untuk sistem kredit dan otorisasi.
- **File Dibuat/Dimodifikasi:** 
  - `database/migrations/0001_01_01_000000_create_users_table.php`
  - `app/Models/User.php`
  - `app/Http/Controllers/AuthController.php`
  - `routes/api.php`
- **Keputusan Arsitektur & Keamanan:** Menggunakan integrasi native `HasApiTokens` (Sanctum) untuk stateless token API. Hashing password dienkapsulasi menggunakan `casts()` di tingkat Model untuk menghindari hashing redundan di Controller. Atribut sensitif disembunyikan menggunakan array `$hidden`.
- **Catatan Integrasi Frontend:** Endpoint siap dikonsumsi. 
  - `POST /api/auth/register` (Payload butuh `name`, `email`, `password`, `role`).
  - `POST /api/auth/login` (Mengembalikan `token` dan object `user`).
  - `GET /api/user` (Wajib Header `Authorization: Bearer <token>`).

## [2026-08-25] - Phase 2: Manajemen Gym & Katalog
- **Fitur Selesai:** Endpoint CRUD Gym (Katalog Lokasi). Pembatasan akses modifikasi data (*Create, Update, Delete*) khusus untuk role `admin`.
- **File Dibuat/Dimodifikasi:** 
  - `database/migrations/[timestamp]_create_gyms_table.php`
  - `app/Models/Gym.php`
  - `app/Models/User.php` (Penambahan relasi)
  - `app/Http/Controllers/GymController.php`
  - `routes/api.php`
- **Keputusan Arsitektur & Keamanan:** Menggunakan tipe kolom `jsonb` pada PostgreSQL untuk *facilities* dipadukan dengan Model `casts` (JSON ke Array) untuk menekan query N+1. Otorisasi role divalidasi manual di tingkat Controller untuk memblokir eksploitasi oleh User atau Mitra. Perlindungan referensial menggunakan `onDelete('cascade')`.
- **Catatan Integrasi Frontend:** 
  - `GET /api/gyms` terbuka untuk semua role terautentikasi (gunakan untuk menampilkan daftar Gym di sisi User).
  - Endpoint `POST, PUT, DELETE /api/gyms` akan mengembalikan `403 Unauthorized` jika role bukan admin.