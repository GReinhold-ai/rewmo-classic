// src/pages/_document.tsx
import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Favicon / Icons */}
          <link rel="icon" href="/favicon.ico" sizes="any" />

          {/* PWA / Manifest */}
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="192x192" href="/logo-192.png" />
          <link rel="icon" type="image/png" sizes="512x512" href="/logo-512.png" />

          {/* Theme colors */}
          <meta name="theme-color" content="#003B49" />
          <meta name="application-name" content="RewmoAI" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-title" content="Rewmo" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />

          {/* Impact.com verification */}
          <meta name="impact-site-verification" content="3c531074-7cd3-4608-9472-f8e30540319c" />
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