// src/components/SiteHeader.tsx
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";

/** Palette tuned for contrast on dark bg */
const BG = "#003B49";            // Lighter teal - better visibility
const BG_DARK = "#072b33";       // For mobile menu background
const FG = "#EAF5F6";
const ACCENT = "#15C5C1";
const CTA = "#FF9151";

const links = [
  { href: "/lean-lab", label: "Lean Lab" },
  { href: "/shopping", label: "Shopping" },
  { href: "/rewards", label: "Rewards" },
  { href: "/about", label: "About" },
];

// External link to AI Tools directory
const externalLinks = [
  { href: "https://aitools.rewmo.ai", label: "AI Tools", external: true },
];

export default function SiteHeader() {
  const { pathname } = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{ backgroundColor: BG, borderColor: "#0A3A40" }}
      role="banner"
    >
      <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between" aria-label="Main">
        {/* Logo + Brand */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2" aria-label="RewmoAI Home">
            <Image
              src="/logos/logo.png"
              alt="RewmoAI"
              width={28}
              height={28}
              className="rounded"
            />
            <span className="font-extrabold tracking-tight" style={{ color: CTA }}>
              RewmoAI
            </span>
          </Link>
        </div>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-2">
          {links.map(({ href, label }) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={[
                    "px-3 py-2 rounded-lg text-sm font-semibold outline-none transition",
                    active
                      ? "bg-[#07333B] text-white"
                      : "text-[#CFEAEC] hover:text-white hover:bg-[#07333B]",
                    "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#15C5C1] focus-visible:ring-offset-[#001F24]"
                  ].join(" ")}
                >
                  {label}
                </Link>
              </li>
            );
          })}
          <li className="ml-2">
            <a
              href="https://aitools.rewmo.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-lg text-sm font-semibold text-[#15C5C1] hover:text-white hover:bg-[#07333B] transition outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#15C5C1] focus-visible:ring-offset-[#001F24]"
            >
              AI Tools ↗
            </a>
          </li>
          <li className="ml-2">
            <Link
              href="/account"
              className="px-3 py-2 rounded-lg text-sm font-bold"
              style={{
                backgroundColor: CTA,
                color: "#062025",
                border: "2px solid " + CTA,
              }}
            >
              Account
            </Link>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[#0A3A40] focus-visible:ring-2 focus-visible:ring-[#15C5C1] focus-visible:ring-offset-2 focus-visible:ring-offset-[#001F24]"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          style={{ color: FG }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            {open ? (
              <path strokeWidth="2" strokeLinecap="round" d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path strokeWidth="2" strokeLinecap="round" d="M3 6h18M3 12h18M3 18h18" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile drawer - FIXED: Better background and text colors */}
      {open && (
        <div
          className="md:hidden border-t"
          style={{ backgroundColor: BG_DARK, borderColor: "#15C5C1" }}
        >
          <ul className="px-4 py-4 space-y-2">
            {links.map(({ href, label }) => {
              const active = pathname === href || (href !== "/" && pathname.startsWith(href));
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    className={[
                      "block w-full px-4 py-3 rounded-xl text-base font-semibold transition",
                      active
                        ? "bg-[#15C5C1] text-[#003B49]"
                        : "text-white bg-[#003B49] hover:bg-[#004d5c]"
                    ].join(" ")}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
            <li className="pt-2">
              <a
                href="https://aitools.rewmo.ai"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="block w-full px-4 py-3 rounded-xl text-base font-semibold text-[#15C5C1] bg-[#003B49] hover:bg-[#004d5c] transition"
              >
                🧰 AI Tools Directory ↗
              </a>
            </li>
            <li className="pt-2">
              <Link
                href="/account"
                onClick={() => setOpen(false)}
                className="block w-full text-center px-4 py-3 rounded-xl text-base font-bold transition hover:opacity-90"
                style={{
                  backgroundColor: CTA,
                  color: "#003B49",
                }}
              >
                Account
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}