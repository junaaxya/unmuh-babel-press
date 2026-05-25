'use client';

import dynamic from 'next/dynamic';

const PdfReaderClient = dynamic(() => import('./PdfReaderClient'), {
  ssr: false,
  loading: () => (
    <div className="rounded-2xl bg-white p-8 text-center shadow">
      Memuat pembaca PDF...
    </div>
  ),
});

export default function PdfReaderWrapper({ pdfUrl, previewPercent }) {
  return (
    <PdfReaderClient
      pdfUrl={pdfUrl}
      previewPercent={previewPercent}
    />
  );
}