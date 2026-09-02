# Multi-Gym Access Platform - Engineering & Architecture History Log

## [2026-08-27] - Integrasi Modul FE1 (User/Member App) & Backend
- **Fitur Selesai:** 
  - Endpoint `PUT /api/user` (Update nama dan ganti password dengan verifikasi `Hash::check()` password lama).
  - Transformasi payload `GET /api/transactions` untuk menyajikan skema flat (`gym_name`, `type: deduction`, ISO8601 timestamp).
  - Penambahan Zustand `persist` middleware pada `authStore.ts` untuk mengunci sesi login saat refresh halaman.
  - Perbaikan konsumsi data histori dompet di `WalletHistory.tsx`.
- **File Dibuat/Dimodifikasi:** 
  - `backend/app/Http/Controllers/AuthController.php`
  - `backend/app/Http/Controllers/TransactionController.php`
  - `backend/routes/api.php`
  - `frontend/src/store/authStore.ts`
  - `frontend/src/pages/user/WalletHistory.tsx`
  - `frontend/src/pages/user/profile/EditProfile.tsx`
  - `frontend/src/pages/user/profile/Security.tsx`

## [2026-08-27] - Manual Top-Up Ledger, Core Seeders & Mitra API Wiring
- **Fitur Selesai:**
  - Migrasi `transactions`: kolom `gym_id` & `pin_code` dijadikan `nullable` untuk mendukung pencatatan transaksi manual Top-Up.
  - `WalletController::topup()` dibungkus `DB::transaction()` dan mencatat entri `Transaction` bertipe `TOPUP` (`gym_id: null`).
  - Endpoint `GET /api/gyms/{id}` mengembalikan detail gym beserta relasi `mitra`.
  - Endpoint `GET /api/users` mendukung query `?role=mitra|user` untuk admin.
  - Database Seeder lengkap: 1 Admin, 2 Mitra, 2 User Member, 3 Gym (`migrate:fresh --seed`).
  - `GymForm.tsx`: dropdown mitra dinamis dari `GET /api/users?role=mitra`.
  - Global Toast terpasang di level custom hook API.
  - `MitraDashboard.tsx` & `MitraHistory.tsx` tersambung live ke API.
- **File Dibuat/Dimodifikasi:**
  - `backend/database/migrations/2026_08_27_081210_update_transactions_table_nullable.php`
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

---

## [2026-08-27] - Real-Time Polling & Dynamic Profile Aggregation
- **Fitur Selesai:**
  - `TransactionController@show` dan rute `GET /transactions/{id}` diimplementasikan untuk polling status real-time.
  - `GymDetail.tsx` melakukan auto-polling status check-in via TanStack Query, dan otomatis menutup modal saat status `completed`.
  - `AuthController@user` menyertakan agregasi profil: `member_since`, `total_visits`, dan `tier`.
  - `Profile.tsx` merender badge Member, Total Visits, dan Member Since secara dinamis dari API.
  - `GymController@store` mendukung opsi pembuatan Mitra baru langsung saat pembuatan Gym via `DB::transaction`.
  - `GymForm.tsx` diperbarui dengan tabs/radio pemilihan mitra eksisting vs baru.
  - `LandingPage.tsx` ditambahkan efek `scroll-smooth` pada navigasi "Explore More".
- **File Dibuat/Dimodifikasi:**
  - `backend/app/Http/Controllers/TransactionController.php`
  - `backend/app/Http/Controllers/AuthController.php`
  - `backend/app/Http/Controllers/GymController.php`
  - `backend/routes/api.php`
  - `frontend/src/pages/user/GymDetail.tsx`
  - `frontend/src/pages/user/Profile.tsx`
  - `frontend/src/types/index.ts`
  - `frontend/src/types/admin.ts`
  - `frontend/src/components/forms/GymForm.tsx`
  - `frontend/src/pages/guest/LandingPage.tsx`

---

## [2026-08-28] - Flat Payload Refactor & Automated Testing Integration
- **Fitur Selesai:**
  - `GymController@store` diperbarui untuk menerima payload flat `mitra_name`, `mitra_email`, `mitra_password` dari frontend saat pembuatan akun Mitra baru secara atomik (default password: `Gym1234!`).
  - `GymManagementTest.php` ditambahkan untuk menguji fitur Admin membuat Gym beserta akun Mitra secara otomatis dan menolak non-admin (403).
  - `GymForm.tsx` menyediakan form terpadu pembuatan Gym dan akun Resepsionis dengan payload flat.
  - `MitraDashboard.tsx` & `MitraHistory.tsx` diperbaiki: standarisasi header tabel status dan info check-in.
  - `checkInStore.ts` ditambahkan middleware `persist` (localStorage) untuk menyimpan `activeCheckIn`.
  - `Navbar.tsx` memunculkan floating banner "Check-in Aktif" jika ada transaksi pending.
  - `GymDetail.tsx` & `WalletHistory.tsx` membaca data check-in aktif dari global store.
- **File Dibuat/Dimodifikasi:**
  - `backend/app/Http/Controllers/GymController.php`
  - `backend/tests/Feature/GymManagementTest.php`
  - `frontend/src/components/forms/GymForm.tsx`
  - `frontend/src/types/admin.ts`
  - `frontend/src/pages/mitra/MitraDashboard.tsx`
  - `frontend/src/pages/mitra/MitraHistory.tsx`
  - `frontend/src/store/checkInStore.ts`
  - `frontend/src/components/shared/Navbar.tsx`
  - `frontend/src/pages/user/GymDetail.tsx`
  - `frontend/src/pages/user/WalletHistory.tsx`

---

## [2026-08-28] - UX Polish & Strict 1-Gym-1-Account (Pin Popup & History Details)
- **Fitur Selesai:**
  - `GymController@store` direfaktor ulang: menghapus dukungan penggunaan `mitra_id` eksisting, dan mewajibkan pembuatan instance akun User mitra baru untuk setiap Gym yang terbuat (`DB::transaction`).
  - `GymForm.tsx` diperbarui untuk menghilangkan radio pemilihan Mitra lama dan sepenuhnya mewajibkan form pengisian data akun Mitra Baru.
  - `PinDisplay.tsx` dan `GymDetail.tsx` diperbarui: Menambahkan tombol "X" (tutup) pada Pop-up PIN aktif tanpa menghilangkan state asli pada Zustand.
  - `ProtectedLayout.tsx` ditambahkan Floating Action Button (FAB) beranimasi *pulse* di sudut kanan bawah saat user memiliki PIN aktif.
  - `WalletHistory.tsx` diperbarui: baris riwayat dapat diklik untuk membuka Modal rincian Transaksi.
- **File Dibuat/Dimodifikasi:**
  - `backend/app/Http/Controllers/GymController.php`
  - `frontend/src/types/admin.ts`
  - `frontend/src/components/forms/GymForm.tsx`
  - `frontend/src/components/ui/PinDisplay.tsx`
  - `frontend/src/pages/user/GymDetail.tsx`
  - `frontend/src/layouts/ProtectedLayout.tsx`
  - `frontend/src/pages/user/WalletHistory.tsx`
- **Keputusan Arsitektur & Keamanan:** Pengetatan 1-Gym-1-Account memastikan tiap entitas Gym memiliki isolasi akun Mitra (kredensial dan dashboard) yang mandiri.

---

## [2026-08-30] - Bug Fix: TypeScript Strict & Zod Resolver (`GymForm.tsx`)
- **Fitur Selesai:**
  - `GymForm.tsx` diperbaiki: Memecah Zod schema menjadi `gymBaseSchema` dan `gymSchema` (`.superRefine`) agar tipe inferensi TypeScript `GymFormValues` tetap flat dan tidak menimbulkan konflik pada properti `resolver: zodResolver(...)`.
  - Form validation: Penyempurnaan pada properti `defaultValues` di `useForm` (fallback `undefined`) agar kompatibel penuh dengan `z.coerce.number().optional()`.
  - `handleFormSubmit` disesuaikan untuk mengirim field opsional (email kosong `""` menjadi `undefined`) konsisten dengan `GymFormPayload`.
- **File Dibuat/Dimodifikasi:**
  - `frontend/src/components/forms/GymForm.tsx`
- **Keputusan Arsitektur & Keamanan:** Type inference diambil dari base skema mentah untuk meminimalisasi konflik tipe TypeScript dengan React Hook Form resolver, dengan runtime validation tetap ketat via `.superRefine()`.

---

## [2026-08-30] - Milestone 1: B2B Multi-Branch Mitra Hierarchy & Admin Management
- **Konteks:** Mendukung model bisnis enterprise di mana satu mitra/brand (misal PT FTL, Gold's Gym) menaungi banyak cabang gym, dengan masing-masing cabang tetap memiliki akun pengelola mandiri.
- **Backend (Laravel 12):**
  - Migrasi Database:
    - Tabel baru `mitras` (`name`, `contact_email`, `contact_phone`, `address`, `description`).
    - Additive migration kolom nullable FK `mitra_org_id` pada tabel `gyms` dan `users` (`nullOnDelete`).
  - Model & Relasi: Model `Mitra.php`, relasi `gyms()` dan `branchAccounts()`. Penambahan relasi `mitraOrg()` pada `User.php` dan `Gym.php`.
  - Endpoint & Controller:
    - CRUD Mitra Admin: `MitraController.php` (`/api/mitras`) dengan agregasi `withCount(['gyms', 'branch_accounts'])`.
    - Endpoint Registrasi Cabang: `POST /api/gyms/branch` pada `GymController.php` terproteksi `DB::transaction()`.
- **Frontend (React TS):**
  - UI Form 2-Tab: `GymForm.tsx` mendukung tab "Mitra Baru" dan "Tambah Cabang" (searchable parent org dropdown, branch manager account, & gym details).
  - Admin Portal: Halaman `MitraManager.tsx`, integrasi navigasi sidebar, dan dashboard stats card.
  - Data Fetching: Hook `useMitrasOrg.ts` dengan cache key terisolasi `['admin', 'mitra-orgs']`.
- **File Dibuat/Dimodifikasi:**
  - `backend/database/migrations/2026_08_28_093000_create_mitras_table.php`
  - `backend/database/migrations/2026_08_28_093100_add_mitra_org_id_to_gyms_and_users.php`
  - `backend/app/Models/Mitra.php`
  - `backend/app/Models/User.php`
  - `backend/app/Models/Gym.php`
  - `backend/app/Http/Controllers/MitraController.php`
  - `backend/app/Http/Controllers/GymController.php`
  - `backend/routes/api.php`
  - `frontend/src/types/admin.ts`
  - `frontend/src/hooks/api/useMitrasOrg.ts`
  - `frontend/src/components/forms/GymForm.tsx`
  - `frontend/src/pages/admin/MitraManager.tsx`
  - `frontend/src/pages/admin/GymManager.tsx`
  - `frontend/src/layouts/AdminLayout.tsx`
  - `frontend/src/pages/admin/AdminDashboard.tsx`

---

## [2026-08-31] - Milestone 2: Type-Safe Dynamic User Attributes & Profile Engine
- **Konteks:** Menghilangkan kalkulasi ganda/fat controller pada profil user dan menstandarisasi atribut dinamis langsung dari database.
- **Backend (Laravel 12):**
  - Backend-Driven Accessors: Penambahan Eloquent Accessors (`$appends`: `member_since`, `total_visits`, `tier`) langsung pada Model `User.php`.
  - Clean Controller: Pembersihan agregasi manual di `AuthController@user` sehingga controller tetap ramping dan reusable.
- **Frontend (React TS):**
  - Type Unification: Penggabungan interface `User` dan `UserProfile` menjadi *Single Source of Truth* di `frontend/src/types/index.ts`.
  - Strict Typing: Eliminasi seluruh hack type casting `as any` dan `as userType` di `Navbar.tsx`, `WalletHistory.tsx`, dan `Profile.tsx` (100% lulus `npx tsc --noEmit` dengan 0 error).
- **File Dibuat/Dimodifikasi:**
  - `backend/app/Models/User.php`
  - `backend/app/Http/Controllers/AuthController.php`
  - `frontend/src/types/index.ts`
  - `frontend/src/pages/user/Profile.tsx`

---

## [2026-08-31] - Milestone 3: Full-Stack ACID Escrow Ledger & Synchronized Check-In UX
- **Konteks:** Implementasi alur pay-per-visit anti-double-spending, pemisahan saldo hold/pending, FAB kontekstual, dan validasi PIN instan.
- **Backend (Laravel 12):**
  - Arsitektur Escrow Saldo: Pemisahan Total Saldo (`credit_balance`), Saldo Ditahan (`pending_credits`), dan Saldo Tersedia (`available_credits`) via Model Accessors di `User.php`.
  - Mutasi Check-In (`POST /api/transactions/checkin`): Proteksi `DB::transaction()` + `lockForUpdate()`, validasi `available_credits`, 4-digit random PIN, 1 jam expiry.
  - Settlement Validasi Mitra (`POST /api/mitra/transactions/validate-pin`): Pemotongan permanen saldo user hanya saat resepsionis memvalidasi PIN (`lockForUpdate()`), audit trail `validated_at` dan `validated_by`.
  - Pembatalan & Auto-Refund (`POST /api/transactions/{id}/cancel`): Pelepasan status pending yang otomatis memulihkan `available_credits` seketika.
  - Single Truth Pending Session: `GET /api/transactions/active-pending` selalu mengembalikan status 200 JSON.
- **Frontend (React TS):**
  - Single Source of Truth Cache: Menggunakan TanStack `queryClient.setQueryData` untuk mengeliminasi *race condition* antar tab/komponen.
  - Contextual FAB Lifecycle: FAB abu-abu dihilangkan total; FAB kuning menyala hanya muncul saat ada sesi pending aktif dan modal PIN sedang ditutup.
  - Instant Modal Popup: Modal PIN langsung muncul di depan layar seketika saat tombol check-in ditekan tanpa lag.
  - Real-Time Validation Listener: Polling status transaksi (1.5 detik) yang otomatis memicu Toast Sukses, menutup modal, menghilangkan FAB, dan menyinkronkan saldo navbar.
  - Wallet History UI: Badge warna dinamis representatif (Hijau: Berhasil, Kuning: Pending, Merah: Batal, Abu-abu: Expired).
- **File Dibuat/Dimodifikasi:**
  - `backend/app/Models/User.php`
  - `backend/app/Http/Controllers/Api/TransactionController.php`
  - `frontend/src/types/index.ts`
  - `frontend/src/store/authStore.ts`
  - `frontend/src/store/checkInStore.ts`
  - `frontend/src/layouts/ProtectedLayout.tsx`
  - `frontend/src/pages/user/GymDetail.tsx`
  - `frontend/src/pages/user/WalletHistory.tsx`
  - `frontend/src/components/modals/PinDisplayModal.tsx`
  - `frontend/src/components/shared/Navbar.tsx`

---

## [2026-09-02] - Phase: Google OAuth 2.0 Social Authentication
- **Fitur Selesai:** 
  - Integrasi Social Login Google OAuth 2.0 menggunakan standar modern Google Identity Services (ID-Token Flow).
  - Verifikasi kredensial Google ID Token di sisi backend Laravel via Google TokenInfo API (`POST /api/auth/google`).
  - Auto-provisioning akun baru (Role default: `user`, Saldo awal: `0 CR`, dan kata sandi acak yang di-hash aman).
  - Penerbitan Personal Access Token Laravel Sanctum untuk sesi Google terotentikasi.
  - Komponen UI Tombol Google Sign-In pada halaman Login (`Login.tsx`) dan Register (`Register.tsx`) terhubung langsung ke Zustand `authStore`.
- **File Dibuat/Dimodifikasi:**
  - **Backend:**
    - `config/services.php` (Konfigurasi client_id & client_secret Google)
    - `routes/api.php` (Pendaftaran endpoint publik `POST /api/auth/google`)
    - `app/Http/Controllers/AuthController.php` (Method `googleLogin()` dengan verifikasi ID Token)
  - **Frontend:**
    - `package.json` (Pemasangan dependensi `@react-oauth/google`)
    - `src/main.tsx` (Pemasangan wrapper `<GoogleOAuthProvider>`)
    - `src/pages/auth/Login.tsx` (Integrasi GoogleLogin button & success handler)
    - `src/pages/auth/Register.tsx` (Integrasi GoogleLogin button & success handler)
- **Keputusan Arsitektur & Keamanan:**
  - **ID-Token Verification:** Backend memvalidasi `aud` (Audience) dan status `email_verified` secara langsung ke server Google sebelum membuat/mengambil data user di PostgreSQL untuk mencegah pemalsuan token.
  - **Credential Isolation:** Akun yang mendaftar via Google diberikan password hash acak 32-karakter, mencegah serangan brute-force pada form login email/password konvensional.
  - **SPA Seamless Flow:** Menghilangkan redirect URL yang lambat dengan memanfaatkan pop-up Google One Tap / Sign-In langsung di browser.