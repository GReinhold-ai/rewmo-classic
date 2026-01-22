// src/components/Navbar.tsx
import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import clsx from "clsx";
import Logo from "@/components/Logo";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";

function ChevronDown({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className={clsx("h-4 w-4 transition-transform", className)}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.112l3.71-2.88a.75.75 0 1 1 .92 1.18l-4.2 3.26a.75.75 0 0 1-.92 0l-4.2-3.26a.75.75 0 0 1-.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

const NAV_LINK =
  "inline-flex items-center px-3 py-2 rounded-md text-[15px] md:text-base " +
  "font-semibold tracking-wide text-[#EAF5F6]/95 hover:text-white " +
  "hover:bg-[#0A3A40] focus:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-[#15C5C1] focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-[#001F24]";

export default function Navbar() {
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [labOpen, setLabOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  const labRef = useRef<HTMLDivElement | null>(null);
  const supportRef = useRef<HTMLDivElement | null>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const supportHoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auth subscription
  useEffect(() => {
    setMounted(true);
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  // Close menus on outside click / esc / route change
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (labRef.current && !labRef.current.contains(e.target as Node)) setLabOpen(false);
      if (supportRef.current && !supportRef.current.contains(e.target as Node)) setSupportOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setLabOpen(false);
        setSupportOpen(false);
        setMobileOpen(false);
      }
    }
    const handleRoute = () => {
      setLabOpen(false);
      setSupportOpen(false);
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

  // Stable hover timing for Lean Lab
  const openLabSoon = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setLabOpen(true), 80);
  };
  const closeLabSoon = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setLabOpen(false), 140);
  };

  // Stable hover timing for Support dropdown
  const openSupportSoon = () => {
    if (supportHoverTimer.current) clearTimeout(supportHoverTimer.current);
    supportHoverTimer.current = setTimeout(() => setSupportOpen(true), 80);
  };
  const closeSupportSoon = () => {
    if (supportHoverTimer.current) clearTimeout(supportHoverTimer.current);
    supportHoverTimer.current = setTimeout(() => setSupportOpen(false), 140);
  };

  const NavLink = ({
    href,
    children,
    onClick,
    className = "",
    style,
  }: {
    href: string;
    children: ReactNode;
    onClick?: () => void;
    className?: string;
    style?: CSSProperties;
  }) => (
    <Link href={href} className={clsx(NAV_LINK, className)} style={style} onClick={onClick}>
      {children}
    </Link>
  );

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setLabOpen(false);
      setSupportOpen(false);
      setMobileOpen(false);
      router.push("/");
    } catch (err) {
      console.error("Sign out failed:", err);
    }
  };

  // Avoid hydration mismatch
  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 bg-[#003B49]/95 backdrop-blur supports-[backdrop-filter]:bg-[#003B49]/80 border-b border-[#0A3A40]">
        <nav className="mx-auto max-w-6xl px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" aria-label="RewmoAI home" className="shrink-0">
              <Logo size={36} withWordmark />
            </Link>
          </div>
        </nav>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-[#003B49]/95 backdrop-blur supports-[backdrop-filter]:bg-[#003B49]/80 border-b border-[#0A3A40]">
      <nav className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" aria-label="RewmoAI home" className="shrink-0">
            <Logo size={36} withWordmark />
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink href="/features">Features</NavLink>
            <NavLink href="/shopping">Shopping</NavLink>

            {/* Lean Lab dropdown (replaces Training) */}
            <div
              ref={labRef}
              className="relative"
              onMouseEnter={openLabSoon}
              onMouseLeave={closeLabSoon}
            >
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={labOpen}
                className={clsx(
                  "inline-flex items-center gap-1 px-3 py-2 rounded-md text-[15px] md:text-base font-semibold tracking-wide",
                  "text-[#EAF5F6]/95 hover:text-white hover:bg-[#0A3A40]",
                  "transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#15C5C1] focus-visible:ring-offset-2 focus-visible:ring-offset-[#001F24]"
                )}
                onClick={() => setLabOpen((s) => !s)}
                onFocus={openLabSoon}
              >
                Lean Lab
                <ChevronDown className={clsx(labOpen && "rotate-180")} />
              </button>

              <div
                role="menu"
                aria-label="Lean Lab"
                className={clsx(
                  "absolute left-0 mt-2 w-60 rounded-xl border border-[#0A3A40] bg-[#07333B] shadow-lg ring-1 ring-black/5 py-1",
                  labOpen ? "opacity-100 translate-y-0" : "pointer-events-none -translate-y-1 opacity-0",
                  "transition"
                )}
                onMouseEnter={openLabSoon}
                onMouseLeave={closeLabSoon}
              >
                <Link
                  role="menuitem"
                  href="/lean-lab"
                  className="block px-3 py-2 text-sm text-[#CFEAEC] hover:text-white hover:bg-[#0A3A40]"
                >
                  Open LeanAI Lab
                </Link>
                <div className="my-1 border-t border-[#0A3A40]" />
                <Link
                  role="menuitem"
                  href="/training/rpm"
                  className="block px-3 py-2 text-sm text-[#CFEAEC] hover:text-white hover:bg-[#0A3A40]"
                >
                  Intro Track (Free)
                </Link>
                <Link
                  role="menuitem"
                  href="/leanai/fundamentals"
                  className="block px-3 py-2 text-sm text-[#CFEAEC] hover:text-white hover:bg-[#0A3A40]"
                >
                  R-PM Fundamentals — Module 1
                </Link>
              </div>
            </div>

            <NavLink href="/rewards">Rewards</NavLink>

            {/* Support dropdown with About, FAQ, Contact */}
            <div
              ref={supportRef}
              className="relative"
              onMouseEnter={openSupportSoon}
              onMouseLeave={closeSupportSoon}
            >
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={supportOpen}
                className={clsx(
                  "inline-flex items-center gap-1 px-3 py-2 rounded-md text-[15px] md:text-base font-semibold tracking-wide",
                  "text-[#EAF5F6]/95 hover:text-white hover:bg-[#0A3A40]",
                  "transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#15C5C1] focus-visible:ring-offset-2 focus-visible:ring-offset-[#001F24]"
                )}
                onClick={() => setSupportOpen((s) => !s)}
                onFocus={openSupportSoon}
              >
                Support
                <ChevronDown className={clsx(supportOpen && "rotate-180")} />
              </button>

              <div
                role="menu"
                aria-label="Support"
                className={clsx(
                  "absolute left-0 mt-2 w-48 rounded-xl border border-[#0A3A40] bg-[#07333B] shadow-lg ring-1 ring-black/5 py-1",
                  supportOpen ? "opacity-100 translate-y-0" : "pointer-events-none -translate-y-1 opacity-0",
                  "transition"
                )}
                onMouseEnter={openSupportSoon}
                onMouseLeave={closeSupportSoon}
              >
                <Link
                  role="menuitem"
                  href="/about"
                  className="block px-3 py-2 text-sm text-[#CFEAEC] hover:text-white hover:bg-[#0A3A40]"
                >
                  About RewmoAI
                </Link>
                <Link
                  role="menuitem"
                  href="/faq"
                  className="block px-3 py-2 text-sm text-[#CFEAEC] hover:text-white hover:bg-[#0A3A40]"
                >
                  FAQ
                </Link>
                <Link
                  role="menuitem"
                  href="/contact"
                  className="block px-3 py-2 text-sm text-[#CFEAEC] hover:text-white hover:bg-[#0A3A40]"
                >
                  Contact Us
                </Link>
                <div className="my-1 border-t border-[#0A3A40]" />
                <Link
                  role="menuitem"
                  href="/terms"
                  className="block px-3 py-2 text-sm text-[#CFEAEC] hover:text-white hover:bg-[#0A3A40]"
                >
                  Terms of Service
                </Link>
                <Link
                  role="menuitem"
                  href="/privacy"
                  className="block px-3 py-2 text-sm text-[#CFEAEC] hover:text-white hover:bg-[#0A3A40]"
                >
                  Privacy Policy
                </Link>
              </div>
            </div>

            {/* Go Premium CTA */}
            <Link
              href="/account/upgrade"
              className="ml-1 inline-flex items-center rounded-full px-3 py-1.5 text-sm font-extrabold"
              style={{ backgroundColor: "#FF9151", color: "#062025", border: "2px solid #FF9151" }}
            >
              Go Premium
            </Link>

            {/* Right side auth */}
            {user ? (
              <div className="ml-2 flex items-center gap-2">
                <span className="px-2 py-1 text-xs rounded bg-[#07333B] text-[#EAF5F6]/80">
                  {user.email || "Signed in"}
                </span>
                <NavLink href="/account" className="bg-emerald-500/20 hover:bg-emerald-500/30">
                  Account
                </NavLink>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center px-3 py-2 rounded-md text-sm font-semibold text-white transition"
                  style={{ backgroundColor: "#F07C41" }}
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="ml-2 flex items-center gap-2">
                <NavLink href="/account" className="bg-emerald-500/20 hover:bg-emerald-500/30">
                  Account
                </NavLink>
                <NavLink href="/login" className="text-white" style={{ backgroundColor: "#F07C41" }}>
                  Sign in
                </NavLink>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-md px-3 py-2 text-[#EAF5F6]/90 hover:text-white hover:bg-[#07333B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#15C5C1] focus-visible:ring-offset-2 focus-visible:ring-offset-[#001F24]"
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

        {/* Mobile menu - FIXED: Added explicit background color */}
        <div
          className={clsx(
            "md:hidden overflow-hidden transition-[max-height,opacity] duration-300",
            "bg-[#003B49] rounded-b-xl", // Added background color
            mobileOpen ? "max-h-[80vh] opacity-100 pb-4" : "max-h-0 opacity-0"
          )}
        >
          <div className="flex flex-col gap-1 pt-2 bg-[#003B49]">
            <NavLink href="/features" onClick={() => setMobileOpen(false)}>
              Features
            </NavLink>
            <NavLink href="/shopping" onClick={() => setMobileOpen(false)}>
              Shopping
            </NavLink>

            {/* Lean Lab group replacing "Training" */}
            <details className="group">
              <summary className="list-none">
                <div className="flex items-center justify-between px-3 py-2 rounded-md text-[15px] font-bold text-[#EAF5F6] hover:text-white hover:bg-[#07333B] transition cursor-pointer">
                  <span>Lean Lab</span>
                  <ChevronDown className="group-open:rotate-180" />
                </div>
              </summary>
              <div className="pl-2 bg-[#072b33] rounded-lg mx-2 mt-1">
                <NavLink href="/lean-lab" onClick={() => setMobileOpen(false)}>
                  Open LeanAI Lab
                </NavLink>
                <NavLink href="/training/rpm" onClick={() => setMobileOpen(false)}>
                  Intro Track (Free)
                </NavLink>
                <NavLink href="/leanai/fundamentals" onClick={() => setMobileOpen(false)}>
                  R-PM Fundamentals — Module 1
                </NavLink>
              </div>
            </details>

            <NavLink href="/rewards" onClick={() => setMobileOpen(false)}>
              Rewards
            </NavLink>

            {/* Support group with About, FAQ, Contact */}
            <details className="group">
              <summary className="list-none">
                <div className="flex items-center justify-between px-3 py-2 rounded-md text-[15px] font-bold text-[#EAF5F6] hover:text-white hover:bg-[#07333B] transition cursor-pointer">
                  <span>Support</span>
                  <ChevronDown className="group-open:rotate-180" />
                </div>
              </summary>
              <div className="pl-2 bg-[#072b33] rounded-lg mx-2 mt-1">
                <NavLink href="/about" onClick={() => setMobileOpen(false)}>
                  About RewmoAI
                </NavLink>
                <NavLink href="/faq" onClick={() => setMobileOpen(false)}>
                  FAQ
                </NavLink>
                <NavLink href="/contact" onClick={() => setMobileOpen(false)}>
                  Contact Us
                </NavLink>
                <div className="my-1 mx-3 border-t border-[#0A3A40]" />
                <NavLink href="/terms" onClick={() => setMobileOpen(false)}>
                  Terms of Service
                </NavLink>
                <NavLink href="/privacy" onClick={() => setMobileOpen(false)}>
                  Privacy Policy
                </NavLink>
              </div>
            </details>

            {/* Divider */}
            <div className="my-2 mx-3 border-t border-[#15C5C1]/30" />

            {/* Mobile Go Premium CTA */}
            <NavLink
              href="/account/upgrade"
              onClick={() => setMobileOpen(false)}
              className="font-extrabold text-[#062025] mx-2"
              style={{ backgroundColor: "#FF9151", borderColor: "#FF9151" }}
            >
              ⭐ Go Premium
            </NavLink>

            {user ? (
              <div className="mt-2 flex flex-col gap-2 px-2">
                <div className="px-3 py-2 text-sm rounded-lg bg-[#072b33] text-[#EAF5F6]/80">
                  <span className="text-[#15C5C1] font-medium">Signed in:</span>{" "}
                  {user.email || "User"}
                </div>
                <NavLink
                  href="/account"
                  onClick={() => setMobileOpen(false)}
                  className="bg-emerald-500/20 hover:bg-emerald-500/30"
                >
                  👤 Account
                </NavLink>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center justify-center px-3 py-2 rounded-md text-sm font-semibold text-white transition"
                  style={{ backgroundColor: "#F07C41" }}
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="mt-2 flex flex-col gap-2 px-2">
                <NavLink
                  href="/account"
                  onClick={() => setMobileOpen(false)}
                  className="bg-emerald-500/20 hover:bg-emerald-500/30"
                >
                  👤 Account
                </NavLink>
                <NavLink
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-white justify-center"
                  style={{ backgroundColor: "#F07C41" }}
                >
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