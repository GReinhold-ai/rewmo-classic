// src/components/Navbar.tsx
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthProvider";
import { auth } from "@/lib/firebaseClient";
import { signOut as fbSignOut } from "firebase/auth";

export default function Navbar() {
  const router = useRouter();
  const { currentUser } = useAuth();

  const [open, setOpen] = useState(false);
  const [trainingOpen, setTrainingOpen] = useState(false);

  // Lock body scroll when the mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [open]);

  const handleSignOut = async () => {
    try {
      await fbSignOut(auth);
      setOpen(false);
      setTrainingOpen(false);
      router.push("/");
    } catch (e) {
      console.error("Sign out failed:", e);
    }
  };

  const NavLink = ({
    href,
    children,
    className = "",
    onClick,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
  }) => (
    <Link
      href={href}
      className={`px-3 py-2 hover:opacity-90 transition ${className}`}
      onClick={() => {
        onClick?.();
        setOpen(false);
        setTrainingOpen(false);
      }}
    >
      {children}
    </Link>
  );

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-[#003B49]/95 backdrop-blur text-white">
      <nav className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
        {/* Left: brand */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Rewmo"
              className="h-7 w-7 md:h-8 md:w-8 rounded"
            />
            <span className="font-semibold text-lg md:text-xl">RewmoAI</span>
          </Link>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-2">
          <NavLink href="/features">Features</NavLink>
          <NavLink href="/shopping">Shopping</NavLink>

          {/* Training dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setTrainingOpen(true)}
            onMouseLeave={() => setTrainingOpen(false)}
          >
            <button
              className="px-3 py-2 hover:opacity-90 transition"
              onClick={() => setTrainingOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={trainingOpen}
            >
              Training ▾
            </button>
            {trainingOpen && (
              <div
                role="menu"
                className="absolute mt-2 w-56 rounded-lg bg-white text-[#003B49] shadow-lg overflow-hidden"
              >
                <NavLink href="/learn/genai" className="block w-full px-4 py-3">
                  AI Training
                </NavLink>
                <NavLink href="/learn/tqm" className="block w-full px-4 py-3">
                  TQM Training
                </NavLink>
              </div>
            )}
          </div>

          <NavLink href="/rewards">Rewards</NavLink>
          <NavLink href="/about">About</NavLink>

          {currentUser ? (
            <>
              <NavLink
                href="/account"
                className="ml-2 rounded-lg bg-teal-500 text-white font-semibold"
              >
                Account
              </NavLink>
              <button
                onClick={handleSignOut}
                className="ml-2 px-3 py-2 rounded-lg bg-orange-500 font-semibold hover:opacity-90 transition"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <NavLink
                href="/account"
                className="ml-2 rounded-lg bg-teal-500 text-white font-semibold"
              >
                Account
              </NavLink>
              <NavLink
                href="/signin"
                className="ml-2 rounded-lg bg-orange-500 text-white font-semibold"
              >
                Sign In
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded bg-[#FF6A00] focus:outline-none focus:ring-2 focus:ring-white/60"
          aria-label="Open menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Open menu</span>
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      {/* Mobile sheet */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          {/* Panel */}
          <div className="absolute right-0 top-0 h-full w-72 max-w-[85vw] bg-[#003B49] text-white shadow-xl p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-lg">Menu</span>
              <button
                className="h-9 w-9 inline-flex items-center justify-center rounded bg-white/10"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col">
              <NavLink href="/features" className="py-3">
                Features
              </NavLink>
              <NavLink href="/shopping" className="py-3">
                Shopping
              </NavLink>

              {/* Training group */}
              <div className="mt-2">
                <div className="px-3 py-2 text-sm uppercase tracking-wide text-white/70">
                  Training
                </div>
                <NavLink href="/learn/genai" className="py-3">
                  AI Training
                </NavLink>
                <NavLink href="/learn/tqm" className="py-3">
                  TQM Training
                </NavLink>
              </div>

              <NavLink href="/rewards" className="py-3">
                Rewards
              </NavLink>
              <NavLink href="/about" className="py-3">
                About
              </NavLink>

              <div className="h-px my-3 bg-white/15" />

              {currentUser ? (
                <>
                  <NavLink
                    href="/account"
                    className="py-3 rounded-lg bg-teal-500 text-center font-semibold"
                  >
                    Account
                  </NavLink>
                  <button
                    onClick={handleSignOut}
                    className="mt-2 py-3 rounded-lg bg-orange-500 font-semibold"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    href="/account"
                    className="py-3 rounded-lg bg-teal-500 text-center font-semibold"
                  >
                    Account
                  </NavLink>
                  <NavLink
                    href="/signin"
                    className="mt-2 py-3 rounded-lg bg-orange-500 text-center font-semibold"
                  >
                    Sign In
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
