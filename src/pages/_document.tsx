// src/pages/_document.tsx
import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Favicon / Icons */}
          <link rel="icon" href="/favicon.ico" sizes="any" />
          {/* For older Safari pinned tabs (optional if you have an SVG): */}
          {/* <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#003B49" /> */}

          {/* PWA / Manifest */}
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          {/* Some browsers still look for explicit sizes: */}
          <link rel="icon" type="image/png" sizes="192x192" href="/logo-192.png" />
          <link rel="icon" type="image/png" sizes="512x512" href="/logo-512.png" />

          {/* Theme colors (address bar, task switcher, etc.) */}
          <meta name="theme-color" content="#003B49" />
          <meta name="application-name" content="RewmoAI" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-title" content="Rewmo" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />

          {/* Preconnects (optional perf) */}
          {/* <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" /> */}
          {/* <link rel="preconnect" href="https://fonts.googleapis.com" /> */}

          {/* OG basics (optional) */}
          {/* <meta property="og:title" content="RewmoAI" />
          <meta property="og:site_name" content="RewmoAI" />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="/logo-512.png" /> */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
