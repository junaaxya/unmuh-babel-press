import { prisma } from "@/lib/db";
import Link from "next/link";
import PdfReaderWrapper from "./PdfReaderWrapper";

export default async function BacaBukuPage({ params }) {
  const { id } = await params;

  const book = await prisma.book.findUnique({
    where: { id: Number(id) },
  });

  if (!book || book.status !== "published" || !book.pdf_url) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>PDF buku belum tersedia.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 rounded-2xl bg-white p-5 shadow">
          <h1 className="text-2xl font-bold text-gray-900">{book.title}</h1>

          <p className="mt-2 text-sm text-gray-600">
            Akses baca pengunjung: {book.preview_percent || 100}%
          </p>

          <Link
            href={`/buku/${book.id}`}
            className="mt-4 inline-block text-sm text-blue-600 hover:underline"
          >
            ← Kembali ke detail buku
          </Link>
        </div>

        <PdfReaderWrapper
          pdfUrl={book.pdf_url}
          previewPercent={book.preview_percent || 100}
        />
      </div>
    </main>
  );
}