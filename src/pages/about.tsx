// src/pages/about.tsx
import Head from "next/head";
import Link from "next/link";

function ExternalLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={className || "text-teal-300 underline hover:opacity-90"}
    >
      {children}
    </a>
  );
}

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About RewmoAI</title>
        <meta name="description" content="Learn more about RewmoAI — rewards, training, and Lean Lab." />
      </Head>

      <main className="mx-auto max-w-4xl px-6 py-12 text-white">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">About RewmoAI</h1>
          <p className="mt-2 text-white/80">
            Rewards + practical training to help you save money, improve processes, and grow skills.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">What we do</h2>
          <p className="text-white/85">
            RewmoAI is building an easy on-ramp to smarter personal finance, GenAI skills, and practical process
            improvement (R-PM / Lean Lab). Earn rewards while you learn, connect your everyday shopping, and unlock
            continuous improvement habits.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold">Training</h2>
          <p className="text-white/85">
            We offer short, hands-on modules across three tracks:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-white/85">
            <li>
              <Link href="/learn/genai" className="text-teal-300 underline hover:opacity-90">
                GenAI
              </Link>{" "}
              — practical prompts, workflows, and tools.
            </li>
            <li>
              <Link href="/learn/rpm" className="text-teal-300 underline hover:opacity-90">
                R-PM (Lean Lab)
              </Link>{" "}
              — map routines, reduce waste, and improve flow.
            </li>
            <li>
              <Link href="/learn/finance" className="text-teal-300 underline hover:opacity-90">
                Finance
              </Link>{" "}
              — foundations, investing basics, and valuation intros.
            </li>
          </ul>
          <p className="text-white/85">
            Prefer to browse everything? Visit{" "}
            <Link href="/training" className="text-teal-300 underline hover:opacity-90">
              All Training
            </Link>
            .
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold">How rewards work</h2>
          <p className="text-white/85">
            Earn for shopping and referrals (following our{" "}
            <Link href="/reward-rules" className="text-teal-300 underline hover:opacity-90">
              Reward Rules
            </Link>
            ). Your activity accrues points during beta; withdrawals open after launch.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold">Security & privacy</h2>
          <p className="text-white/85">
            We take privacy seriously. Review our{" "}
            <Link href="/privacy" className="text-teal-300 underline hover:opacity-90">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href="/terms" className="text-teal-300 underline hover:opacity-90">
              Terms of Use
            </Link>
            .
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold">Contact</h2>
          <p className="text-white/85">
            Have a question or partnership idea? Reach out on{" "}
            <ExternalLink href="mailto:support@rewmo.ai">support@rewmo.ai</ExternalLink> or connect with us on{" "}
            <ExternalLink href="https://www.linkedin.com/">LinkedIn</ExternalLink>.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">Attributions & external resources</h2>
          <ul className="list-disc pl-6 space-y-2 text-white/85">
            <li>
              Icons by{" "}
              <ExternalLink href="https://lucide.dev/">
                Lucide
              </ExternalLink>
              .
            </li>
            <li>
              Charts by{" "}
              <ExternalLink href="https://recharts.org/en-US/">
                Recharts
              </ExternalLink>
              .
            </li>
            <li>
              UI built with{" "}
              <ExternalLink href="https://nextjs.org/">
                Next.js
              </ExternalLink>{" "}
              and Tailwind CSS.
            </li>
          </ul>
        </section>
      </main>
    </>
  );
}
