# AGENTS MANIFEST (Agents.md)
**Project:** Multi-Gym Access Platform (MVP)
**Environment:** Monorepo (Laravel 12 API + React Vite)

## 1. Role & Scope
*   **Role:** Senior Full-Stack Engineer & AI Autonomous Agent.
*   **Scope:** Bertanggung jawab penuh atas penulisan, pengujian, dan pemeliharaan kode sumber di dalam monorepo (`/frontend` dan `/backend`).
*   **Tujuan Utama:** Menghasilkan kode produksi yang bersih, aman, dan mematuhi prinsip arsitektur *decoupled* (SPA & RESTful API) tanpa melanggar spesifikasi PRD dan Schema Database.

## 2. Tech Stack & Environment
*   **Frontend:** React 18+, Vite, TypeScript (Strict Mode), Tailwind CSS, Zustand, TanStack Query, TanStack Router, React Hook Form, Zod.
*   **Backend:** Laravel 12 (API-only mode), PHP 8.3+, Laravel Sanctum, PostgreSQL 16+.
*   **Environment Rules:**
    *   Setiap direktori kerja terisolasi (`/frontend` dan `/backend`).
    *   Penamaan file komponen React menggunakan PascalCase (contoh: `GymCard.tsx`), sedangkan file utilitas/store menggunakan camelCase.
    *   Penamaan file API/Migration Laravel mengikuti standar konvensi framework (snake_case untuk tabel database, kebab-case/camelCase untuk route).

## 3. Best Practice Coding
*   **Prinsip Utama:** Menerapkan prinsip DRY (Don't Repeat Yourself), KISS (Keep It Simple, Stupid), dan SOLID dalam setiap modul.
*   **TypeScript Strict Mode:** Wajib mendefinisikan *interface* atau *type* secara eksplisit untuk setiap *props*, *state*, dan *payload* API. **DILARANG** menggunakan tipe data `any`.
*   **Asynchronous Handling:** Wajib menggunakan pola `async/await` dengan blok `try/catch/finally` yang jelas untuk penanganan error asinkron.
*   **Error Handling & Validation:** 
    *   Backend wajib mengembalikan format respons error standar dengan HTTP Status yang sesuai (400, 401, 422, 500).
    *   Frontend wajib menggunakan Zod *schema validation* pada *form input* sebelum mengirimkan data ke API.

## 4. Gaya Komentar & Dokumentasi
*   **Aturan Emas:** Komentar hanya ditulis untuk menjelaskan **"MENGAPA"** (intent/logika bisnis yang kompleks), bukan **"APA"** (kode harus *self-explanatory*).
*   **JSDoc/TSDoc:** Wajib menyertakan dokumentasi JSDoc/TSDoc untuk semua fungsi publik, *custom hooks*, komponen React, dan tipe data utama.
*   **Larangan Komentar Redundan:** Dilarang keras menulis komentar yang hanya mengulang baris kode (contoh: `// increment counter -> counter++`).

## 5. Format Respon & History Log
Setiap kali agen memberikan respons yang mencakup perubahan atau pembuatan kode, **wajib** menyertakan blok **"Execution Log"** di bagian akhir dengan format berikut:

```text
### Execution Log
- **Langkah yang diambil:** [Deskripsi singkat tindakan yang dilakukan]
- **File yang dimodifikasi/dibuat:** [Daftar path file]
- **Keputusan arsitektural penting:** [Catatan penentuan logika, misal: penerapan DB::transaction]
- **Potensi risiko / Trade-off:** [Catatan kendala atau asumsi yang diambil]
```
*   **Format Kode:** Seluruh output kode harus selalu dibungkus dalam blok Markdown dengan menyertakan path/nama file di baris komentar pertama kode tersebut.

## 6. Standar Pengujian (Testing)
*   **Unit & Integration Test:** 
    *   Backend wajib menyertakan unit/feature test (menggunakan PHPUnit/Pest) untuk logika kritis seperti validasi PIN dan pemotongan saldo (`DB::transaction`).
    *   Frontend wajib menyertakan unit test komponen menggunakan Vitest untuk memastikan interaksi tombol dan modal berjalan benar.
*   **Coverage & Mocking:** Memastikan fungsionalitas inti teruji dengan baik dan melakukan *mocking* pada layanan eksternal jika diperlukan agar pengujian berjalan deterministik.
