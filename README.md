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


