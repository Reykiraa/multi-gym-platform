# TECHNICAL SKILLS & REUSABLE WORKFLOWS (Skills.md)
**Project:** Multi-Gym Access Platform (MVP)

Dokumen ini berisi kumpulan prosedur standar (*Standard Operating Procedures*) modular yang dapat digunakan kembali oleh agen AI untuk menangani tugas-tugas pengembangan berulang.

---

## SKILL 1: `setup-feature`
*   **Deskripsi & Kapan Dipicu:** Digunakan ketika agen diminta membangun fitur baru yang melibatkan perubahan dari Database hingga Frontend.
*   **Input Required:** Spesifikasi fitur, tabel database yang terlibat, dan endpoint API terkait.
*   **Langkah Prosedural (Step-by-Step):**
    1.  Buat atau perbarui *Database Migration* di `/backend/database/migrations`.
    2.  Buat *Model* dan *Controller* Laravel 12, pastikan logika bisnis dibungkus dalam `DB::transaction()` jika melibatkan mutasi data finansial/kredit.
    3.  Daftarkan *endpoint* baru di `/backend/routes/api.php`.
    4.  Definisikan *TypeScript interface* di sisi Frontend (`/frontend/src/types/`).
    5.  Buat *API Service / TanStack Query hook* untuk mengambil atau mengirim data ke endpoint tersebut.
    6.  Buat komponen UI React menggunakan Tailwind CSS dengan skema warna Dark Mode & Gold Accents.
    7.  Tulis unit test untuk memvalidasi fitur.
*   **Output Format:** Kode sumber lengkap per file disertai instruksi migrasi/uji coba.
*   **Validasi & Cek:** Pastikan migrasi berjalan tanpa error, endpoint merespons dengan format JSON yang benar, dan UI merender data dengan baik.

---

## SKILL 2: `refactor-component`
*   **Deskripsi & Kapan Dipicu:** Dipicu saat melakukan pembersihan kode, memecah komponen yang terlalu besar (*monolithic component*), atau meningkatkan performa.
*   **Input Required:** Path file komponen yang akan direfaktor dan target perbaikan (misal: memisahkan logika dari UI).
*   **Langkah Prosedural (Step-by-Step):**
    1.  Analisis ketergantungan (*dependencies*) dan *props* pada komponen lama.
    2.  Pecah bagian UI menjadi komponen modular kecil di dalam folder `src/components/`.
    3.  Pindahkan logika pengambilan data atau *state management* ke *custom hook* atau Zustand store jika diperlukan.
    4.  Pastikan tipe data TypeScript tetap ketat tanpa menggunakan `any`.
    5.  Verifikasi bahwa tidak ada fungsionalitas yang rusak (*regression check*).
*   **Output Format:** Kode refaktor yang bersih dan terdokumentasi dengan TSDoc.
*   **Validasi & Cek:** Jalankan linter (`npm run lint`) dan pastikan tidak ada *warning* atau *error* TypeScript.

---

## SKILL 3: `debug-error`
*   **Deskripsi & Kapan Dipicu:** Dipicu saat menerima laporan *bug*, *error stack trace*, atau kegagalan pengujian (*test failure*).
*   **Input Required:** Pesan *error*, log server/browser, dan file relevan yang bermasalah.
*   **Langkah Prosedural (Step-by-Step):**
    1.  Identifikasi akar masalah (*root cause*) dari *stack trace* atau pesan error.
    2.  Lacak file dan baris kode spesifik yang memicu error.
    3.  Evaluasi dampak perbaikan terhadap modul lain dalam arsitektur monorepo.
    4.  Terapkan perbaikan kode secara presisi.
    5.  Tambahkan atau perbarui *test case* untuk mencegah regresi bug serupa di masa mendatang.
*   **Output Format:** Penjelasan singkat akar masalah dan cuplikan kode hasil perbaikan.
*   **Validasi & Cek:** Jalankan ulang pengujian otomatis untuk memastikan error teratasi sepenuhnya.

---

## SKILL 4: `write-test`
*   **Deskripsi & Kapan Dipicu:** Dipicu ketika sebuah modul, fungsi, atau endpoint baru selesai dibuat dan memerlukan cakupan pengujian (*test coverage*).
*   **Input Required:** File kode sumber yang akan diuji dan spesifikasi perilaku yang diharapkan.
*   **Langkah Prosedural (Step-by-Step):**
    1.  Tentukan jenis pengujian (Unit Test dengan Vitest untuk frontend, Feature Test dengan Pest/PHPUnit untuk backend).
    2.  Buat skenario pengujian yang mencakup *Happy Path* (alur normal) dan *Edge Cases* (kondisi batas/error, misal: saldo tidak cukup, PIN kedaluwarsa).
    3.  Tulis kode *test* dengan penamaan fungsi yang deskriptif.
    4.  Jalankan perintah pengujian lokal.
*   **Output Format:** File skrip pengujian baru.
*   **Validasi & Cek:** Pastikan seluruh skenario pengujian memberikan hasil *passed* (hijau).

---

## SKILL 5: `security-review`
*   **Deskripsi & Kapan Dipicu:** Dilakukan sebelum melakukan *merge code* ke *branch* utama atau persiapan rilis MVP.
*   **Input Required:** Daftar perubahan kode (*diff*) atau seluruh modul yang akan diaudit.
*   **Langkah Prosedural (Step-by-Step):**
    1.  Periksa potensi kerentanan otentikasi (pastikan endpoint sensitif dilindungi middleware Sanctum dan validasi *role*).
    2.  Pastikan tidak ada eksposur data rahasia (*hardcoded secrets*, *API keys*, *credentials* di dalam kode).
    3.  Periksa validasi input sisi server dan klien untuk mencegah celah *SQL Injection* atau *Mass Assignment* (gunakan `$fillable` atau `validated()` di Laravel).
    4.  Validasi konsistensi status transaksi untuk menghindari eksploitasi *double-spend* pada sistem kredit.
*   **Output Format:** Laporan audit keamanan singkat dan rekomendasi perbaikan jika ditemukan celah.
*   **Validasi & Cek:** Semua poin dalam checklist terpenuhi dan bersih dari celah keamanan tingkat kritis/menengah.
