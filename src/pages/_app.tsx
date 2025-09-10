// src/pages/_app.tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { AuthProvider } from "@/lib/AuthProvider";
import Navbar from "@/components/Navbar";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#003B49" />

        {/* Optional SEO defaults */}
        <title>RewmoAI</title>
        <meta name="description" content="The AI-powered hub for rewards, savings, and smarter financial growth." />
        {/* Optional OG/Twitter cards */}
        {/* <meta property="og:title" content="RewmoAI" />
        <meta property="og:description" content="The AI-powered hub for rewards, savings, and smarter financial growth." />
        <meta property="og:image" content="/logo-512.png" />
        <meta name="twitter:card" content="summary_large_image" /> */}
      </Head>

      <Navbar />
      <main className="pt-16 md:pt-20">
        <Component {...pageProps} />
      </main>
    </AuthProvider>
  );
}
