// src/pages/thank-you.tsx
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";

export default function ThankYouPage() {
  const router = useRouter();

  // If email is provided as a query param, show it to the user
  const email = useMemo(() => {
    const e = router.query.email;
    return typeof e === "string" ? e : null;
  }, [router.query.email]);

  return (
    <>
      <Head>
        <title>Thank You • RewmoAI</title>
        <meta
          name="description"
          content="Thanks for joining RewmoAI. Your rewards and training are ready."
        />
      </Head>

      <main className="min-h-[calc(100vh-5rem)] bg-[#003B49] text-white">
        <div className="mx-auto max-w-2xl px-6 py-16 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#FF6B00]">
            Thank you!
          </h1>
          <p className="mt-4 text-white/90">
            You’re all set. Your account is ready and your rewards are tracking.
          </p>

          {email && (
            <p className="mt-2 text-sm text-white/70">
              A confirmation was sent to <span className="font-semibold">{email}</span>.
            </p>
          )}

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex items-center rounded-lg bg-[#FF6B00] px-5 py-2.5 font-semibold text-white hover:bg-[#E55F00]"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/training"
              className="inline-flex items-center rounded-lg border border-white/20 px-5 py-2.5 font-semibold hover:bg-white/10"
            >
              Explore Training
            </Link>
          </div>

          <div className="mt-10 rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-left">
            <p className="text-sm text-white/80">
              During beta, points accrue automatically per our{" "}
              <Link href="/reward-rules" className="underline text-teal-300 hover:opacity-90">
                Reward Rules
              </Link>
              . Withdrawals open after launch.
            </p>
          </div>

          <div className="mt-6 text-sm text-white/70">
            Not your account?{" "}
            <Link href="/login" className="underline text-teal-300 hover:opacity-90">
              Sign in
            </Link>
            .
          </div>
        </div>
      </main>
    </>
  );
}
