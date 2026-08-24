# API CONTRACT: FRONTEND 2 (CORE, ADMIN, & MITRA)
**Base URL:** `VITE_API_BASE_URL/api`
**Auth Header:** `Authorization: Bearer <token>`

Dokumen ini berisi daftar endpoint untuk Autentikasi, Dashboard Admin (CRUD), dan Dashboard Mitra.

## 1. AUTHENTICATION MODULE (Public)

### 1.1. Login
* **Endpoint:** `POST /auth/login`
* **Request Body:**
  ```json
  {
    "email": "mitra@email.com",
    "password": "password123"
  }
  ```
* **Response (200 OK):**
  Simpan `token` ke Zustand/Cookie, lalu redirect berdasarkan `user.role`.
  ```json
  {
    "token": "2|laravel_sanctum_token...",
    "user": { "id": 2, "role": "mitra", "name": "Pemilik Gym" }
  }
  ```

## 2. ADMIN MODULE (Role: Admin)

### 2.1. Create Gym Partner
* **Endpoint:** `POST /gyms`
* **Request Body:**
  ```json
  {
    "mitra_id": 2,
    "name": "Studio Beta",
    "location": "Jakarta Selatan",
    "facilities": ["Yoga", "Pilates"],
    "credit_price": 8
  }
  ```
* **Response (201 Created):** Trigger refresh data tabel gym (TanStack Query invalidate).

*(Tersedia juga `PUT /gyms/{id}` dan `DELETE /gyms/{id}` dengan format standar)*

## 3. MITRA MODULE (Role: Mitra)

### 3.1. Validate PIN
Digunakan oleh resepsionis untuk memvalidasi kode dari User.
* **Endpoint:** `POST /transactions/validate`
* **Request Body:**
  ```json
  {
    "pin_code": "4829"
  }
  ```
* **Response (200 OK):**
  Tampilkan Toast "Check-in Berhasil, Saldo User Terpotong".
  ```json
  {
    "message": "Validation successful, credit deducted.",
    "transaction": {
      "id": 101,
      "status": "completed"
    }
  }
  ```
* **Error Handling (400 Bad Request):**
  Tampilkan Toast Error: "PIN salah atau sudah kedaluwarsa".
