import { AppProps } from "next/app";
import "@/styles/globals.css";
import { AuthProvider } from "@/lib/AuthProvider"; // make sure this path is correct
import { Toaster } from "react-hot-toast";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
      <Toaster position="top-right" />
    </AuthProvider>
  );
}

export default MyApp;
