## [2026-09-01] - Phase: Midtrans Database Setup & Cleanup
- **Fitur Selesai:** Pembuatan skema database Midtrans Top-up, Seeder paket kredit (1 Credit = Rp 1.000), dan pembersihan controller admin top-up manual lama.
- **File Dibuat/Dimodifikasi:** 
  - `database/migrations/*_create_topup_packages_table.php`
  - `database/migrations/*_create_topup_transactions_table.php`
  - `app/Models/TopupPackage.php`
  - `app/Models/TopupTransaction.php`
  - `database/seeders/TopupPackageSeeder.php`
  - `config/services.php`
  - `routes/api.php`
  - `app/Http/Controllers/WalletController.php` (Dihapus)
- **Keputusan Arsitektur & Keamanan:** Menggunakan UUID untuk `topup_transactions` dan indexing pada `order_id`. Menghapus total manual top-up demi kepatuhan audit transaksi payment gateway.

## [2026-09-01] - Phase: Midtrans Snap Integration & ACID Webhook
- **Fitur Selesai:** Integrasi Payment Gateway Midtrans (Snap Token Engine & Webhook Callback Handler), penghapusan total fitur manual top-up admin.
- **File Dibuat/Dimodifikasi:** 
  - `app/Services/MidtransService.php`
  - `app/Http/Controllers/TopupController.php`
  - `routes/api.php`
- **Keputusan Arsitektur & Keamanan:** 
  - Validasi SHA512 signature key pada webhook callback.
  - ACID Compliance menggunakan `DB::transaction()` dan Pessimistic Locking (`lockForUpdate()`) pada tabel `topup_transactions` dan `users` untuk mencegah exploitasi double-credit saat webhook diterima bersamaan.
  - Idempotency guard memastikan request webhook duplikat diabaikan dengan aman.
- **Catatan Integrasi Frontend:**
  - `GET /api/topup-packages` (Public/Auth): Menampilkan daftar paket aktif.
  - `POST /api/topups` (Auth Sanctum): Mengirim payload `{"topup_package_id": "UUID"}` -> Mengembalikan `{"snap_token": "..."}` untuk diproses oleh Snap JS di React.

## [2026-09-01] - Feature: Frontend Midtrans Top-Up Modal & Snap Integration
- **Fitur Selesai:** Tampilan UI Modal Beli Kredit (TopupModal), Custom Hook useTopup, dan Injeksi Midtrans Snap SDK.
- **File Dibuat/Dimodifikasi:** 
  - `src/types/index.ts`
  - `index.html`
  - `src/hooks/api/useTopup.ts`
  - `src/components/modals/TopupModal.tsx`
- **Keputusan Arsitektur & Keamanan:** Injeksi Snap SDK secara dinamis, penanganan callback Snap (Success, Pending, Error, Close), dan invalidasi cache otomatis pada TanStack Query untuk sinkronisasi saldo kredit secara instan.

## [2026-09-01] - Phase: End-to-End Midtrans Integration, Unified Ledger & State Fixation
- **Fitur Selesai:** 
  - Integrasi lengkap Payment Gateway Midtrans (Snap Token Engine, Webhook, dan Instant Server-to-Server Verification).
  - Penghapusan total fitur manual top-up admin lama.
  - Unified Transaction Ledger pada `GET /api/transactions` (menggabungkan riwayat check-in gym dan top-up saldo secara kronologis).
  - Tampilan UI Dompet (`WalletHistory.tsx`) dan Modal Pembelian Kredit (`TopupModal.tsx`).
  - Sinkronisasi global saldo user (Zustand `authStore` + React Query) ke Navbar & Card Dompet.
  - Eliminasi bug *Cache Collision* pada React Query dan optimasi performa query database (<15ms).
- **File Dibuat/Dimodifikasi:**
  - **Backend:**
    - `app/Services/MidtransService.php`
    - `app/Http/Controllers/TopupController.php`
    - `app/Http/Controllers/TransactionController.php`
    - `routes/api.php`
    - `database/migrations/*_create_topup_packages_table.php`
    - `database/migrations/*_create_topup_transactions_table.php`
    - `database/seeders/TopupPackageSeeder.php`
  - **Frontend:**
    - `src/types/index.ts`
    - `src/store/authStore.ts`
    - `src/hooks/api/useTopup.ts`
    - `src/components/modals/TopupModal.tsx`
    - `src/pages/user/WalletHistory.tsx`
- **Keputusan Arsitektur & Keamanan:**
  - **ACID Ledger Compliance:** Seluruh mutasi `credit_balance` dibungkus dalam `DB::transaction()` dengan Pessimistic Locking (`lockForUpdate()`).
  - **Dual Verification & Idempotency:** Verifikasi langsung ke Midtrans API v2 saat pop-up Snap selesai, kebal terhadap *race condition* dan *double-credit injection*.
  - **Non-blocking Read Operations:** Endpoint `TransactionController@index` murni membaca database lokal tanpa hambatan HTTP eksternal untuk menjamin loading data instan.
  - **Cache Key Isolation:** Mengisolasi `queryKey: ["transactions", "history"]` dari query check-in aktif `["transactions", "active"]` untuk mencegah tabrakan tipe data di browser.