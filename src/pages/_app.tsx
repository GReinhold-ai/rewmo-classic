// src/pages/_app.tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

import { AuthProvider } from "@/lib/AuthProvider";
import Navbar from "@/components/Navbar";
// If you have a ToastProvider component, keep this import; otherwise remove it.
import ToastProvider from "@/components/ToastProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#003B49" />
        <title>RewmoAI</title>
        <meta
          name="description"
          content="The AI-powered hub for rewards, savings, and smarter financial growth."
        />
      </Head>

      <Navbar />

      {/* If you don't have ToastProvider, remove this wrapper */}
      <ToastProvider>
        <main className="pt-16 md:pt-20">
          <Component {...pageProps} />
        </main>
      </ToastProvider>
    </AuthProvider>
  );
}
