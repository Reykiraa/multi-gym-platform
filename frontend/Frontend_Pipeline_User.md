# TASK BRIEF: FRONTEND 1 (USER / MEMBER EXPERIENCE)
**Role:** Frontend Developer 1 (Agent/Human)
**Working Directory:** `/frontend`
**Branching:** `feat/fe-user-*`
**Tech Stack:** React (Vite), Tailwind CSS, TanStack Query, Zustand.

## 1. Tujuan Utama
Membangun antarmuka untuk target pengguna utama (Busy Professionals) agar dapat mencari gym, melihat detail, dan melakukan check-in dengan mulus.

## 2. To-Do List & Pipeline Kerja

### Fase 1: Setup Komponen UI (Hari 1-3)
- [ ] Tunggu/koordinasi dengan FE 2 yang melakukan inisialisasi project Vite.
- [ ] Buat komponen reusable UI: `Button`, `Card`, `Modal`, `Badge` menggunakan Tailwind CSS.
- [ ] Buat UI Skeleton/Loading state.

### Fase 2: Gym Discovery (Hari 4-6)
- [ ] Buat Halaman `GymDiscovery.tsx` (Katalog Gym).
- [ ] Integrasikan `GET /api/gyms` menggunakan TanStack Query (gunakan mock data dari Backend jika API belum live).
- [ ] Buat fitur filter/search sederhana berdasarkan nama atau lokasi.

### Fase 3: Check-in & PIN Generation (Hari 7-9)
- [ ] Buat Halaman `GymDetail.tsx`.
- [ ] Buat komponen `CheckInConfirmModal.tsx` yang menampilkan peringatan pemotongan saldo.
- [ ] Integrasikan `POST /api/transactions/checkin`.
- [ ] Buat UI `PinDisplay.tsx` yang menampilkan PIN 4-digit dengan font besar.

### Fase 4: Timer & Dompet (Hari 10-12)
- [ ] Tambahkan logika Countdown Timer pada UI PIN (menghitung mundur hingga `expires_at`).
- [ ] Buat Halaman `WalletHistory.tsx` untuk melihat sisa saldo (`credit_balance`) dan riwayat transaksi.
- [ ] Integrasikan endpoint GET /api/transactions pada WalletHistory.tsx untuk menampilkan daftar mutasi kredit user.
- [ ] Pastikan UI responsif (Mobile-first).
