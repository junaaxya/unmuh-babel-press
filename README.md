🔐 1. Login Admin
Endpoint: /api/admin/login
Method: POST

Request Body:
{
"email": "admin@example.com",
"password": "admin123"
}

Response:

{
"message": "Login berhasil",
"admin": {
"id": 1,
"email": "admin@example.com"
}
}

🧑‍💼 2. Register Admin
Endpoint: /api/admin/register

Method: POST

Request Body:
{
"email": "admin@example.com",
"password": "admin123"
}
Response:

{
"message": "Admin berhasil didaftarkan",
"admin": {
"id": 1,
"email": "admin@example.com"
}
}

🚪 3. Logout Admin
Endpoint: /api/admin/logout
Method: POST

api-books

## 📁 Struktur Folder

```

src/
└── app/
└── api/
└── books/
├── route.js          # GET semua buku
├── addBooks/         # POST untuk menambah buku
│   └── route.js
└── search/           # GET pencarian buku
└── route.js

```

## 📘 Model Database (Prisma Schema)

```prisma
model listbuku {
  id          Int      @id @default(autoincrement())
  title       String
  penulis     String
  penerbit    String
  tahunTerbit Int
  kategori    String?
  sinopsis    String?   @db.Text
  coverUrl    String?
  createdAt   DateTime @default(now())
}
```

---

## 🔌 API Endpoint

### 1. `GET /api/books`

Mendapatkan semua data buku, diurutkan berdasarkan `createdAt` (terbaru).

**Contoh respons:**

```json
[
  {
    "id": 1,
    "title": "Belajar Next.js",
    "penulis": "Andi",
    "penerbit": "Gramedia",
    "tahunTerbit": 2023,
    "kategori": "Teknologi",
    "sinopsis": "Buku ini membahas dasar Next.js.",
    "coverUrl": "https://example.com/cover.jpg",
    "createdAt": "2025-05-22T10:00:00.000Z"
  }
]
```

---

### 2. `POST /api/books/addBooks`

Menambahkan buku baru ke database.

**Body (JSON):**

```json
{
  "title": "Belajar Next.js",
  "penulis": "Andi",
  "penerbit": "Gramedia",
  "tahunTerbit": 2023,
  "kategori": "Teknologi",
  "sinopsis": "Buku ini membahas dasar Next.js.",
  "coverUrl": "https://example.com/cover.jpg"
}
```

**Respon sukses:**

```json
{
  "id": 2,
  "title": "Belajar Next.js",
  "penulis": "Andi",
  "penerbit": "Gramedia",
  "tahunTerbit": 2023,
  ...
}
```

**Respon error (validasi):**

```json
{
  "error": "Input tidak valid",
  "details": [...]
}
```

---

### 3. `GET /api/books/search`

Mencari buku berdasarkan judul, penulis, kategori, atau rentang tahun terbit. atau bisa dari salah satu opsi tsb

**Query params yang tersedia:**

- `title`: judul buku (partial match)
- `penulis`: nama penulis (partial match)
- `kategori`: kategori buku (exact match)
- `tahun_min`: batas bawah tahun terbit
- `tahun_max`: batas atas tahun terbit

**Contoh:**

```http
GET /api/books/search?title=next&penulis=andi&tahun_min=2020&tahun_max=2025
```

**Respon sukses:**

```json
[
  {
    "id": 2,
    "title": "Belajar Next.js",
    ...
  }
]
```

**Jika tidak ditemukan:**

```json
{
  "message": "Tidak ada buku yang ditemukan"
}
```

```
# 📡 API Berita - Dokumentasi Endpoint

API ini merupakan bagian dari proyek Next.js menggunakan `App Router`. Endpoint-endpoint di bawah ini menangani operasi CRUD dan pencarian data berita.

## 📁 Struktur Folder
```

src/
└── app/
└── api/
└── berita/
├── addBerita/
│ └── route.js // Menambahkan data berita
├── delete/\[id]/
│ └── route.js // Menghapus berita berdasarkan ID
├── search/
│ └── route.js // Mencari berita berdasarkan query
└── update/\[id]/
└── route.js // Memperbarui berita berdasarkan ID

````

---

## 🔧 Endpoint API

### 📌 1. Tambah Berita
**Endpoint:** `POST /api/berita/addBerita`
**Deskripsi:** Menambahkan data berita baru.

**Body JSON:**
```json
{
  "judul": "Judul berita",
  "isi": "Isi lengkap berita",
  "thumbnailUrl": "https://url-thumbnail.com/image.jpg"
}
````

**Response Sukses:**

```json
{
  "message": "Berita berhasil ditambahkan",
  "data": { ... }
}
```

---

### 🗑️ 2. Hapus Berita

**Endpoint:** `DELETE /api/berita/delete/[id]`
**Deskripsi:** Menghapus berita berdasarkan ID.

**Contoh:**
`DELETE /api/berita/delete/5`

**Response Sukses:**

```json
{
  "message": "Berita berhasil dihapus"
}
```

---

### 🔍 3. Cari Berita

**Endpoint:** `GET /api/berita/search?judul=judul`
**Deskripsi:** Mencari berita berdasarkan judul.

**Contoh:**
`GET /api/berita/search?judul=politik`

**Response Sukses:**

```json
{
  "data": [ ... ]
}
```

---

### ✏️ 4. Update Berita

**Endpoint:** `PUT /api/berita/update/[id]`
**Deskripsi:** Memperbarui satu atau lebih field dari berita yang sudah ada.

**Contoh:**
`PUT /api/berita/update/5`

**Body JSON:**

```json
{
  "judul": "Judul baru (opsional)",
  "isi": "Isi baru (opsional)",
  "thumbnailUrl": "https://url-gambar.com (opsional)"
}
```

**Response Sukses:**

```json
{
  "message": "Berita berhasil diperbarui",
  "data": { ... }
}
```

---

## ⚠️ Validasi

Semua endpoint menggunakan validasi dengan library `zod` dan akan mengembalikan status `400` jika data tidak valid.

**Contoh Response Error:**

```json
{
  "error": "Validasi gagal",
  "detail": [
    {
      "path": ["judul"],
      "message": "Judul minimal 5 karakter"
    }
  ]
}
```

---

````markdown
# Endpoint API-BERANDA

## GET `/api/beranda`

Mengambil data untuk beranda (logo, hero image, dan hero text).

**Contoh respons:**

```json
{
  "logo": "/uploads/logo.png",
  "heroImage": "/uploads/hero-image.png",
  "herotext": {
    "title": "Judul Hero",
    "subtitle": "Subjudul Hero"
  }
}
```
````

**Catatan:** Endpoint ini memerlukan token authorization. Jika tidak disertakan token, akan mendapat respons `401 Unauthorized`.

## GET `/api/beranda/hero-text`

Mengambil data hero text dari file JSON.

**Contoh respons:**

```json
{
  "title": "Judul Hero",
  "subtitle": "Subjudul Hero"
}
```

## PUT `/api/beranda/hero-text`

Memperbarui file heroText.json.

**Request body (JSON):**

```json
{
  "title": "Judul baru",
  "subtitle": "Subjudul baru"
}
```

**Persyaratan:** Wajib menyertakan token authorization.

## POST `/api/beranda/logo`

Mengunggah file logo.

**Format request:** Form-data dengan field `file`  
**File akan disimpan di:** `public/uploads/logo.png`

## DELETE `/api/beranda/logo`

Menghapus file logo.  
**Lokasi file yang dihapus:** `uploads/logo.png`

## POST `/api/beranda/hero-image`

Mengunggah file hero image.

**Format request:** Form-data dengan field `file`  
**File akan disimpan di:** `public/uploads/hero-image.png`

## DELETE `/api/beranda/hero-image`

Menghapus file hero image.  
**Lokasi file yang dihapus:** `public/uploads/hero-image.png`

**Catatan:** Semua endpoint yang mengubah data (PUT, POST, DELETE) memerlukan token authorization.

```

```
