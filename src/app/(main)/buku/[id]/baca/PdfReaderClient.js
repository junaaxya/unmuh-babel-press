'use client';

import { useEffect, useRef, useState } from 'react';

export default function PdfReaderClient({ pdfUrl, previewPercent }) {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function renderPdf() {
      try {
        setLoading(true);
        setInfo('');

        const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;

        const percent = Number(previewPercent || 100);
        const allowedPages = Math.max(
          1,
          Math.ceil(pdf.numPages * (percent / 100))
        );

        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }

        for (let pageNumber = 1; pageNumber <= allowedPages; pageNumber++) {
          if (cancelled) return;

          const page = await pdf.getPage(pageNumber);
          const viewport = page.getViewport({ scale: 1.35 });

          const wrapper = document.createElement('div');
          wrapper.className =
            'mb-6 rounded-xl bg-white p-4 shadow overflow-auto';

          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');

          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.className = 'mx-auto';

          wrapper.appendChild(canvas);

          const pageLabel = document.createElement('p');
          pageLabel.className = 'mt-3 text-center text-sm text-gray-500';
          pageLabel.innerText = `Halaman ${pageNumber} dari ${allowedPages}`;
          wrapper.appendChild(pageLabel);

          containerRef.current.appendChild(wrapper);

          await page.render({
            canvasContext: context,
            viewport,
          }).promise;
        }

        setInfo(`Menampilkan ${allowedPages} dari ${pdf.numPages} halaman.`);
      } catch (error) {
        console.error('PDF render error:', error);
        setInfo('PDF gagal dimuat.');
      } finally {
        setLoading(false);
      }
    }

    renderPdf();

    return () => {
      cancelled = true;
    };
  }, [pdfUrl, previewPercent]);

  return (
    <div className="bg-gray-100 py-6">
      {loading && (
        <div className="rounded-2xl bg-white p-6 text-center shadow">
          Memuat PDF...
        </div>
      )}

      {info && (
        <div className="mb-5 rounded-xl bg-blue-50 p-4 text-center text-sm text-blue-700">
          {info}
        </div>
      )}

      <div ref={containerRef} />
    </div>
  );
}