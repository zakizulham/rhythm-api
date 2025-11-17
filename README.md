[![Status](https://img.shields.io/badge/Status-Completed-brightgreen.svg)](https://github.com/zakizulham/rhythm-api/graphs/commit-activity)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v22+-darkgreen.svg)](https://nodejs.org/)
[![Hapi.js](https://img.shields.io/badge/Framework-Hapi.js-orange.svg)](https://hapi.dev/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue.svg)](https://www.postgresql.org/)
[![JWT Auth](https://img.shields.io/badge/Auth-JWT-red.svg)](https://jwt.io/)

# rhythm-api

Repositori ini berisi *back-end* API untuk layanan streaming musik hipotetis, "OpenMusic". Ini adalah implementasi API *full-stack* yang dibangun dari awal menggunakan Node.js dan Hapi, dengan fokus pada arsitektur modular (plugin), autentikasi/otorisasi yang aman, dan persistensi data menggunakan database PostgreSQL.

Proyek ini mencakup fungsionalitas V1 (Albums, Songs) dan diperluas dengan fitur V2 (Users, Playlists, Collaborations) yang dilindungi oleh autentikasi JWT.

## Arsitektur & Prinsip Desain

API ini dirancang menggunakan arsitektur berlapis (*layered architecture*) yang bersih dan modular, mengikuti prinsip *Separation of Concerns* (SoC).

* **Plugin Architecture (via Hapi):** Setiap *resource* utama (Albums, Songs, Users, Playlists, dll.) diisolasi ke dalam Hapi Plugin-nya sendiri. Ini membuat basis kode tetap modular, independen, dan mudah dikelola.
* **Service Layer:** Semua logika bisnis dan kueri *database* diekstraksi ke dalam *Service* (`services/`). *Handler* tetap "tipis" dan hanya bertugas mengorkestrasi validasi, pemanggilan *service*, dan respons.
* **Centralized Error Handling:** Menggunakan *event extension* `onPreResponse` Hapi untuk menangkap semua *error* (Client & Server) secara terpusat, menyederhanakan *handler* dan memastikan format respons *error* selalu konsisten.
* **Data Validation:** Menggunakan **Joi** untuk memvalidasi semua *payload* yang masuk (Kriteria 4) sebelum mencapai *handler*, memastikan integritas data.
* **Database Pooling:** Menggunakan `pg.Pool` untuk manajemen koneksi PostgreSQL yang efisien dan beperforma tinggi.



## Fitur & Endpoint

### Kriteria Wajib (V1 & V2)
* **Users (`/users`):**
    * `POST /users`: Registrasi pengguna baru (dengan *hashing* password `bcrypt`).
* **Authentications (`/authentications`):**
    * `POST /authentications`: Login pengguna (mengembalikan *access* & *refresh token* JWT).
    * `PUT /authentications`: Memperbarui *access token* menggunakan *refresh token*.
    * `DELETE /authentications`: Logout (menghapus *refresh token* dari *database*).
* **Albums (`/albums`):**
    * `POST`, `GET /{id}`, `PUT /{id}`, `DELETE /{id}`: Fungsionalitas CRUD penuh untuk Album.
* **Songs (`/songs`):**
    * `POST`, `GET`, `GET /{id}`, `PUT /{id}`, `DELETE /{id}`: Fungsionalitas CRUD penuh untuk Lagu.
* **Playlists (`/playlists`):**
    * `POST /playlists`: Membuat *playlist* baru (membutuhkan autentikasi).
    * `GET /playlists`: Mendapatkan daftar *playlist* milik pengguna (membutuhkan autentikasi).
    * `DELETE /playlists/{id}`: Menghapus *playlist* (otorisasi pemilik).
* **Playlist Songs (`/playlists/{id}/songs`):**
    * `POST`: Menambahkan lagu ke *playlist* (otorisasi pemilik/kolaborator).
    * `GET`: Melihat daftar lagu di *playlist* (otorisasi pemilik/kolaborator).
    * `DELETE`: Menghapus lagu dari *playlist* (otorisasi pemilik/kolaborator).

### Kriteria Opsional
* **Pencarian Lagu (V1):** `GET /songs` mendukung *query parameters* `?title=` dan `?performer=`.
* **Detail Album (V1):** `GET /albums/{id}` secara otomatis menyertakan daftar lagu (`songs`) yang ada di dalam album tersebut.
* **Kolaborasi (V2):**
    * `POST /collaborations`: Menambahkan pengguna lain sebagai kolaborator *playlist* (otorisasi pemilik).
    * `DELETE /collaborations`: Menghapus kolaborator (otorisasi pemilik).
* **Aktivitas Playlist (V2):**
    * `GET /playlists/{id}/activities`: Melihat riwayat (`add`/`delete`) lagu pada *playlist* (otorisasi pemilik/kolaborator).
* **Kualitas Kode:** Lolos 100% *linting* menggunakan ESLint (Airbnb Config).

## Teknologi Utama

* **Framework:** Hapi.js (`@hapi/hapi`)
* **Database:** PostgreSQL (`pg`)
* **Migrasi:** `node-pg-migrate`
* **Autentikasi:** `@hapi/jwt` (JWT)
* **Validasi:** `Joi`
* **Password Hashing:** `bcrypt`
* **Dependencies:** `dotenv`, `nanoid`
* **Dev Tools:** `nodemon`, `eslint`

## Replikasi Lokal

Untuk menjalankan proyek ini di mesin lokal Anda, pastikan **Node.js (v22+)** dan **Docker Desktop** sudah terinstal dan berjalan.

### 1. Setup Awal
```bash
# 1. Clone repositori
git clone https://github.com/zakizulham/rhythm-api.git
cd rhythm-api

# 2. Install dependencies
npm install
```

### 2. Setup Database & Environment
```bash
# 3. Jalankan container PostgreSQL dari Docker
docker-compose up -d

# 4. Salin file environment example
# (Sesuaikan isinya jika perlu, tapi defaultnya sudah pas dengan docker-compose)
cp .env.example .env

# 5. Jalankan migrasi database untuk membuat semua tabel
npm run migrate
```

### 3. Menjalankan Server
```bash
# 6. Jalankan server dalam mode development (auto-reload)
npm run start-dev

# Server akan berjalan di http://localhost:5000
```

### 4. Pengujian
```bash
# 7. Menjalankan linter
npm run lint

# 8. Menjalankan tes otomatisasi API
# - Impor collection Postman "OpenMusic API V2 Test.zip"
# - Set environment "OpenMusic API Test"
# - Jalankan Collection Runner.
```

## Lisensi
Proyek ini dilisensikan di bawah [MIT License](LICENSE).