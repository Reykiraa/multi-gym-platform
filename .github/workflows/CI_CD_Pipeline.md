# CI/CD PIPELINE & MONOREPO WORKFLOW
**Project:** Multi-Gym Access Platform (MVP)
**Architecture:** Monorepo (React/Vite Frontend + Laravel 11 Backend)

Dokumen ini memandu struktur repositori, konfigurasi *pipeline* CI/CD (GitHub Actions), dan alur kerja (*Git Flow*) yang dirancang khusus untuk tim yang terdiri dari 2 Frontend Developer dan 1 Backend Developer agar dapat bergerak cepat dan terisolasi dalam satu repositori yang sama.

---

## 1. Struktur Direktori Monorepo

Repositori utama akan dibagi menjadi dua direktori root untuk mengisolasi *environment* kerja.

```text
multi-gym-platform/
│
├── .github/
│   └── workflows/
│       ├── frontend.yml      # Pipeline khusus folder /frontend
│       └── backend.yml       # Pipeline khusus folder /backend
│
├── frontend/                 # Workspace untuk 2 Frontend Developer
│   ├── package.json          # React, Vite, Tailwind, Zustand, TanStack Query
│   ├── src/
│   └── vercel.json           # Konfigurasi deployment Vercel
│
├── backend/                  # Workspace untuk 1 Backend Developer
│   ├── composer.json         # Laravel 11 API Only, PostgreSQL
│   ├── app/
│   ├── routes/
│   └── railway.json          # Konfigurasi deployment Railway
│
└── README.md
```

---

## 2. GitHub Actions Pipeline (CI/CD)

Kita menggunakan fitur **Path Filtering** di GitHub Actions. Ini memastikan *pipeline* Frontend tidak akan berjalan jika yang diubah hanya kode Backend, dan sebaliknya, menghemat *build time* secara drastis.

### A. Frontend Pipeline (`.github/workflows/frontend.yml`)
*Pipeline* ini mengamankan kode antarmuka sebelum di-*deploy* ke Vercel.

```yaml
name: Frontend CI/CD

on:
  push:
    branches: [ "main" ]
    paths:
      - 'frontend/**'
  pull_request:
    branches: [ "main" ]
    paths:
      - 'frontend/**'

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./frontend

    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
        cache-dependency-path: './frontend/package-lock.json'
        
    - name: Install Dependencies
      run: npm ci
      
    - name: Run ESLint
      run: npm run lint
      
    - name: Run Unit Tests (Vitest)
      run: npm run test
      
    - name: Build Project
      run: npm run build
      
    # Note: Deployment ke Vercel akan di-handle secara otomatis oleh Vercel GitHub App 
    # saat PR di-merge ke branch main. Pipeline ini berfungsi sebagai "Status Check" wajib.
```

### B. Backend Pipeline (`.github/workflows/backend.yml`)
*Pipeline* ini memastikan logika *ledger* dan transaksi di Laravel 11 berjalan sempurna sebelum ditarik oleh Railway.

```yaml
name: Backend CI/CD

on:
  push:
    branches: [ "main" ]
    paths:
      - 'backend/**'
  pull_request:
    branches: [ "main" ]
    paths:
      - 'backend/**'

jobs:
  test-php:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./backend

    steps:
    - uses: actions/checkout@v4
    
    - name: Setup PHP
      uses: shivammathur/setup-php@v2
      with:
        php-version: '8.3'
        tools: composer, phpunit
        
    - name: Install Dependencies
      run: composer install --prefer-dist --no-progress --no-suggest
      
    - name: Run Code Style Check (Laravel Pint)
      run: ./vendor/bin/pint --test
      
    - name: Run Tests (Pest / PHPUnit)
      env:
        DB_CONNECTION: sqlite
        DB_DATABASE: :memory:
      run: php artisan test
      
    # Note: Deployment ke Railway akan di-handle otomatis oleh platform Railway 
    # saat push terdeteksi di branch main pada folder /backend.
```

---

## 3. Alur Kerja Tim (Git Flow)

Untuk memfasilitasi kerja paralel 3 developer dalam 12 hari, terapkan aturan penamaan *branch* berikut:

### Backend Developer (1 Orang)
*   Fokus: Auth, CRUD Gym, API Transaksi.
*   Branch format: `feat/api-*` (contoh: `feat/api-auth`, `feat/api-checkout`).
*   Alur: Menyelesaikan dokumentasi API (Postman/Swagger) di hari pertama agar tim Frontend bisa melakukan *mocking* data.

### Frontend Developer 1 (Fokus User/Member)
*   Fokus: Gym Discovery, Halaman Detail, Check-in Modal, Riwayat Saldo.
*   Branch format: `feat/fe-user-*` (contoh: `feat/fe-user-discovery`, `feat/fe-user-checkin`).

### Frontend Developer 2 (Fokus Core & Mitra/Admin)
*   Fokus: Routing, Auth State, Dashboard Admin (CRUD Gym), Dashboard Mitra (Validasi PIN).
*   Branch format: `feat/fe-core-*` (contoh: `feat/fe-core-auth`, `feat/fe-core-mitra-dashboard`).

### Proses Pull Request (PR) & Deployment
1. Developer membuat PR ke branch `main`.
2. GitHub Actions berjalan secara otomatis sesuai direktori yang diubah (Frontend atau Backend).
3. Jika status cek berwarna hijau (*passed*), PR bisa di-*merge*.
4. Vercel dan Railway akan secara otomatis men-*deploy* perubahan ke URL *staging/production*.
5. URL *staging* yang ter-*generate* otomatis ini bisa langsung didemonstrasikan kepada Mas Bambang Warsuta untuk validasi progres harian (*daily review*) guna memastikan alur bisnis *pay-per-visit* sudah sesuai ekspektasi.

---

## 4. Konfigurasi Deployment (Checklist)

**Vercel (Frontend):**
- Pada dashboard Vercel, *import repository*.
- Set **Framework Preset** ke `Vite`.
- Set **Root Directory** ke `frontend`.
- Masukkan *Environment Variables* seperti `VITE_API_BASE_URL`.

**Railway (Backend):**
- Pada dashboard Railway, *create new project from GitHub*.
- Tambahkan *plugin* **PostgreSQL**.
- Arahkan *build* ke folder `backend`.
- Masukkan *Environment Variables* standar Laravel (`APP_KEY`, `DB_URL`, dll).
- Tambahkan *custom start command* untuk otomatis melakukan *migration*: `php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=$PORT`.
