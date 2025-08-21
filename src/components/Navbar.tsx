// src/components/Navbar.tsx
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { name: "Features", href: "/#features" },
  { name: "Shopping", href: "/shopping" },
  { name: "Lean Lab", href: "/enterpriseai" },
  { name: "Rewards", href: "/#rewards" },
  { name: "Training", href: "/learn" },   // or "/training" if you prefer
  { name: "About", href: "/about" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="
        sticky top-0 z-50 bg-[#003B49]/95 backdrop-blur supports-[backdrop-filter]:backdrop-blur
        pt-[env(safe-area-inset-top)]
      "
      role="banner"
    >
      {/* top bar */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logos/logo.png"
              alt="RewmoAI"
              width={36}
              height={36}
              className="rounded-md border border-[#15C5C1]/30"
              priority
            />
            <span className="sr-only">RewmoAI</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((l) => (
              <Link
                key={l.name}
                href={l.href}
                className="text-[15px] font-semibold text-[#FF9151] hover:text-[#FFB98E] transition"
              >
                {l.name}
              </Link>
            ))}
          </nav>

          {/* Right side actions (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/account"
              className="inline-flex items-center rounded-lg bg-[#0fa6a2] px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-[#15C5C1] active:translate-y-px transition"
            >
              Account
            </Link>

            <Link
              href="/api/auth/signin"
              className="inline-flex items-center rounded-lg bg-[#FF6B00] px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-[#ff7d22] active:translate-y-px transition"
            >
              Sign In
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-[#FF9151] hover:bg-white/5 focus:outline-none"
            aria-label="Open main menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg className={`h-6 w-6 ${open ? "hidden" : "block"}`} viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <svg className={`h-6 w-6 ${open ? "block" : "hidden"}`} viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div
        className={`
          md:hidden ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}
          transition-opacity duration-200
        `}
      >
        {/* dim backdrop */}
        <div
          className="fixed inset-0 bg-black/40"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
        {/* sheet */}
        <div className="fixed inset-x-0 top-[calc(env(safe-area-inset-top)+56px)] z-50 mx-auto max-w-6xl px-4">
          <div className="rounded-2xl border border-white/10 bg-[#072b33] p-3 shadow-2xl">
            <nav className="grid gap-1">
              {navLinks.map((l) => (
                <Link
                  key={l.name}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-base font-semibold text-[#B6E7EB] hover:bg-white/5 hover:text-white"
                >
                  {l.name}
                </Link>
              ))}

              {/* Mobile actions */}
              <div className="mt-1 grid grid-cols-2 gap-2">
                <Link
                  href="/account"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center rounded-lg bg-[#0fa6a2] px-4 py-3 text-base font-bold text-white shadow hover:bg-[#15C5C1]"
                >
                  Account
                </Link>

                <Link
                  href="/api/auth/signin"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center rounded-lg bg-[#FF6B00] px-4 py-3 text-base font-bold text-white shadow hover:bg-[#ff7d22]"
                >
                  Sign In
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
