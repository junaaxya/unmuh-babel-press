# Gunakan image Node.js ringan
FROM node:20-alpine

# Set direktori kerja
WORKDIR /app

# Pasang dependensi dulu (lebih cepat caching)
COPY package*.json ./

# Install dependensi
RUN npm install

# Copy seluruh project
COPY . .

# Salin environment variables agar tersedia saat build
# Perlu ditempatkan SEBELUM `npm run build`
COPY .env .env

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js
RUN npm run build

# Jalankan server (gunakan start untuk produksi, dev untuk lokal)
CMD ["npm", "start"]
