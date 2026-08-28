## [2026-08-27] - Bug Fix & Full Live Integration: Admin Portal, Mitra Portal, Gym Detail

- **Fitur Selesai:**
  - Migration baru: `gym_id` & `pin_code` pada tabel `transactions` dijadikan `nullable` untuk mendukung pencatatan histori Top-Up manual.
  - `WalletController::topup()` dibungkus `DB::transaction()` dan mencatat entri `Transaction` bertipe `TOPUP` (gym_id: null) secara atomik.
  - Endpoint `GET /api/gyms/{id}` — method `show()` di `GymController` mengembalikan detail gym beserta relasi `mitra`.
  - Endpoint `GET /api/users` — method `index()` di `AuthController` untuk admin, support query `?role=mitra|user`.
  - Seeder lengkap: 1 Admin, 2 Mitra, 2 User Member, 3 Gym — siap `migrate:fresh --seed`.
  - `GymForm.tsx`: Input `mitra_id` manual dihapus, diganti `<select>` dropdown dinamis dari `GET /api/users?role=mitra`.
  - Global Toast terpasang di semua mutasi: `useGyms`, `useTransactions`, `useMitraAPI`.
  - `MitraDashboard.tsx` & `MitraHistory.tsx`: Seluruh mock dihapus, disambungkan ke `useGetTransactions` dan `useValidatePin` live.
- **File Dibuat/Dimodifikasi:**
  - `backend/database/migrations/2026_08_27_081210_update_transactions_table_nullable.php` (baru)
  - `backend/app/Http/Controllers/WalletController.php`
  - `backend/app/Http/Controllers/GymController.php`
  - `backend/app/Http/Controllers/AuthController.php`
  - `backend/routes/api.php`
  - `backend/database/seeders/DatabaseSeeder.php`
  - `frontend/src/components/forms/GymForm.tsx`
  - `frontend/src/hooks/api/useGyms.ts`
  - `frontend/src/hooks/api/useTransactions.ts`
  - `frontend/src/hooks/api/useMitraAPI.ts`
  - `frontend/src/pages/mitra/MitraDashboard.tsx`
  - `frontend/src/pages/mitra/MitraHistory.tsx`
  - `frontend/src/types/admin.ts`
- **Keputusan Arsitektur & Keamanan:** Semua mutasi backend kini dicatat atomik dalam `DB::transaction()`. Dropdown Mitra menggunakan query API langsung sehingga tidak ada ID hard-coded di form. Toast dipasang di level hook (bukan komponen), memastikan feedback konsisten.
- **Catatan Integrasi:** Setelah seeder dijalankan, akun test tersedia di `admin@multigym.com`, `mitra1@gym.com`, `user1@member.com` (semua password: `password`).

## [2026-08-27] - Integrasi Modul FE1 (User/Member App) & Backend

- **Fitur Selesai:** 
  - Endpoint `PUT /api/user` (Update nama dan ganti password dengan verifikasi password lama).
  - Transformasi payload `GET /api/transactions` untuk menyajikan skema flat (`gym_name`, `type: deduction`, ISO8601 timestamp) kompatibel dengan FE1.
  - Penambahan Zustand `persist` middleware pada `authStore.ts` di Frontend untuk mengunci sesi login saat refresh halaman.
  - Perbaikan konsumsi data histori dompet di `WalletHistory.tsx`.
- **File Dibuat/Dimodifikasi:** 
  - `backend/app/Http/Controllers/AuthController.php`
  - `backend/app/Http/Controllers/TransactionController.php`
  - `backend/routes/api.php`
  - `frontend/src/store/authStore.ts`
  - `frontend/src/pages/user/WalletHistory.tsx`
  - `frontend/src/pages/user/profile/EditProfile.tsx`
  - `frontend/src/pages/user/profile/Security.tsx`
- **Keputusan Arsitektur & Keamanan:** Menggunakan `$transactions->getCollection()->transform()` untuk mempertahankan format paginator Laravel tanpa merusak kontrak JSON FE1. Validasi keamanan password lama via `Hash::check()` sebelum menyimpan hash password baru.
- **Catatan Integrasi Frontend:** Seluruh alur User (Register, Login, Discovery, Check-in, Timer, Edit Profile, dan Wallet History) telah terhubung secara *live* ke API Backend.