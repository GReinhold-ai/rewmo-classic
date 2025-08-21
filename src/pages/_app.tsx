import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/lib/AuthProvider";
import Navbar from "@/components/Navbar";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Navbar />{/* sticky header shown on all pages */}
      <main className="pt-16 md:pt-20">
        <Component {...pageProps} />
      </main>
    </AuthProvider>
  );
}
