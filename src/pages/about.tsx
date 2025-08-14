// src/pages/about.tsx
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

export default function About() {
  return (
    <>
      <Head>
        <title>About • RewmoAI</title>
        <meta
          name="description"
          content="RewmoAI turns everyday payments into rewards, wealth, and AI power. Learn our vision, mission, and principles."
        />
        <link rel="canonical" href="https://rewmo.ai/about" />
        <meta property="og:title" content="About • RewmoAI" />
        <meta
          property="og:description"
          content="RewmoAI turns everyday payments into rewards, wealth, and AI power. Learn our vision, mission, and principles."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rewmo.ai/about" />
        <meta property="og:site_name" content="RewmoAI" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div className="flex min-h-screen flex-col bg-[#07343A] font-sans text-[#E9F7FF]">
        <main className="flex-1 px-4 py-10">
          {/* Logo + Title */}
          <div className="mx-auto max-w-3xl text-center">
            <Image
              src="/logos/logo.png"
              alt="RewmoAI logo"
              width={120}
              height={120}
              className="mx-auto mb-4 rounded-full border-2 border-[#FF6B00]"
              priority
            />
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-[#FF6B00]">
              About RewmoAI
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-[#CFEAF6]">
              We combine a rewards engine with EnterpriseAI agents to help you
              earn more, automate the boring stuff, and make smarter decisions—
              for just $10/month. No contracts. Cancel anytime.
            </p>

            <div className="mt-5 flex items-center justify-center gap-3">
              <a
                href="https://www.linkedin.com/in/rewmoai/recent-activity/newsletter/"
                target="_blank"
                rel="noopener"
                className="inline-flex items-center rounded-md border border-white/20 px-4 py-2 text-sm font-semibold hover:bg-white/5"
              >
                Blog (LinkedIn Newsletter)
              </a>
              <Link
                href="/"
                className="inline-flex items-center rounded-md bg-[#FF6B00] px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-[#E55F00] focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
              >
                Start for $10/month →
              </Link>
            </div>
          </div>

          {/* Cards */}
          <section className="mx-auto mt-10 max-w-4xl space-y-8">
            <div className="rounded-2xl bg-white/5 p-8 ring-1 ring-white/10">
              <h2 className="text-2xl font-bold text-[#20C3C0]">Our Vision</h2>
              <p className="mt-3 text-lg text-[#CFEAF6]">
                <span className="font-bold text-[#FF6B00]">
                  To empower everyone—individuals, families, and small
                  businesses—
                </span>{" "}
                to unlock hidden value in everyday spending and daily routines,
                making smarter, more sustainable financial choices accessible to
                all.
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 p-8 ring-1 ring-white/10">
              <h2 className="text-2xl font-bold text-[#20C3C0]">Our Mission</h2>
              <p className="mt-3 text-lg text-[#CFEAF6]">
                <span className="font-bold text-[#FF6B00]">RewmoAI</span>{" "}
                delivers powerful AI-driven rewards and practical process
                management tools, helping our members earn more, save more, and
                do better—one purchase and one workflow at a time.
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 p-8 ring-1 ring-white/10">
              <h2 className="text-2xl font-bold text-[#20C3C0]">
                Guiding Principles
              </h2>
              <ul className="mt-4 space-y-4 text-[#CFEAF6]">
                <li>
                  <span className="font-bold text-[#FF6B00]">
                    1) Simplicity First:
                  </span>{" "}
                  clear, direct value—no jargon, no barriers.
                </li>
                <li>
                  <span className="font-bold text-[#FF6B00]">
                    2) Empower Through AI:
                  </span>{" "}
                  technology that serves you—boost savings, optimize routines,
                  reveal opportunities.
                </li>
                <li>
                  <span className="font-bold text-[#FF6B00]">
                    3) Quality & Integrity:
                  </span>{" "}
                  Lean + TQM—continuous improvement in every feature and
                  interaction.
                </li>
                <li>
                  <span className="font-bold text-[#FF6B00]">
                    4) Transparency & Trust:
                  </span>{" "}
                  how rewards work, how data is used, and how we make money.
                </li>
                <li>
                  <span className="font-bold text-[#FF6B00]">
                    5) Inclusive Impact:
                  </span>{" "}
                  tools that help everyone get ahead—businesses and families
                  alike.
                </li>
              </ul>
            </div>

            {/* Promise */}
            <div className="rounded-2xl bg-[#0B454B] p-8 ring-1 ring-white/10">
              <h3 className="text-xl font-bold text-[#20C3C0]">
                The RewmoAI Promise
              </h3>
              <p className="mt-2 text-[#CFEAF6]">
                More than just rewards—RewmoAI is your partner in a smarter,
                more empowered financial future.
              </p>
            </div>

            {/* Team teaser */}
            <div className="text-center text-[#CFEAF6]">
              <p>
                RewmoAI was built for you—by people who believe everyone should
                have a path to smarter money and better results.
              </p>
              <Link
                href="/team"
                className="mt-2 inline-block font-semibold text-[#20C3C0] underline hover:text-[#FF6B00]"
              >
                Meet the team &gt;
              </Link>
            </div>

            {/* CTA */}
            <div className="rounded-2xl bg-white/5 p-6 text-center ring-1 ring-white/10">
              <h4 className="text-lg font-bold">
                Stop wasting potential. Start earning more every day.
              </h4>
              <div className="mt-4 flex items-center justify-center gap-3">
                <Link
                  href="/"
                  className="inline-flex items-center rounded-md bg-[#FF6B00] px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-[#E55F00]"
                >
                  Start for $10/month →
                </Link>
                <Link
                  href="/faq"
                  className="inline-flex items-center rounded-md border border-white/20 px-4 py-2 text-sm font-semibold hover:bg-white/5"
                >
                  FAQ
                </Link>
              </div>
            </div>
          </section>
        </main>

        {/* Local footer (optional, if your layout doesn’t already include one) */}
        <footer className="border-t border-white/10 bg-[#07343A] py-5 text-center text-xs text-[#CFEAF6]">
          © {new Date().getFullYear()} RewmoAI •{" "}
          <Link
            href="/affiliate-disclosure"
            className="text-[#FF6B00] underline hover:text-[#E55F00]"
          >
            Affiliate Disclosure
          </Link>{" "}
          •{" "}
          <a
            href="https://rewmo.ai/privacy"
            target="_blank"
            rel="noopener"
            className="text-[#FF6B00] underline hover:text-[#E55F00]"
          >
            Privacy
          </a>{" "}
          •{" "}
          <Link
            href="/terms"
            className="text-[#FF6B00] underline hover:text-[#E55F00]"
          >
            Terms
          </Link>
        </footer>
      </div>
    </>
  );
}
