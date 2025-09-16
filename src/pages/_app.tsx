import "@/styles/globals.css";
import type { AppProps, NextPage } from "next/app";
import Head from "next/head";
import { useEffect } from "react";
import { AuthProvider } from "@/lib/AuthProvider";
import Navbar from "@/components/Navbar";
import { saveRefFromUrl } from "@/lib/referral";
import { ToastProvider } from "@/components/ToastProvider";

type NextPageWithFlags = NextPage & { hideGlobalNav?: boolean };
type AppPropsWithFlags = AppProps & { Component: NextPageWithFlags };

export default function App({ Component, pageProps }: AppPropsWithFlags) {
  useEffect(() => {
    saveRefFromUrl();
  }, []);

  const hideGlobalNav = Component.hideGlobalNav === true;

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

      {!hideGlobalNav && <Navbar />}

      <main className={hideGlobalNav ? "" : "pt-16 md:pt-20"}>
        <Component {...pageProps} />
      </main>

      {/* Toasts overlay */}
      <ToastProvider />
    </AuthProvider>
  );
}
