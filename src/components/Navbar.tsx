// src/components/Navbar.tsx

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/lib/AuthProvider";
import { Menu, X } from "lucide-react";

const ADMIN_EMAILS = [
  "gary.reinhold@leafpays.com",
  // Add more admin emails as needed
];

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/features", label: "Features" },
  { href: "/shopping", label: "Shopping" },
  { href: "/rewards", label: "Rewards" },
  { href: "/learning-lab/intro", label: "Learning Lab" }, // NEW
  { href: "/dashboard", label: "Dashboard" },
];

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin = currentUser && ADMIN_EMAILS.includes(currentUser.email || "");

  // HIDE NAV ON LANDING IF NOT SIGNED IN
  if (router.pathname === "/" && !currentUser) return null;

  const isActive = (href: string) => router.pathname === href;

  return (
    <nav className="w-full bg-[#003B49] text-[#15C5C1] shadow px-4 py-2 flex items-center justify-between z-30 relative">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logos/logo.png" alt="RewmoAI" className="h-9 w-9 rounded-full border border-[#FF9151]" />
          <span className="font-bold text-lg tracking-tight text-[#FF9151]">RewmoAI</span>
        </Link>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-5 items-center">
        {navLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`font-medium hover:text-[#FFA36C] transition ${
              isActive(link.href) ? "text-[#FFA36C] underline" : ""
            }`}
          >
            {link.label}
          </Link>
        ))}
        {isAdmin && (
          <Link href="/admin" className="font-medium hover:text-[#15C5C1] transition">
            Admin
          </Link>
        )}
        <span className="ml-4 text-sm text-[#B6E7EB]">{currentUser?.email}</span>
        {currentUser && (
          <button
            onClick={logout}
            className="ml-2 px-3 py-1 rounded bg-[#FF9151] hover:bg-[#FFA36C] text-[#003B49] text-sm"
          >
            Sign Out
          </button>
        )}
      </div>

      {/* Mobile Hamburger */}
      <div className="flex md:hidden items-center">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="focus:outline-none p-1"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#003B49] border-t border-[#15C5C1]/40 shadow-lg z-40 animate-fade-in">
          <div className="flex flex-col items-start px-6 py-4 gap-3">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-medium w-full py-1 hover:text-[#FFA36C] transition ${
                  isActive(link.href) ? "text-[#FFA36C] underline" : ""
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin"
                className="font-medium w-full py-1 hover:text-[#15C5C1] transition"
                onClick={() => setMobileOpen(false)}
              >
                Admin
              </Link>
            )}
            <div className="flex items-center w-full mt-3">
              <span className="text-sm text-[#B6E7EB] flex-1">{currentUser?.email}</span>
              {currentUser && (
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    logout();
                  }}
                  className="ml-2 px-3 py-1 rounded bg-[#FF9151] hover:bg-[#FFA36C] text-[#003B49] text-sm"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
