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