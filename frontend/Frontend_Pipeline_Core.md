# TASK BRIEF: FRONTEND 2 (CORE, ADMIN, & MITRA EXPERIENCE)
**Role:** Frontend Developer 2 (Agent/Human)
**Working Directory:** `/frontend`
**Branching:** `feat/fe-core-*`
**Tech Stack:** React (Vite), Tailwind CSS, TanStack Router, Zustand, React Hook Form.

## 1. Tujuan Utama
Bertanggung jawab atas arsitektur dasar frontend (routing, state management), sistem autentikasi, serta dashboard untuk operasional Admin dan Mitra Gym.

## 2. To-Do List & Pipeline Kerja

### Fase 1: Core Architecture & Auth (Hari 1-3)
- [x] Inisialisasi project React + Vite di folder `/frontend`.
- [x] Setup Tailwind CSS dan konfigurasi linting (ESLint/Prettier).
- [x] Setup routing menggunakan TanStack Router. Buat layout terpisah untuk Guest, Admin, Mitra, dan User.
- [x] Setup `authStore.ts` menggunakan Zustand untuk menyimpan Token dan Data User.
- [x] Buat halaman `Login.tsx` dan `Register.tsx` (gunakan React Hook Form + Zod).
- [x] Integrasikan endpoint `POST /api/auth/login`.

### Fase 2: Admin Dashboard (Hari 4-6)
- [x] Buat Halaman `AdminDashboard.tsx`.
- [x] Buat tabel CRUD untuk manajemen Mitra Gym.
- [x] Integrasikan form tambah/edit Gym dengan endpoint `POST/PUT /api/gyms`.

### Fase 3: Mitra Dashboard & Validasi (Hari 7-9)
- [x] Buat Halaman `MitraDashboard.tsx`.
- [x] Buat komponen form input PIN yang besar dan mudah diketik oleh resepsionis.
- [x] Integrasikan endpoint `POST /api/transactions/validate`.

### Fase 4: Notifikasi & Finalisasi (Hari 10-12)
- [x] Tambahkan sistem Global Toast Notification (Sukses, Gagal, Error Jaringan).
- [x] Pastikan Protected Routes berfungsi (User tidak bisa akses halaman Admin, dsb).
- [x] Setup GitHub Actions `frontend.yml` untuk auto-build dan testing.
