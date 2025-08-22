// src/components/Navbar.tsx

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/lib/AuthProvider";

type NavItem = { href: string; label: string };

const navItems: NavItem[] = [
  { href: "/#features", label: "Features" },
  { href: "/shopping", label: "Shopping" },
  { href: "/learn/lab", label: "Lean Lab" },
  { href: "/rewards", label: "Rewards" },
  { href: "/learn", label: "Training" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const router = useRouter();
  const { currentUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // -----------------------------
  // Lock body scroll when mobile menu opens
  // -----------------------------
  useEffect(() => {
    if (typeof document === "undefined") return;

    const body = document.body;
    let scrollY = 0;

    if (isOpen) {
      // Save current scroll position so we can restore it
      scrollY = window.scrollY || window.pageYOffset;
      body.style.position = "fixed";
      body.style.top = `-${scrollY}px`;
      body.style.left = "0";
      body.style.right = "0";
      body.style.width = "100%";
      body.style.overflow = "hidden";
    } else {
      // Restore scroll position and body styles
      const top = body.style.top;
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      body.style.overflow = "";
      if (top) {
        const y = Math.abs(parseInt(top, 10)) || 0;
        window.scrollTo(0, y);
      }
    }

    // Cleanup just in case the component unmounts while open
    return () => {
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      body.style.overflow = "";
    };
  }, [isOpen]);

  // Build a Sign In URL that returns user to where they started
  const signInHref = useMemo(() => {
    const ret = router.asPath || "/account";
    return `/signin?redirect=${encodeURIComponent(ret)}`;
  }, [router.asPath]);

  // Helpers
  const isActive = (href: string) =>
    href !== "/"
      ? router.asPath === href || router.asPath.startsWith(href)
      : router.asPath === "/";

  const closeMenuAndNavigate = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#003B49] border-b border-[#0C5560]">
      <nav className="mx-auto max-w-7xl px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/logo.svg"
              alt="Rewmo"
              className="h-7 w-auto md:h-8"
              onError={(e) => {
                // fallback if /logo.svg doesn't exist
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
            <span className="text-white font-extrabold tracking-tight text-xl md:text-2xl">
              RewmoAI
            </span>
          </Link>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition ${
                isActive(item.href)
                  ? "text-[#FF9151]"
                  : "text-[#B6E7EB] hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* Account visible always */}
          <Link
            href="/account"
            className="rounded-lg bg-[#15C5C1] text-[#003B49] px-3.5 py-2 text-sm font-bold hover:opacity-90 transition"
          >
            Account
          </Link>

          {/* Sign In / Out */}
          {currentUser ? (
            <button
              onClick={() => logout()}
              className="rounded-lg bg-[#FF6A00] text-white px-3.5 py-2 text-sm font-bold hover:opacity-90 transition"
            >
              Sign Out
            </button>
          ) : (
            <Link
              href={signInHref}
              className="rounded-lg bg-[#FF6A00] text-white px-3.5 py-2 text-sm font-bold hover:opacity-90 transition"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          aria-label="Toggle menu"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg bg-[#FF6A00] text-white"
          onClick={() => setIsOpen((s) => !s)}
        >
          <span className="sr-only">Toggle navigation</span>
          {/* simple icon */}
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
            <path
              d="M4 7h16M4 12h16M4 17h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </nav>

      {/* Mobile menu (off-canvas overlay) */}
      <div
        id="mobile-menu"
        className={`md:hidden fixed inset-0 z-40 bg-[#003B49] transition-opacity duration-200 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="px-6 pt-20 pb-10 flex flex-col gap-4">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => closeMenuAndNavigate(item.href)}
              className={`text-lg text-left font-semibold px-3 py-3 rounded-lg transition ${
                isActive(item.href)
                  ? "bg-[#0C5560] text-white"
                  : "text-[#B6E7EB] hover:bg-[#0C5560] hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}

          <div className="h-px bg-[#0C5560] my-2" />

          <button
            onClick={() => closeMenuAndNavigate("/account")}
            className="text-lg text-left font-bold px-3 py-3 rounded-lg bg-[#15C5C1] text-[#003B49]"
          >
            Account
          </button>

          {currentUser ? (
            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="mt-1 text-lg text-left font-bold px-3 py-3 rounded-lg bg-[#FF6A00] text-white"
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={() => closeMenuAndNavigate(signInHref)}
              className="mt-1 text-lg text-left font-bold px-3 py-3 rounded-lg bg-[#FF6A00] text-white"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Clickable backdrop to close */}
        <button
          className="absolute inset-0 -z-10"
          aria-hidden="true"
          onClick={() => setIsOpen(false)}
        />
      </div>
    </header>
  );
}
