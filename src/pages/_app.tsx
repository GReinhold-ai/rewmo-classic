// src/pages/_app.tsx
import type { AppProps } from "next/app";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/lib/AuthProvider"; // <-- Import your provider!
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-black">
        <Navbar />
        <Component {...pageProps} />
      </div>
    </AuthProvider>
  );
}
