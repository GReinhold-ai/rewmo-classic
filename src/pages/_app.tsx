import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/lib/AuthProvider";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  // Only show Navbar if NOT on the landing page
  const hideNavbar = router.pathname === "/";

  return (
    <AuthProvider>
      {!hideNavbar && <Navbar />}
      <Component {...pageProps} />
    </AuthProvider>
  );
}
