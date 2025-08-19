#!/bin/sh
# entrypoint.sh

# Hentikan proses jika ada perintah yang gagal
set -e

echo "Running Prisma migrations..."
# 'deploy' adalah perintah yang direkomendasikan untuk lingkungan non-development
npx prisma migrate deploy

echo "Migrations complete. Starting the server..."
# 'exec "$@"' akan menjalankan perintah yang didefinisikan dalam CMD di Dockerfile
exec "$@"