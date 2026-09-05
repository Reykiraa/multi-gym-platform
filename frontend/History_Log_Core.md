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

## [2026-09-05] - Phase 5: UI Refinement
- **Fitur Selesai:** 
  - Membersihkan elemen UX yang tidak relevan di `MitraLayout` (menghapus ikon *bell* notifikasi, ikon *package*, dan *dropdown* cabang gym).
  - Merapikan tabel `MitraHistory` dengan menghapus filter waktu statis ("Semua Waktu") agar lebih bersih, serta menyesuaikan *placeholder* pencarian.
  - Memperbarui tabel histori *check-in* pada `MitraDashboard` untuk menampilkan "Member Name" (nama pengguna) alih-alih kode PIN, beserta penyesuaian gaya tipografinya (menghapus format *monospace*).
- **File Dibuat/Dimodifikasi:** `src/pages/admin/AdminDashboard.tsx`, `src/layouts/MitraLayout.tsx`, `src/pages/user/Profile.tsx`, `src/pages/mitra/MitraHistory.tsx`, `src/pages/mitra/MitraDashboard.tsx`, serta beberapa komponen pendukung lainnya (seperti `GymForm`, `GymManager`, dan `WalletHistory`).
- **Mock Data & State Status:** Melakukan pembersihan kode (*clean up*) dengan menghapus *unused imports* (ikon Lucide dan `useToastStore`) demi optimasi *tree-shaking*. Terjemahan bahasa diimplementasikan langsung pada *string statis* tanpa *library* `i18n` untuk menjaga kesederhanaan *codebase* MVP.
- **Catatan Integrasi Backend:** 
  - **PENTING:** Perubahan kolom tabel Mitra mengharuskan endpoint `GET /api/transactions` untuk me-return objek *nested* pengguna (melalui proses *eager loading* seperti `$query->with('user')` di Laravel) agar properti `entry.user.name` dapat dibaca oleh Frontend. 
  - Karena filter waktu ditiadakan di sisi antarmuka, *handling* paginasi atau limitasi data kini bergantung sepenuhnya pada respons *query* API backend.

  ## [2026-09-05] - Phase 6: Advanced UX Revisions & UI Hardening
- **Fitur Selesai:** 
  - **Global Logout UX:** Mengintegrasikan pop-up konfirmasi *logout* menggunakan komponen `ConfirmModal` pada semua tingkatan peran (User di `Profile.tsx`, Mitra di `MitraLayout.tsx`, dan Admin di `AdminLayout.tsx`).
  - **Top-Up Modal Styling:** Menyesuaikan desain `TopupModal.tsx` agar 100% selaras dengan skema *Dark Theme* (menggunakan *bg-gray-900*) dan menggunakan warna aksen merek `amber-500` (menggantikan *indigo-600* bawaan).
  - **Pembersihan Navigasi:** Menghapus menu "Payment Methods" dan ikon *CreditCard* dari antarmuka halaman Profil (*User*) untuk mencegah fitur yang belum matang (*unused UI*) terekspos ke pengguna.
- **File Dibuat/Dimodifikasi:** `src/pages/user/Profile.tsx`, `src/layouts/MitraLayout.tsx`, `src/layouts/AdminLayout.tsx`, `src/components/modals/TopupModal.tsx`, dan `src/components/ui/Input.tsx` (dikerjakan pada *branch* baru `feat/fe-user-phase-7-revisi`).
- **Mock Data & State Status:** 
  - Menambahkan *local state* (misal: `isLogoutModalOpen`) untuk mengatur visibilitas modal konfirmasi tanpa mengganggu siklus *render* utama React.
  - Alur Git yang mulus: membawa pekerjaan yang belum di-*commit* (*uncommitted changes*) secara langsung ke *branch* baru `feat/fe-user-phase-7-revisi` agar pengembangan komponen form & modal bisa terisolasi dengan aman.
- **Catatan Integrasi & Backend:** 
  - **Manipulasi DB Testing:** Melakukan injeksi saldo (*credit_balance* = 100) secara langsung ke dalam PostgreSQL untuk *user* `dnsy@meldin.com` menggunakan ORM `php artisan tinker`. Perlu diingat bahwa perubahan eksternal ini mengharuskan peramban (*browser*) di-*refresh* manual agar *query fetch* dijalankan ulang (karena tidak ada integrasi *websocket*).
  - **Trade-off Routing:** Meski tombol "Payment Methods" sudah dihapus, *developer* harus memastikan *route* `/user/profile/payment` di dalam konfigurasi *router* juga ikut dihapus pada iterasi selanjutnya agar halaman tidak bisa diakses secara paksa via URL.

  ## [2026-09-05] - Phase 7: English Localization & Final Polish (Go-Live Prep)
- **Fitur Selesai:** 
  - **Global Localization (ID to EN):** Menerjemahkan 100% teks UI dari Bahasa Indonesia ke Bahasa Inggris pada seluruh arsitektur proyek (Guest, User, Mitra, dan Admin). Ini mencakup label form, placeholder, *state* kosong (*empty state*), notifikasi Toast, modal konfirmasi, hingga pesan *error* validasi skema Zod.
  - **Google OAuth Forced Locale:** Menyelesaikan masalah teks tombol otomatis "Login dengan Google" dengan menambahkan atribut `locale="en"` secara eksplisit pada komponen `@react-oauth/google` di halaman Login dan Register.
  - **Landing Page Navigation Fix:** Menambahkan tombol sekunder (Outline) "Sign In" di sebelah tombol CTA utama "Join Now" pada halaman *Landing Page* (`LandingPage.tsx`) untuk mengarahkan pengguna ke `/login`.
  - **Design System Consistency:** Mengubah seluruh kelas utilitas (*Tailwind*) pada komponen `TopupModal.tsx` dari palet `gray/amber` menjadi `zinc/yellow`, memastikan 100% keselarasan warna *branding dark theme* di semua *modal* dan halaman.
- **File Dibuat/Dimodifikasi:** 
  - Keseluruhan direktori Autentikasi (`/auth/*.tsx`).
  - Keseluruhan direktori Dasbor Mitra (`/mitra/*.tsx`) & Admin (`/admin/*.tsx` termasuk `MitraManager.tsx`).
  - Keseluruhan halaman Pengguna (`/user/*.tsx`, profil, dompet, dan penemuan Gym).
  - Seluruh komponen *Modal* (`CheckInConfirmModal.tsx`, `TopupModal.tsx`).
- **Mock Data & State Status:** Tidak ada perubahan pada arsitektur *state management* (Zustand) maupun alur basis data (API). Sistem tetap stabil tanpa *breaking changes*.
- **Catatan Keamanan (Security Check):** 
  - Otorisasi dan routing (`ProtectedLayout`, `react-router-dom`) dipastikan tidak tersentuh dan aman.
  - Seluruh kunci *payload API* dan nama *variable* tidak terpengaruh oleh proses penerjemahan (Terisolasi hanya pada *hardcoded string* UI yang di-render ke DOM).

## [2026-09-05] - Phase 8: Mobile Responsiveness & Layout Fixes
- **Fitur Selesai:** 
  - **Pin Input Scaling:** Memperbaiki ukuran kotak PIN di `PinInput.tsx` pada ukuran layar kecil (_mobile_) dari `w-16 h-20` menjadi `w-12 h-16` dengan pengurangan celah (*gap*) agar tidak saling bertumpuk dan bocor keluar layar (*overflow*).
  - **Mobile Bottom Navigation:** Menambahkan *Bottom Navigation Bar* khusus untuk layar _mobile_ pada `MitraLayout.tsx` (terdiri dari Dashboard, History, dan Profile) karena navigasi Header tersembunyi sepenuhnya pada layar kecil.
  - **Tabel Responsif:** Memastikan tabel "Recent Entries" pada `MitraDashboard.tsx` bisa di-_scroll_ secara horizontal pada layar _mobile_ dengan menyematkan utilitas `whitespace-nowrap` pada Header kolom (`th`) dan data Nama Member (`td`).
- **File Dibuat/Dimodifikasi:** `src/components/forms/PinInput.tsx`, `src/layouts/MitraLayout.tsx`, dan `src/pages/mitra/MitraDashboard.tsx`.
- **Mock Data & State Status:** Menggunakan komponen `NavLink` bawaan dari `react-router-dom` dipadukan dengan *icons* dari `lucide-react` untuk navigasi bawah, tanpa menambahkan kerumitan *state* baru.
- **Catatan Keamanan:** 
  - Desain navigasi menggunakan kontrol tampilan CSS (*hidden md:flex* dan *md:hidden*), sehingga tetap mempertahankan otorisasi rute asli dan meminimalkan rendering tambahan.