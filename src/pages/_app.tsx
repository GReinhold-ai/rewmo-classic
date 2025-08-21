// src/pages/_app.tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { AuthProvider } from "@/lib/AuthProvider";
import Navbar from "@/components/Navbar";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const hideNavbar = router.pathname === "/"; // still hide on pure landing page

  return (
    <AuthProvider>
      {!hideNavbar && <Navbar />}
      <main className={!hideNavbar ? "pt-16 md:pt-20" : ""}>
        <Component {...pageProps} />
      </main>
    </AuthProvider>
  );
}
