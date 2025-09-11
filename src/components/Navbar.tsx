import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Logo from "@/components/Logo";
import clsx from "clsx";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";

function ChevronDown({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={clsx("h-4 w-4", className)} aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.112l3.71-2.88a.75.75 0 1 1 .92 1.18l-4.2 3.26a.75.75 0 0 1-.92 0l-4.2-3.26a.75.75 0 0 1-.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function Navbar() {
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [trainOpen, setTrainOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  const trainRef = useRef<HTMLDivElement | null>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Subscribe to Firebase auth
  useEffect(() => {
    setMounted(true);
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  // Close dropdowns on outside click / ESC / route change
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!trainRef.current) return;
      if (!trainRef.current.contains(e.target as Node)) {
        setTrainOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setTrainOpen(false);
        setMobileOpen(false);
      }
    }
    const handleRoute = () => {
      setTrainOpen(false);
      setMobileOpen(false);
    };
    router.events.on("routeChangeStart", handleRoute);

    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
      router.events.off("routeChangeStart", handleRoute);
    };
  }, [router.events]);

  // Stable hover open/close to prevent flicker
  const openTrainSoon = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setTrainOpen(true), 80);
  };
  const closeTrainSoon = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setTrainOpen(false), 140);
  };

  const NavLink = ({
    href,
    children,
    onClick,
    className = "",
  }: {
    href: string;
    children: ReactNode;
    onClick?: () => void;
    className?: string;
  }) => (
    <Link
      href={href}
      className={clsx(
        "inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 transition",
        className
      )}
      onClick={onClick}
    >
      {children}
    </Link>
  );

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setTrainOpen(false);
      setMobileOpen(false);
      router.push("/");
    } catch (err) {
      console.error("Sign out failed:", err);
    }
  };

  // Avoid hydration mismatch
  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 bg-[#003B49]/95 backdrop-blur supports-[backdrop-filter]:bg-[#003B49]/80">
        <nav className="mx-auto max-w-6xl px-4">
          <div className="flex h-14 items-center justify-between">
            <Link href="/" aria-label="RewmoAI home" className="shrink-0">
              <Logo size={36} withWordmark />
            </Link>
          </div>
        </nav>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-[#003B49]/95 backdrop-blur supports-[backdrop-filter]:bg-[#003B49]/80">
      <nav className="mx-auto max-w-6xl px-4">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link href="/" aria-label="RewmoAI home" className="shrink-0">
            <Logo size={36} withWordmark />
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink href="/features">Features</NavLink>
            <NavLink href="/shopping">Shopping</NavLink>

            {/* Training dropdown */}
            <div
              ref={trainRef}
              className="relative"
              onMouseEnter={openTrainSoon}
              onMouseLeave={closeTrainSoon}
            >
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={trainOpen}
                className={clsx(
                  "inline-flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                )}
                onClick={() => setTrainOpen((s) => !s)}
                onFocus={openTrainSoon}
              >
                Training
                <ChevronDown className={clsx(trainOpen && "rotate-180 transition")} />
              </button>
              <div
                role="menu"
                aria-label="Training"
                className={clsx(
                  "absolute left-0 mt-2 w-52 rounded-xl border border-white/10 bg-[#0b4a57] shadow-lg ring-1 ring-black/5 py-1",
                  trainOpen ? "opacity-100 translate-y-0" : "pointer-events-none -translate-y-1 opacity-0",
                  "transition"
                )}
                onMouseEnter={openTrainSoon}
                onMouseLeave={closeTrainSoon}
              >
                <Link role="menuitem" href="/learn/genai" className="block px-3 py-2 text-sm text-white/90 hover:text-white hover:bg-white/10">
                  GenAI
                </Link>
                <Link role="menuitem" href="/learn/rpm" className="block px-3 py-2 text-sm text-white/90 hover:text-white hover:bg-white/10">
                  R-PM (Lean Lab)
                </Link>
                <Link role="menuitem" href="/learn/finance" className="block px-3 py-2 text-sm text-white/90 hover:text-white hover:bg-white/10">
                  Finance
                </Link>
                <div className="my-1 border-t border-white/10" />
                <Link role="menuitem" href="/training" className="block px-3 py-2 text-sm text-white/90 hover:text-white hover:bg-white/10">
                  All Training
                </Link>
              </div>
            </div>

            <NavLink href="/rewards">Rewards</NavLink>
            <NavLink href="/about">About</NavLink>

            {/* Right side auth */}
            {user ? (
              <div className="ml-2 flex items-center gap-2">
                <span className="px-2 py-1 text-xs rounded bg-white/10 text-white/80">
                  {user.email || "Signed in"}
                </span>
                <NavLink href="/dashboard" className="bg-emerald-500/20 hover:bg-emerald-500/30">
                  Account
                </NavLink>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 transition"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="ml-2 flex items-center gap-2">
                <NavLink href="/account" className="bg-emerald-500/20 hover:bg-emerald-500/30">
                  Account
                </NavLink>
                <NavLink href="/login" className="bg-orange-500 text-white hover:bg-orange-600">
                  Sign in
                </NavLink>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-md px-3 py-2 text-white/90 hover:text-white hover:bg_WHITE/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((s) => !s)}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={2}>
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        <div className={clsx("md:hidden overflow-hidden transition-[max-height,opacity] duration-300", mobileOpen ? "max-h[65vh] opacity-100" : "max-h-0 opacity-0")}>
          <div className="flex flex-col gap-1 pb-3">
            <NavLink href="/features" onClick={() => setMobileOpen(false)}>Features</NavLink>
            <NavLink href="/shopping" onClick={() => setMobileOpen(false)}>Shopping</NavLink>

            <details className="group">
              <summary className="list-none">
                <div className="flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium text_white/90 hover:text-white hover:bg-white/10 transition cursor-pointer">
                  <span>Training</span>
                  <ChevronDown className="transition group-open:rotate-180" />
                </div>
              </summary>
              <div className="pl-2">
                <NavLink href="/learn/genai" onClick={() => setMobileOpen(false)}>GenAI</NavLink>
                <NavLink href="/learn/rpm" onClick={() => setMobileOpen(false)}>R-PM (Lean Lab)</NavLink>
                <NavLink href="/learn/finance" onClick={() => setMobileOpen(false)}>Finance</NavLink>
                <NavLink href="/training" onClick={() => setMobileOpen(false)}>All Training</NavLink>
              </div>
            </details>

            <NavLink href="/rewards" onClick={() => setMobileOpen(false)}>Rewards</NavLink>
            <NavLink href="/about" onClick={() => setMobileOpen(false)}>About</NavLink>

            {user ? (
              <div className="mt-1 flex flex-col gap-1">
                <span className="px-3 py-1 text-xs rounded bg-white/10 text-white/80 ml-1">
                  {user.email || "Signed in"}
                </span>
                <NavLink href="/dashboard" onClick={() => setMobileOpen(false)} className="bg-emerald-500/20 hover:bg-emerald-500/30">
                  Account
                </NavLink>
                <button
                  onClick={handleSignOut}
                  className="mx-3 mt-1 inline-flex items-center px-3 py-2 rounded-md text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 transition"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="mt-1 flex flex-col gap-1">
                <NavLink href="/account" onClick={() => setMobileOpen(false)} className="bg-emerald-500/20 hover:bg-emerald-500/30">
                  Account
                </NavLink>
                <NavLink href="/login" onClick={() => setMobileOpen(false)} className="bg-orange-500 text-white hover:bg-orange-600">
                  Sign in
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
