import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { onAuthStateChanged, signOut as fbSignOut, type User } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";

function MenuItem({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-3 py-2 text-sm rounded-md hover:bg-white/10 focus:bg-white/10"
    >
      {children}
    </Link>
  );
}

export default function Navbar() {
  const router = useRouter();

  // Auth (lightweight)
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  const handleSignOut = async () => {
    await fbSignOut(auth);
    router.push("/signin");
  };

  // Mobile menu lock (optional UX nicety)
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = mobileOpen ? "hidden" : prev || "";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [mobileOpen]);

  // Training dropdown state
  const [trainOpen, setTrainOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<number | null>(null);

  const openTrain = () => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    setTrainOpen(true);
  };
  const scheduleClose = () => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setTrainOpen(false), 120);
  };

  // Close on route change
  useEffect(() => {
    setTrainOpen(false);
    setMobileOpen(false);
  }, [router.asPath]);

  // Click outside to close
  useEffect(() => {
    if (!trainOpen) return;
    const onDown = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setTrainOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [trainOpen]);

  return (
    <header className="sticky top-0 z-50 bg-[#003B49]/95 backdrop-blur supports-[backdrop-filter]:bg-[#003B49]/80">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 text-white">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logos/logo.png"
            alt="RewmoAI"
            width={28}
            height={28}
            className="h-7 w-7"
            priority
          />
          <span className="font-bold text-lg text-[#FF9151]">RewmoAI</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-4 md:flex">
          <Link href="/features" className="hover:underline">
            Features
          </Link>
          <Link href="/shopping" className="hover:underline">
            Shopping
          </Link>

          {/* Training Dropdown (hover + click) */}
          <div
            ref={menuRef}
            className="relative"
            onMouseEnter={openTrain}
            onMouseLeave={scheduleClose}
          >
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={trainOpen}
              onClick={() => setTrainOpen((v) => !v)}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 hover:bg-white/10 focus:bg-white/10"
            >
              Training
              <svg
                className={`h-3 w-3 transition-transform ${trainOpen ? "rotate-180" : ""}`}
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M5.25 7.5l4.5 4.5 4.5-4.5" />
              </svg>
            </button>

            {trainOpen && (
              <div
                role="menu"
                className="absolute left-0 top-full mt-2 w-56 rounded-lg bg-[#043846] shadow-lg ring-1 ring-white/10 focus:outline-none z-[60]"
                onMouseEnter={openTrain}
                onMouseLeave={scheduleClose}
              >
                <MenuItem href="/learn" onClick={() => setTrainOpen(false)}>
                  All Training
                </MenuItem>
                <div className="mx-3 my-1 h-px bg-white/10" />
                <MenuItem href="/learn/genai" onClick={() => setTrainOpen(false)}>
                  AI Training
                </MenuItem>
                <MenuItem href="/learn/tqm" onClick={() => setTrainOpen(false)}>
                  TQM Training
                </MenuItem>
                <MenuItem href="/learn/finance" onClick={() => setTrainOpen(false)}>
                  Finance Training
                </MenuItem>
              </div>
            )}
          </div>

          <Link href="/rewards" className="hover:underline">
            Rewards
          </Link>
          <Link href="/about" className="hover:underline">
            About
          </Link>

          {user ? (
            <>
              <Link
                href="/account"
                className="rounded-md bg-teal-500 px-3 py-1 text-sm font-semibold text-[#003B49] hover:bg-teal-400"
              >
                Account
              </Link>
              <button
                onClick={handleSignOut}
                className="rounded-md bg-orange-500 px-3 py-1 text-sm font-semibold hover:bg-orange-600"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/signin"
              className="rounded-md bg-orange-500 px-3 py-1 text-sm font-semibold hover:bg-orange-600"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden rounded-md p-2 hover:bg-white/10"
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      {/* Mobile sheet */}
      {mobileOpen && (
        <div className="md:hidden">
          <div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 z-50 w-72 bg-[#043846] p-4 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#FF9151]">Menu</span>
              <button
                aria-label="Close menu"
                className="rounded-md p-2 hover:bg-white/10"
                onClick={() => setMobileOpen(false)}
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <nav className="mt-4 space-y-1">
              <Link href="/features" className="block rounded-md px-3 py-2 hover:bg-white/10">
                Features
              </Link>
              <Link href="/shopping" className="block rounded-md px-3 py-2 hover:bg-white/10">
                Shopping
              </Link>

              <div className="rounded-md bg-white/5">
                <div className="px-3 py-2 text-xs uppercase tracking-wide text-white/70">
                  Training
                </div>
                <MenuItem href="/learn" onClick={() => setMobileOpen(false)}>
                  All Training
                </MenuItem>
                <MenuItem href="/learn/genai" onClick={() => setMobileOpen(false)}>
                  AI Training
                </MenuItem>
                <MenuItem href="/learn/tqm" onClick={() => setMobileOpen(false)}>
                  TQM Training
                </MenuItem>
                <MenuItem href="/learn/finance" onClick={() => setMobileOpen(false)}>
                  Finance Training
                </MenuItem>
              </div>

              <Link href="/rewards" className="block rounded-md px-3 py-2 hover:bg-white/10">
                Rewards
              </Link>
              <Link href="/about" className="block rounded-md px-3 py-2 hover:bg-white/10">
                About
              </Link>

              <div className="mt-3 flex gap-2">
                {user ? (
                  <>
                    <Link
                      href="/account"
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 rounded-md bg-teal-500 px-3 py-2 text-center font-semibold text-[#003B49] hover:bg-teal-400"
                    >
                      Account
                    </Link>
                    <button
                      onClick={async () => {
                        await handleSignOut();
                        setMobileOpen(false);
                      }}
                      className="flex-1 rounded-md bg-orange-500 px-3 py-2 font-semibold hover:bg-orange-600"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/signin"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 rounded-md bg-orange-500 px-3 py-2 text-center font-semibold hover:bg-orange-600"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
