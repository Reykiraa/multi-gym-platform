# History Log - Frontend Core (Admin & Mitra)

## [2026-08-26] - Phase 1: Core Architecture & Auth
- **Fitur Selesai:** Inisialisasi struktur *routing* berjenjang (Guest, User, Admin, Mitra) menggunakan layout kustom (`ProtectedLayout`, `AdminLayout`, `MitraLayout`). Setup manajemen stat (*state management*) autentikasi dengan Zustand beserta *persist middleware*, pembuatan halaman `Login` dan `Register` dengan validasi skema Zod + React Hook Form, serta penyempurnaan UI *dark theme* dengan aksen Kuning Gold.
- **File Dibuat/Dimodifikasi:** `src/App.tsx`, `src/layouts/*.tsx`, `src/store/authStore.ts`, `src/pages/auth/Login.tsx`, `src/pages/auth/Register.tsx`, `src/types/auth.ts`.
- **Mock Data & State Status:** Zustand `authStore` menyimpan tipe *Role* pengguna (`admin`, `mitra`, `user`) secara terpusat untuk keperluan navigasi dan otorisasi.
- **Catatan Integrasi Backend:** Otentikasi (`POST /api/auth/login` dan `/api/auth/register`) disiapkan menggunakan *Axios interceptors*.

## [2026-08-27] - Phase 2: Admin Dashboard & Gym Management
- **Fitur Selesai:** Setup tata letak `AdminLayout` berbasis *Desktop-First* (Sidebar di kiri dan area konten utama yang dibentangkan). Pembuatan halaman `AdminDashboard` dengan kartu ringkasan KPI, serta halaman `GymManager` yang menampilkan rancangan tabel CRUD untuk manajemen Mitra Gym.
- **File Dibuat/Dimodifikasi:** `src/layouts/AdminLayout.tsx`, `src/pages/admin/AdminDashboard.tsx`, `src/pages/admin/GymManager.tsx`, `src/pages/admin/Transactions.tsx`, `src/hooks/api/useAdminAPI.ts`.
- **Mock Data & State Status:** Terpasang *custom hooks* `useAdminAPI.ts` yang diorkestrasi menggunakan *TanStack Query v5*. Data tabel menggunakan simulasi *mock promises*.
- **Catatan Integrasi Backend:** Form manajemen Gym siap untuk ditautkan dengan endpoint `GET/POST/PUT /api/gyms` pada saat *backend* stabil.

## [2026-08-27] - Phase 3: Mitra Dashboard & PIN Validation
- **Fitur Selesai:** Implementasi antarmuka operasional resepsionis. Pembuatan komponen `PinInput.tsx` bergaya OTP besar dengan fitur *auto-tabbing*. Pembuatan halaman `MitraDashboard` untuk terminal entri PIN dan `MitraHistory` untuk memantau status pembayaran *settlement* check-in (Tabel Filterable). Penyesuaian navigasi *dummy* (menu *Coming Soon* dengan *disabled UX*).
- **File Dibuat/Dimodifikasi:** `src/layouts/MitraLayout.tsx`, `src/components/forms/PinInput.tsx`, `src/pages/mitra/MitraDashboard.tsx`, `src/pages/mitra/MitraHistory.tsx`, `src/hooks/api/useMitraAPI.ts`.
- **Mock Data & State Status:** Membangun *mock mutation* `useValidatePin` yang merekayasa latensi jaringan nyata, memberikan respons sukses/gagal langsung ke UI.
- **Catatan Integrasi Backend:** Siap mengonsumsi API `POST /api/transactions/validate`.

## [2026-08-27] - Phase 4: Zero-Trust Security, Global Toast & CI/CD Finalization
- **Fitur Selesai:** 
  - Penegakan **Zero-Trust Routing** di `ProtectedLayout` (pengalihan otomatis *role* dengan pesan peringatan).
  - Modifikasi total `ToastContainer.tsx` agar mematuhi standar *Dark Theme* (Latar *Zinc-900*, teks putih, bingkai garis tepi kiri/berwarna).
  - Perbaikan alur navigasi dari halaman `Login` dan `Register` agar pintar membaca *Role* yang masuk (smart redirect).
  - Konfigurasi GitHub Actions (`frontend.yml`) yang mengenali struktur *monorepo*, melakukan *linting* dan tes ketat *TypeScript* (`--noEmit`).
- **File Dibuat/Dimodifikasi:** `src/layouts/ProtectedLayout.tsx`, `src/components/ui/ToastContainer.tsx`, `src/store/toastStore.ts`, `.github/workflows/frontend.yml`, `backend/database/seeders/DatabaseSeeder.php`.
- **Mock Data & State Status:** Mock login sepenuhnya DIHAPUS. Sistem terhubung ke aplikasi Laravel 12 lokal menggunakan PHP 8.4 yang baru diinstal, dengan dukungan basis data PostgreSQL asli.
- **Catatan Integrasi Backend:** Sistem Frontend sudah sepenuhnya ditautkan dan dieksekusi bersama API Live Backend. Pengguna *Admin*, *Mitra*, dan *User* default (*seeded*) berhasil diotorisasi lewat basis data lokal.
