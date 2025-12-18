## 🚀 Instalasi & Menjalankan Aplikasi

Panduan berikut menjelaskan cara menjalankan aplikasi Task Management secara lokal.  
Aplikasi terdiri dari Backend (Laravel API) dan Frontend (Next.js).

Backend (Laravel)

Pastikan PHP >= 8.2, Composer, dan database (MySQL / PostgreSQL) sudah terpasang.

Clone repository dan install dependency backend:
- git clone <repository-url>
- cd backend
- composer install
- cp .env.example .env
- php artisan key:generate

Konfigurasikan file .env sesuai environment lokal:
- APP_NAME=TaskManagement
- APP_ENV=local
- APP_DEBUG=true
- APP_TIMEZONE=Asia/Jakarta
- APP_URL=http://127.0.0.1:8000
- DB_CONNECTION=pgsql
- DB_HOST=127.0.0.1
- DB_PORT=5432
- DB_DATABASE=task_management
- DB_USERNAME=postgres
- DB_PASSWORD=
- JWT_SECRET=your-jwt-secret

Jalankan migrasi dan seeder database:
- php artisan migrate --seed

Jalankan backend server:
- php artisan serve

Backend akan berjalan di:
http://127.0.0.1:8000

---

Frontend (Next.js)

Pastikan Node.js >= 18 sudah terpasang.

Masuk ke folder frontend dan install dependency:
- cd ../frontend
- pnpm install

Buat file .env.local dan isi dengan:
- NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api/v1

Jalankan frontend:
- pnpm run dev

Frontend akan berjalan di:
http://localhost:3000

---

Login Dummy

Gunakan akun berikut untuk login ke aplikasi:
- Email    : test@example.com
- Password : password
