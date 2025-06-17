// src/pages/index.tsx
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/AuthProvider"; // Adjust the path if needed
import { useRouter } from "next/router";

const NAV_LINKS = [
  { label: "Features", href: "/features" },
  { label: "Shopping", href: "/shopping" },
  { label: "Lean Lab", href: "/lean-lab" },
  { label: "Rewards", href: "/rewards" },
];

export default function HomePage() {
  const [navOpen, setNavOpen] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { signInWithGoogle, signInWithEmail, currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      router.push("/dashboard");
    }
  }, [currentUser, router]);

  const handleSignInGoogle = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      alert("Sign in failed: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmail(email, pw);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : typeof err === "string"
          ? err
          : "Sign in failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#003B49] font-sans flex flex-col">
      {/* Navbar */}
      <nav className="w-full flex items-center justify-between px-4 md:px-12 py-2 bg-[#003B49] shadow z-20 relative">
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logos/logo.png"
              alt="Rewmo Logo"
              width={48}
              height={48}
              className="rounded-none"
              priority
            />
            <span className="text-[#FF9151] font-extrabold text-xl tracking-tight hidden sm:inline">
              RewmoAI
            </span>
          </Link>
        </div>
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="text-base font-semibold text-[#B6E7EB] hover:text-[#FF9151]"
            >
              {label}
            </Link>
          ))}
          {currentUser ? (
            <Link
              href="/dashboard"
              className="bg-[#FF9151] text-[#003B49] px-4 py-2 rounded-lg shadow font-bold hover:bg-[#FFA36C]"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <button
                className="bg-[#FF9151] text-[#003B49] px-4 py-2 rounded-lg shadow font-bold hover:bg-[#FFA36C] mr-2"
                onClick={handleSignInGoogle}
              >
                Sign in with Google
              </button>
              <button
                className="bg-[#15C5C1] text-[#003B49] px-4 py-2 rounded-lg shadow font-bold hover:bg-[#14a3a0]"
                onClick={() => setShowEmailModal(true)}
              >
                Email Sign-In
              </button>
            </>
          )}
        </div>
        {/* Hamburger for mobile */}
        <button
          className="md:hidden flex items-center p-2"
          aria-label="Toggle navigation"
          onClick={() => setNavOpen((v) => !v)}
        >
          <svg width={32} height={32} fill="none">
            <rect y={7} width={28} height={3} rx={1.5} fill="#FF9151" />
            <rect y={14} width={28} height={3} rx={1.5} fill="#FF9151" />
            <rect y={21} width={28} height={3} rx={1.5} fill="#FF9151" />
          </svg>
        </button>
        {/* Mobile Menu */}
        {navOpen && (
          <div className="absolute top-full left-0 w-full bg-[#003B49] border-t border-[#15C5C1] flex flex-col items-start md:hidden z-50">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="w-full px-6 py-3 text-lg font-semibold border-b border-[#072b33] text-[#B6E7EB] hover:text-[#FF9151]"
                onClick={() => setNavOpen(false)}
              >
                {label}
              </Link>
            ))}
            {currentUser ? (
              <Link
                href="/dashboard"
                className="w-full px-6 py-3 text-lg font-bold bg-[#FF9151] text-[#003B49] rounded-lg my-1 mx-2"
                onClick={() => setNavOpen(false)}
              >
                Dashboard
              </Link>
            ) : (
              <>
                <button
                  className="w-full px-6 py-3 text-lg font-bold bg-[#FF9151] text-[#003B49] rounded-lg my-1 mx-2"
                  onClick={() => {
                    setNavOpen(false);
                    handleSignInGoogle();
                  }}
                >
                  Sign in with Google
                </button>
                <button
                  className="w-full px-6 py-3 text-lg font-bold bg-[#15C5C1] text-[#003B49] rounded-lg my-1 mx-2"
                  onClick={() => {
                    setNavOpen(false);
                    setShowEmailModal(true);
                  }}
                >
                  Email Sign-In
                </button>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Email Sign-In Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-[#003B49] rounded-xl shadow-lg p-8 w-full max-w-sm border-2 border-[#15C5C1]">
            <h2 className="text-xl font-bold text-center text-[#15C5C1] mb-4">Sign in with Email</h2>
            <form onSubmit={handleEmailSignIn} className="flex flex-col gap-3">
              <input
                type="email"
                className="px-4 py-2 rounded-md border border-[#FF9151] bg-white text-[#003B49] font-semibold"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                className="px-4 py-2 rounded-md border border-[#FF9151] bg-white text-[#003B49] font-semibold"
                placeholder="Password"
                value={pw}
                onChange={e => setPw(e.target.value)}
                required
              />
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <button
                type="submit"
                className="bg-[#FF9151] text-[#003B49] font-bold py-2 rounded-md mt-2 hover:bg-[#FFA36C] transition"
              >
                Sign In
              </button>
              <button
                type="button"
                className="mt-2 underline text-[#15C5C1] text-sm"
                onClick={() => setShowEmailModal(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ... Main content and footer unchanged ... */}
      {/* Paste your original main and footer here */}
      {/* ... (use your previously pasted code for main/footer) ... */}
    </div>
  );
}
