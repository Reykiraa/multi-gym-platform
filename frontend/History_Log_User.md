## [2026-08-26] - Phase 1: Setup Infrastruktur & Component Library FE User
- **Fitur Selesai:** Setup App Shell Layout (Mobile-first wrapper) dan Reusable UI Components (`Button`, `Input`, `Card`, `Badge`, `Skeleton`, `ConfirmModal`).
- **File Dibuat/Dimodifikasi:** `src/App.tsx`, `src/components/ui/*.tsx`, `src/components/modals/ConfirmModal.tsx`
- **Mock Data & State Status:** N/A (Fase pondasi UI).
- **Catatan Integrasi Backend:** N/A.

## [2026-08-26] - Phase 2: Gym Discovery
- **Fitur Selesai:** Tipe data TypeScript, Top Navbar (dengan badge saldo), Komponen GymCard, Halaman Katalog GymDiscovery (dengan fitur pencarian lokal client-side), serta setup routing dan provider query global.
- **File Dibuat/Dimodifikasi:** `src/types/index.ts`, `src/components/shared/Navbar.tsx`, `src/components/cards/GymCard.tsx`, `src/pages/user/GymDiscovery.tsx`, `src/App.tsx`, `package.json`.
- **Mock Data & State Status:** Terpasang mock data via TanStack Query untuk User (`id: 1`, saldo `50`) dan daftar Gym (3 dummy data). Filter menggunakan derived state lokal.
- **Catatan Integrasi Backend:** Persiapan koneksi ke endpoint `GET /api/user` dan `GET /api/gyms`.

## [2026-08-26] - Phase 3 & Layout Revision: Core Transaksi & Check-in System
- **Fitur Selesai:** Halaman GymDetail, Modal CheckInConfirmModal, UI PinDisplay (Statis), Refactoring Responsif Desktop & Mobile (Global App Shell & Navbar).
- **File Dibuat/Dimodifikasi:** `src/types/index.ts`, `src/pages/user/GymDetail.tsx`, `src/components/modals/CheckInConfirmModal.tsx`, `src/components/ui/PinDisplay.tsx`, `src/App.tsx`, dan perbaikan pada file Fase 1 & 2.
- **Mock Data & State Status:** Menggunakan `useMutation` (TanStack Query) untuk simulasi `POST /api/transactions/checkin` dan merender state transaksi (PIN `8492`).
- **Catatan Integrasi Backend:** Endpoint mutasi Check-in siap dihubungkan dengan API asli, mengembalikan data transaksi lengkap dengan `expires_at`.

## [2026-08-26] - Phase 4: Timer PIN, Wallet History, & Profile (Final MVP Scope)
- **Fitur Selesai:** 
  - Logika hitung mundur (*Countdown Timer*) pada `PinDisplay`.
  - Halaman `WalletHistory` (Responsif desktop split-layout) dengan restriksi fitur Payment Gateway (Out-of-Scope PRD).
  - Halaman `Profile` (Focused view desktop) dengan UI statis riwayat keanggotaan dan tombol navigasi manajemen akun.
- **File Dibuat/Dimodifikasi:** `src/types/index.ts`, `src/components/ui/PinDisplay.tsx`, `src/pages/user/WalletHistory.tsx`, `src/pages/user/Profile.tsx`, `src/App.tsx`, `src/components/shared/Navbar.tsx`.
- **Mock Data & State Status:** Integrasi waktu lokal klien untuk Timer PIN. Fitur *Top-Up* dimatikan sementara dengan `window.alert`. Tombol *Logout* menggunakan manipulasi routing statis.
- **Catatan Integrasi Backend:** Halaman riwayat transaksi siap disambungkan dengan `GET /api/transactions`.

## [2026-08-26] - Phase 5 (Ekstra): Auth Flow & Profile Expansion
- **Fitur Selesai:** 
  - Halaman Publik (Landing Page) sebagai etalase aplikasi.
  - Halaman Autentikasi (`Login` dan `Register`) dengan *mock routing*.
  - Ekspansi halaman Profile (Edit Profile, Payment Methods, Security, Notifications) menggunakan pola navigasi PWA (*stack navigation* dengan tombol *back*).
  - Merapikan struktur rute keseluruhan di `App.tsx` (termasuk rute *fallback*).
- **File Dibuat/Dimodifikasi:** `src/pages/guest/LandingPage.tsx`, `src/pages/auth/Login.tsx`, `src/pages/auth/Register.tsx`, `src/pages/user/profile/*.tsx`, `src/App.tsx`.
- **Mock Data & State Status:** *Form submit* pada *Login* dan *Register* menggunakan *hardcoded redirect* ke `/user/discovery`. *State Management* dan perlindungan rute diserahkan ke tim FE Core.
- **Catatan Integrasi Backend:** Halaman Login dan Register siap dipasangkan dengan endpoint `POST /api/auth/login` dan `POST /api/auth/register` oleh tim FE 2.

## [2026-08-26] - Phase 5.1 (Bonus): Profile Functionalization & Global State
- **Fitur Selesai:** 
  - Fungsionalisasi form Edit Profile dan Security (Ubah Password) dengan validasi *real-time*.
  - UI Interaktif pada Payment Methods (tambah/hapus kartu) dan Notifications (toggle on/off).
  - Sinkronisasi data nama/email secara global antara halaman Profile dan Navbar.
- **File Dibuat/Dimodifikasi:** `src/store/authStore.ts`, `src/pages/user/Profile.tsx`, `src/components/shared/Navbar.tsx`, `src/pages/user/profile/EditProfile.tsx`, `src/pages/user/profile/Security.tsx`, `src/pages/user/profile/PaymentMethods.tsx`.
- **Mock Data & State Status:** Migrasi manajemen *mock data auth* dari statis menjadi reaktif menggunakan Zustand. Validasi form menggunakan React Hook Form (RHF) dan Zod.
- **Catatan Integrasi Backend:** Form submission saat ini hanya memanipulasi *client state*. Siap disambungkan dengan endpoint `PUT /api/user` (jika ada) oleh tim backend nantinya.