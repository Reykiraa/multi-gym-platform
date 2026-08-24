# API CONTRACT: BACKEND (MASTER)
**Base URL:** `http://localhost:8000/api`
**Format:** `application/json`
**Auth:** Bearer Token (Sanctum)

Dokumen ini adalah referensi utama untuk Backend Developer dalam membangun RESTful API.

## 1. AUTHENTICATION MODULE

### 1.1. Register
* **Endpoint:** `POST /auth/register`
* **Access:** Public
* **Request Body:**
  ```json
  {
    "name": "Budi",
    "email": "budi@email.com",
    "password": "password123",
    "role": "user" // 'admin', 'mitra', 'user'
  }
  ```
* **Response (201 Created):**
  ```json
  {
    "message": "User registered successfully",
    "token": "1|laravel_sanctum_token_string",
    "user": { "id": 1, "name": "Budi", "role": "user", "credit_balance": 0 }
  }
  ```

### 1.2. Login
* **Endpoint:** `POST /auth/login`
* **Access:** Public
* **Request Body:**
  ```json
  {
    "email": "budi@email.com",
    "password": "password123"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "token": "2|laravel_sanctum_token_string",
    "user": { "id": 1, "name": "Budi", "role": "user", "credit_balance": 0 }
  }
  ```

### 1.3. Get Current User
* **Endpoint:** `GET /user`
* **Access:** Protected (All Roles)
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

## 2. GYM MANAGEMENT MODULE

### 2.1. Get All Gyms
* **Endpoint:** `GET /gyms`
* **Access:** Protected (User / Admin)
* **Response (200 OK):**
  ```json
  [
    {
      "id": 1,
      "mitra_id": 2,
      "name": "Gym Majapahit",
      "location": "Jakarta Pusat",
      "facilities": ["Cardio", "Pool"],
      "credit_price": 5
    }
  ]
  ```

### 2.2. Create Gym (Admin Only)
* **Endpoint:** `POST /gyms`
* **Access:** Protected (Admin)
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
* **Response (201 Created):** Mengembalikan data gym yang baru dibuat.

### 2.3. Update & Delete Gym (Admin Only)
* **Endpoints:** `PUT /gyms/{id}` & `DELETE /gyms/{id}`
* **Access:** Protected (Admin)

## 3. TRANSACTION & CHECK-IN MODULE

### 3.1. Create Check-in (User)
* **Endpoint:** `POST /transactions/checkin`
* **Access:** Protected (User)
* **Request Body:**
  ```json
  {
    "gym_id": 1
  }
  ```
* **Response (201 Created):**
  ```json
  {
    "message": "Check-in pending",
    "transaction": {
      "id": 101,
      "gym_id": 1,
      "amount": 5,
      "pin_code": "4829",
      "status": "pending",
      "expires_at": "2026-08-24T14:00:00Z"
    }
  }
  ```
* **Error (400 Bad Request):** Jika saldo tidak cukup.

### 3.2. Validate PIN (Mitra)
* **Endpoint:** `POST /transactions/validate`
* **Access:** Protected (Mitra)
* **Request Body:**
  ```json
  {
    "pin_code": "4829"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "message": "Validation successful, credit deducted.",
    "transaction": {
      "id": 101,
      "status": "completed"
    }
  }
  ```
* **Error (400 Bad Request):** Jika PIN salah atau sudah `expired`.
