import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/lib/AuthProvider";
import { Menu, X } from "lucide-react"; // Lucide icons; run: npm install lucide-react

const ADMIN_EMAILS = ["you@example.com", "gary.reinhold@leafpays.com"]; // Add admin emails

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/features", label: "Features" },
  { href: "/shopping", label: "Shopping" },
  { href: "/rewards", label: "Rewards" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function Navbar() {
  const { currentUser, signInWithGoogle, logout } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin = currentUser && ADMIN_EMAILS.includes(currentUser.email || "");

  // Hide navbar if not signed in
  if (!currentUser) return null;

  // Highlight active link (optional)
  const isActive = (href: string) => router.pathname === href;

  return (
    <nav className="w-full bg-black text-white shadow px-4 py-2 flex items-center justify-between z-30 relative">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logos/logo.png" alt="RewmoAI" className="h-9 w-9 rounded-full border border-orange-500" />
          <span className="font-bold text-lg tracking-tight text-orange-400">RewmoAI</span>
        </Link>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-5 items-center">
        {navLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`font-medium hover:text-orange-400 transition ${
              isActive(link.href) ? "text-orange-400 underline" : ""
            }`}
          >
            {link.label}
          </Link>
        ))}
        {isAdmin && (
          <Link href="/admin" className="font-medium hover:text-orange-500 transition">
            Admin
          </Link>
        )}
        <span className="ml-4 text-sm text-gray-200">{currentUser.email}</span>
        <button
          onClick={logout}
          className="ml-2 px-3 py-1 rounded bg-orange-500 hover:bg-orange-600 text-white text-sm"
        >
          Sign Out
        </button>
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
        <div className="md:hidden absolute top-full left-0 w-full bg-black border-t border-gray-800 shadow-lg z-40 animate-fade-in">
          <div className="flex flex-col items-start px-6 py-4 gap-3">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-medium w-full py-1 hover:text-orange-400 transition ${
                  isActive(link.href) ? "text-orange-400 underline" : ""
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin"
                className="font-medium w-full py-1 hover:text-orange-500 transition"
                onClick={() => setMobileOpen(false)}
              >
                Admin
              </Link>
            )}
            <div className="flex items-center w-full mt-3">
              <span className="text-sm text-gray-200 flex-1">{currentUser.email}</span>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  logout();
                }}
                className="ml-2 px-3 py-1 rounded bg-orange-500 hover:bg-orange-600 text-white text-sm"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
