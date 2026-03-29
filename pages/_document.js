/**
 * @fileoverview Next.js Document — Custom HTML shell
 * @description Adds Google Fonts, JSON-LD structured data, and meta tags
 *   that must be present in the initial HTML response.
 */

import { Html, Head, Main, NextScript } from 'next/document';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://modern-plp.netlify.app';

/** JSON-LD structured data for the Collection Page */
const collectionPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'ModernPLP — Premium Product Collection',
  description:
    'Discover our curated collection of premium products across electronics, jewellery, and fashion.',
  url: SITE_URL,
  publisher: {
    '@type': 'Organization',
    name: 'ModernPLP',
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/images/logo.png`,
    },
  },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Products',
        item: `${SITE_URL}/`,
      },
    ],
  },
};

export default function Document() {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        {/* ── Character Encoding ── */}
        <meta charSet="UTF-8" />

        {/* ── Favicon ── */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* ── Google Fonts — Preconnect for performance ── */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Display font: Crimson Text | Body font: Sora */}
        <link
          href="https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Sora:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />

        {/* ── Theme Color for mobile browsers ── */}
        <meta name="theme-color" content="#1e3d7a" />
        <meta name="msapplication-TileColor" content="#1e3d7a" />

        {/* ── JSON-LD Structured Data ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(collectionPageSchema),
          }}
        />
      </Head>
      <body>
        {/* Skip to main content — accessibility */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
