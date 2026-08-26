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