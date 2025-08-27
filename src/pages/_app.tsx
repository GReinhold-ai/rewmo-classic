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
      </Head>

      <Navbar />
      <main className="pt-16 md:pt-20">
        <Component {...pageProps} />
      </main>
    </AuthProvider>
  );
}
