// src/pages/index.tsx
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/firebaseClient";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useRouter } from "next/router";

const NAV_LINKS = [
  { label: "Features", href: "/features" },
  { label: "Shopping", href: "/shopping" },
  { label: "Lean Lab", href: "/lean-lab" },
  { label: "Rewards", href: "/rewards" },
];

export default function HomePage() {
  const [navOpen, setNavOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (authMode === "signin") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
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
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 w-full flex flex-col items-center px-2">
        {/* Logo & Headline */}
        <div className="flex flex-col items-center mt-10">
          <Image
            src="/logos/logo.png"
            alt="Rewmo Logo"
            width={160}
            height={72}
            className="mb-3"
            priority
            style={{ borderRadius: 0 }}
          />
          <h1 className="text-3xl md:text-5xl font-black text-[#FF9151] text-center mb-2">
            Welcome to Rewards Mobile AI
          </h1>
          <p className="text-lg md:text-xl text-white text-center max-w-2xl mb-2">
            The AI-powered hub for rewards, savings, and smarter financial growth.
          </p>
          <p className="text-lg text-orange-300 text-center font-semibold mb-4">
            Earn for shopping, referrals, and every dollar you manage smarter.
          </p>
        </div>

        {/* --- Sign In/Up UI --- */}
        <div className="w-full max-w-md mx-auto border-2 border-dashed border-[#FF9151] bg-[#072b33] rounded-2xl p-6 mb-6 text-center">
          <h2 className="text-xl font-bold text-[#15C5C1] mb-2">
            Get Started — Join or Sign In
          </h2>
          <form onSubmit={handleEmailAuth} className="flex flex-col gap-3 mb-3">
            <input
              className="rounded-md px-4 py-2 border border-[#FF9151] bg-[#003B49] text-white"
              type="email"
              name="email"
              placeholder="Email address"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="rounded-md px-4 py-2 border border-[#FF9151] bg-[#003B49] text-white"
              type="password"
              name="password"
              placeholder="Password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-[#FF9151] hover:bg-[#FFA36C] text-[#003B49] font-bold py-2 rounded-lg shadow transition"
              disabled={loading}
            >
              {authMode === "signin" ? "Sign In" : "Sign Up"}
            </button>
          </form>
          <button
            onClick={handleGoogleSignIn}
            className="w-full bg-[#15C5C1] hover:bg-[#009899] text-white font-bold py-2 rounded-lg shadow transition mb-2"
            disabled={loading}
          >
            Sign in with Google
          </button>
          <div className="text-sm text-[#B6E7EB]">
            {authMode === "signin" ? (
              <>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  className="underline text-[#FF9151]"
                  onClick={() => setAuthMode("signup")}
                  disabled={loading}
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already a member?{" "}
                <button
                  type="button"
                  className="underline text-[#15C5C1]"
                  onClick={() => setAuthMode("signin")}
                  disabled={loading}
                >
                  Sign in
                </button>
              </>
            )}
          </div>
          {error && (
            <div className="text-red-500 mt-2 text-sm">{error}</div>
          )}
        </div>

        {/* --- Beta Alert (optional) --- */}
        <div className="w-full max-w-md mx-auto border-2 border-dashed border-[#FF9151] bg-[#072b33] rounded-2xl p-4 mb-6 text-center">
          <p className="text-[#FF9151] font-bold text-lg mb-1">
            &#128308; Beta is LIVE!
          </p>
          <p className="text-white font-semibold mb-0">
            Your rewards and referrals are being tracked.<br />
            Withdrawals open after launch.<br />
            All points follow the{" "}
            <Link href="/reward-rules" className="underline text-[#15C5C1] hover:text-[#FFA36C]">Reward Rules</Link>.
          </p>
        </div>
        {/* --- Features go here, as before --- */}
        {/* ...your features section blocks... */}
      </main>
      {/* Footer */}
      <footer className="text-[#F7F6F2] text-xs py-4 text-center border-t border-[#072b33] w-full">
        <span>
          © {new Date().getFullYear()} RewmoAI |{" "}
          <Link href="/affiliate-disclosure" className="underline hover:text-[#FFA36C] text-[#FF9151]">Affiliate Disclosure</Link> |{" "}
          <Link href="/privacy" className="underline hover:text-[#FFA36C] text-[#FF9151]">Privacy</Link> |{" "}
          <Link href="/terms" className="underline hover:text-[#FFA36C] text-[#FF9151]">Terms</Link>
        </span>
      </footer>
    </div>
  );
}
