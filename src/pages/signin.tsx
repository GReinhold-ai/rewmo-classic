// src/pages/signin.tsx
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";

/**
 * Redirect /signin -> /account
 * SSR redirect for hard loads + client redirect for SPA fallback.
 */
const SignInRedirect: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/account");
  }, [router]);

  return (
    <>
      <Head>
        <title>Redirecting…</title>
        <meta httpEquiv="refresh" content="0; url=/account" />
      </Head>
      <main className="min-h-screen flex items-center justify-center bg-[#003B49] text-[#B6E7EB]">
        <p>
          Redirecting to <a href="/account" className="underline">/account</a>…
        </p>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: { destination: "/account", permanent: false },
});

export default SignInRedirect;
