# DESIGN & UI ARCHITECTURE
**Target Agent:** Frontend Developer (Stitch)
**Framework:** React (Vite) + Tailwind CSS + TanStack Router
**App Concept:** Multi-Gym Access Platform (Mobile-First Dashboard)

## 1. DESIGN SYSTEM & TAILWIND TOKENS
Berdasarkan referensi desain UI Gym, aplikasi ini akan menggunakan pendekatan **Dark Mode** secara default untuk memberikan kesan premium, maskulin, dan sporty. Gunakan utility class bawaan Tailwind CSS.

*   **Background (Canvas):** Sangat gelap/Hitam (`bg-zinc-950` atau `bg-black`).
*   **Warna Permukaan (Cards/Modals):** Abu-abu gelap (`bg-zinc-900` dengan border tipis `border-zinc-800`).
*   **Warna Teks:** 
    *   Utama: Putih (`text-white` atau `text-zinc-100`).
    *   Sekunder/Deskripsi: Abu-abu terang (`text-zinc-400`).
*   **Warna Aksen (Accent):** Kuning Gold (`bg-yellow-500` atau `bg-amber-500`, teks `text-yellow-500`) untuk tombol aksi utama, badge, dan highlight harga. Ini menggantikan warna neon/hijau pada referensi.
*   **Warna Peringatan (Warning/Error):** Merah (`bg-rose-500`) untuk peringatan potong saldo berlebih atau error jaringan.
*   **Tipografi:** Sans-serif bawaan Tailwind (`font-sans`). Gunakan font-weight `bold` atau `extrabold` untuk headline dan harga kredit agar menonjol.
*   **Rounded Corners:** Gunakan sudut yang sedikit kaku atau melengkung halus (`rounded-lg` atau `rounded-xl`) untuk mempertahankan kesan maskulin dan modern.

## 2. ROUTING MAP (SPA SITEMAP)
Setup TanStack Router dengan struktur rute berikut:

*   `/` (Guest Layout)
    *   `/login` - Halaman Login
    *   `/register` - Halaman Register
*   `/user` (Protected: User Layout - Terdapat Top Nav/Header menampilkan Saldo)
    *   `/user/discovery` - Katalog Gym (Homepage user)
    *   `/user/gym/$gymId` - Detail Gym & Tombol Check-in
    *   `/user/wallet` - Histori Transaksi
*   `/mitra` (Protected: Mitra Layout - Terdapat Sidebar/Top Nav)
    *   `/mitra/dashboard` - Form input validasi PIN & histori validasi hari ini
*   `/admin` (Protected: Admin Layout - Terdapat Sidebar)
    *   `/admin/gyms` - Tabel data Mitra Gym (CRUD)

## 3. COMPONENT ARCHITECTURE
Pecah UI menjadi komponen modular di dalam folder `src/components/`:

*   **UI Elements (`/ui`):**
    *   `Button.tsx` (Prop: `variant="primary" (Kuning Gold) | "outline" (Border Kuning Gold) | "danger"`, `isLoading`)
    *   `Input.tsx` (Dark input box: `bg-zinc-800 text-white border-zinc-700 focus:border-yellow-500`)
    *   `Card.tsx` (Bungkus standar dengan `bg-zinc-900 border border-zinc-800 rounded-xl`)
    *   `Badge.tsx` (Untuk menampilkan status, misal: `bg-yellow-500/10 text-yellow-500`)
*   **Modals (`/modals`):**
    *   `ConfirmModal.tsx` (Latar belakang overlay gelap `bg-black/80`, Card modal `bg-zinc-900`)
*   **Shared (`/shared`):**
    *   `Navbar.tsx` (Background transparan atau `bg-zinc-950/80` dengan efek blur/backdrop-filter)
    *   `PinDisplay.tsx` (Teks ukuran super besar misal `text-6xl font-mono tracking-widest text-yellow-500`)

## 4. WIREFRAME & LAYOUT FLOW (TEXT-BASED)

### A. User: Gym Discovery (`/user/discovery`)
*   **Top Nav:** Logo di kiri (teks putih dengan aksen Gold), "Saldo: 50" di kanan (dalam bentuk pill/badge Gold).
*   **Header Area:** Headline besar "STAY FIT, ANYWHERE." (Huruf kapital tebal). Di bawahnya terdapat Input Search Bar (Dark style).
*   **Content:** Grid berisi `GymCard`.
*   **GymCard:** Gambar gym gelap/grayscale bergradasi di atasnya. Menampilkan nama Gym (Putih), lokasi (Abu-abu), Badge fasilitas, dan harga kredit (Teks Kuning Gold tebal). Tombol panah/aksen kecil berwarna Kuning Gold.

### B. User: Gym Detail & Check-in (`/user/gym/$gymId`)
*   **Content:** Foto gym lebar (*hero image*) dengan gradien hitam ke bawah. Informasi detail menggunakan teks putih dan abu-abu.
*   **Sticky Bottom Action:** Di bagian paling bawah layar, membentang tombol aksi penuh (Full-width) berwarna Kuning Gold (`bg-yellow-500 text-black font-bold`): "CHECK-IN (5 KREDIT)".
*   **Post-Action (PIN Display):** Setelah konfirmasi modal, layar menampilkan angka PIN berukuran raksasa berwarna Kuning Gold bercahaya (menggunakan drop-shadow/glow kuning) di tengah layar gelap.

### C. Mitra: Validasi PIN (`/mitra/dashboard`)
*   **Layout:** Dashboard yang bersih dan gelap (`bg-zinc-950`).
*   **Main Area:**
    *   Satu `Card` utama di tengah (`bg-zinc-900`).
    *   Input Text berukuran raksasa dengan *border* kuning saat aktif.
    *   Tombol "VALIDASI PIN" besar berwarna Kuning Gold.
    *   Tabel riwayat kunjungan hari ini di bagian bawah dengan baris tabel bergaris tipis (`border-zinc-800`).

### D. Admin: Gym Management (`/admin/gyms`)
*   **Sidebar:** Navigasi vertikal gelap dengan *active state* teks Kuning Gold dan garis vertikal penanda di sisi kiri.
*   **Main Area:** Tabel data gym (Dark Mode table). Tombol utama "TAMBAH GYM" di pojok kanan atas (Warna Kuning Gold).
