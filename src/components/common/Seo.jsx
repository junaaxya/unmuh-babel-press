// components/common/Seo.jsx
import Head from 'next/head';

export default function Seo({ title, description, image, url }) {
  const siteName = 'Unmuh Press';
  const defaultImage = image || '/og-image.jpg'; // pastikan file ini ada di public/
  const fullTitle = title ? `${title} | ${siteName}` : siteName;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={defaultImage} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={defaultImage} />

      {/* Favicon (optional) */}
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
}
