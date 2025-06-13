// app/layanan/layout.js
import "../globals.css";
export default function LayananLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
