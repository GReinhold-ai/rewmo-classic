// src/pages/_app.tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";

import { AuthProvider } from "@/lib/AuthProvider";
import Navbar from "@/components/Navbar";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const hideNavbar = router.pathname === "/"; // hide navbar on landing page

  return (
    <AuthProvider>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta name="theme-color" content="#003B49" />
      </Head>

      {!hideNavbar && <Navbar />}

      {/* add top padding when Navbar is visible */}
      <main className={!hideNavbar ? "pt-16 md:pt-20" : ""}>
        <Component {...pageProps} />
      </main>
    </AuthProvider>
  );
}
