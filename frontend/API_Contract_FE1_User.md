# API CONTRACT: FRONTEND 1 (USER / MEMBER)
**Base URL:** `VITE_API_BASE_URL/api`
**Auth Header:** `Authorization: Bearer <token>`

Dokumen ini berisi daftar endpoint yang dibutuhkan untuk membangun alur kerja User (Pencarian Gym dan Check-in).

## 1. Get User Data & Wallet Balance
Digunakan untuk menampilkan sisa saldo kredit di halaman Profil/Wallet.
* **Endpoint:** `GET /user`
* **Response (200 OK):**
  ```json
  {
    "id": 1,
    "name": "Budi",
    "email": "budi@email.com",
    "role": "user",
    "credit_balance": 50
  }
  ```

## 2. Gym Discovery (Katalog Gym)
Digunakan untuk menampilkan daftar gym yang bisa diakses beserta harga kreditnya.
* **Endpoint:** `GET /gyms`
* **Response (200 OK):**
  ```json
  [
    {
      "id": 1,
      "name": "Gym Majapahit",
      "location": "Jakarta Pusat",
      "facilities": ["Cardio", "Pool"],
      "credit_price": 5
    }
  ]
  ```

## 3. Generate Check-in PIN
Digunakan saat user menekan tombol "Check-in" di Halaman Detail Gym.
* **Endpoint:** `POST /transactions/checkin`
* **Request Body:**
  ```json
  {
    "gym_id": 1
  }
  ```
* **Response (201 Created):**
  Tampilkan `pin_code` secara mencolok dan jalankan countdown timer hingga `expires_at`.
  ```json
  {
    "message": "Check-in pending",
    "transaction": {
      "id": 101,
      "amount": 5,
      "pin_code": "4829",
      "status": "pending",
      "expires_at": "2026-08-24T14:00:00Z"
    }
  }
  ```
* **Error Handling (400 Bad Request):**
  Munculkan alert/toast jika response mengembalikan pesan "Saldo kredit tidak mencukupi".
