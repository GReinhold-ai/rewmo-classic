import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/lib/AuthProvider";

const ADMIN_EMAILS = ["you@example.com"]; // Add any admin emails here

export default function Navbar() {
  const { currentUser, signInWithGoogle, logout } = useAuth();
  const router = useRouter();
  const isAdmin = currentUser && ADMIN_EMAILS.includes(currentUser.email || "");

  return (
    <nav className="w-full bg-black text-white shadow flex items-center px-4 py-2 justify-between">
      {/* Logo + Home */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logos/logo.png" alt="RewmoAI" className="h-9 w-9 rounded-full border border-orange-500" />
          <span className="font-bold text-lg tracking-tight text-orange-400">RewmoAI</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex gap-4 items-center">
        <Link href="/about" className="hover:text-orange-400 font-medium">About</Link>
        <Link href="/features" className="hover:text-orange-400 font-medium">Features</Link>
        <Link href="/shopping" className="hover:text-orange-400 font-medium">Shopping</Link>
        <Link href="/rewards" className="hover:text-orange-400 font-medium">Rewards</Link>
        <Link href="/dashboard" className="hover:text-orange-400 font-medium">Dashboard</Link>
        {isAdmin && (
          <Link href="/admin" className="hover:text-orange-500 font-medium">Admin</Link>
        )}
      </div>

      {/* Auth Button(s) */}
      <div>
        {currentUser ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-200">{currentUser.email}</span>
            <button
              onClick={logout}
              className="ml-1 px-3 py-1 rounded bg-orange-500 hover:bg-orange-600 text-white text-sm"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={signInWithGoogle}
            className="px-4 py-1 rounded bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
}
