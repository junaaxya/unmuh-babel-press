# Dockerfile

# [Stage 1: Builder]
# Tahap ini fokus untuk meng-install dependencies dan membangun aplikasi Next.js
FROM node:20-bookworm AS builder
WORKDIR /app

# Install openssl untuk Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# --- Menerima variabel dari docker-compose saat build ---
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL
ARG MAIL_FROM_NAME   
ARG MAIL_FROM_EMAIL
ARG RESEND_API_KEY
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ENV NEXTAUTH_URL=${NEXTAUTH_URL}
ENV MAIL_FROM_NAME=${MAIL_FROM_NAME} 
ENV MAIL_FROM_EMAIL=${MAIL_FROM_EMAIL}
ENV RESEND_API_KEY=${RESEND_API_KEY}

# Install dependencies dengan cache
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

# Generate Prisma Client
COPY prisma ./prisma
RUN npx prisma generate

# Build aplikasi Next.js
COPY . .
RUN npm run build


# ---------- [Stage 2: Runner] ----------
# Tahap ini fokus untuk menjalankan aplikasi yang sudah di-build
FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install openssl untuk Prisma Client di runtime
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Salin folder 'standalone' yang dibuat oleh `output: 'standalone'`
COPY --from=builder /app/.next/standalone ./

# Salin folder 'public' dan 'static' yang dibutuhkan oleh server standalone
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

# Ini akan menimpa node_modules minimal dari 'standalone' dan memastikan
# semua dependencies (seperti bcryptjs untuk seed) tersedia.
COPY --from=builder /app/node_modules ./node_modules


# Salin entrypoint script untuk migrasi
COPY --from=builder /app/entrypoint.sh ./entrypoint.sh
# Salin folder prisma agar migrasi bisa dijalankan
COPY --from=builder /app/prisma ./prisma
# Salin package.json agar npx bisa menemukan prisma
COPY --from=builder /app/package.json ./package.json

# === PERBAIKAN: Salin folder 'src' agar bisa diakses oleh seed.js ===
COPY --from=builder /app/src ./src

RUN chmod +x ./entrypoint.sh

# Atur entrypoint untuk menjalankan migrasi sebelum start
ENTRYPOINT ["./entrypoint.sh"]

EXPOSE 4000
# PERUBAHAN: Jalankan server standalone, bukan `next start`
CMD ["node", "server.js"]