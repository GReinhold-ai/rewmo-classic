import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/lib/AuthProvider";

const linkBase =
  "inline-flex items-center px-3 py-2 text-sm font-medium transition hover:opacity-90";

const DesktopLink = ({
  href,
  children,
  active,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) => (
  <Link
    href={href}
    className={`${linkBase} ${
      active ? "text-white" : "text-white/90"
    } hover:text-white`}
  >
    {children}
  </Link>
);

export default function Navbar() {
  const router = useRouter();
  const { currentUser } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    if (menuOpen) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, [menuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    const close = () => setMenuOpen(false);
    router.events.on("routeChangeStart", close);
    return () => router.events.off("routeChangeStart", close);
  }, [router.events]);

  const navLinks = [
    { name: "Features", href: "/features" },
    { name: "Shopping", href: "/shopping" },
    { name: "Lean Lab", href: "/learn/lab" },
    { name: "Rewards", href: "/rewards" },
    { name: "About", href: "/about" },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-[#003B49] border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="h-7 w-7 rounded-md bg-white/10 flex items-center justify-center">
            {/* simple logo square */}
            <span className="text-white text-xs font-bold">R</span>
          </div>
          <span className="text-white font-semibold text-lg tracking-wide">
            RewmoAI
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map((l) => (
            <DesktopLink
              key={l.href}
              href={l.href}
              active={router.pathname.startsWith(l.href)}
            >
              {l.name}
            </DesktopLink>
          ))}

          {/* Training dropdown (desktop) */}
          <div className="relative group">
            <button
              className={`${linkBase} text-white/90 hover:text-white`}
              type="button"
            >
              Training
              <svg
                className="ml-1 h-4 w-4 opacity-80"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <div className="absolute left-0 mt-2 min-w-[12rem] rounded-xl border border-white/10 bg-[#043846] shadow-lg hidden group-hover:block">
              <Link
                href="/learn"
                className="block px-4 py-2.5 text-sm text-white/90 hover:text-white hover:bg-white/5"
              >
                All Training
              </Link>
              <Link
                href="/learn/genai"
                className="block px-4 py-2.5 text-sm text-white/90 hover:text-white hover:bg-white/5"
              >
                GenAI
              </Link>
              <Link
                href="/learn/tqm"
                className="block px-4 py-2.5 text-sm text-white/90 hover:text-white hover:bg-white/5"
              >
                TQM
              </Link>
            </div>
          </div>
        </nav>

        {/* Right: actions */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/account"
            className="inline-flex items-center px-3 py-2 rounded-lg bg-[#15C5C1] text-white text-sm font-semibold hover:opacity-90"
          >
            Account
          </Link>
          {!currentUser && (
            <Link
              href="/signin?redirect=/account"
              className="inline-flex items-center px-3 py-2 rounded-lg bg-[#FF6A00] text-white text-sm font-semibold hover:opacity-90"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-md bg-white/10 text-white hover:bg-white/15"
          aria-label="Toggle menu"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            {menuOpen ? (
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            ) : (
              <path
                fillRule="evenodd"
                d="M3 5h14a1 1 0 100-2H3a1 1 0 000 2zm14 4H3a1 1 0 000 2h14a1 1 0 100-2zM3 15h14a1 1 0 100-2H3a1 1 0 000 2z"
                clipRule="evenodd"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile sheet */}
      <div
        className={`md:hidden transition-[max-height] duration-300 overflow-hidden bg-[#003B49] border-t border-white/10 ${
          menuOpen ? "max-h-[60vh]" : "max-h-0"
        }`}
      >
        <div className="px-4 py-3 space-y-1">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block px-3 py-2 text-white/90 hover:text-white rounded-lg hover:bg-white/10"
            >
              {l.name}
            </Link>
          ))}

          {/* Training (mobile as simple links) */}
          <div className="border-t border-white/10 my-2" />
          <div className="px-1 pb-1">
            <div className="text-xs uppercase tracking-wide text-white/60 px-2 pb-1">
              Training
            </div>
            <Link
              href="/learn"
              className="block px-3 py-2 text-white/90 hover:text-white rounded-lg hover:bg-white/10"
            >
              All Training
            </Link>
            <Link
              href="/learn/genai"
              className="block px-3 py-2 text-white/90 hover:text-white rounded-lg hover:bg-white/10"
            >
              GenAI
            </Link>
            <Link
              href="/learn/tqm"
              className="block px-3 py-2 text-white/90 hover:text-white rounded-lg hover:bg-white/10"
            >
              TQM
            </Link>
          </div>

          <div className="border-t border-white/10 my-2" />

          <div className="flex items-center gap-2 pt-2">
            <Link
              href="/account"
              className="flex-1 inline-flex items-center justify-center px-3 py-2 rounded-lg bg-[#15C5C1] text-white font-semibold"
            >
              Account
            </Link>
            <Link
              href="/signin?redirect=/account"
              className="flex-1 inline-flex items-center justify-center px-3 py-2 rounded-lg bg-[#FF6A00] text-white font-semibold"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
