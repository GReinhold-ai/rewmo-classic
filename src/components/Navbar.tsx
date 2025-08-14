import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

const navLinks = [
  { name: "Features", href: "/#features" },
  { name: "Shopping", href: "/shopping" },
  { name: "Lean Lab", href: "/enterpriseai" },
  { name: "Rewards", href: "/#rewards" },
  { name: "About", href: "/about" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Close the sheet whenever a route change starts
  useEffect(() => {
    const close = () => setOpen(false);
    router.events.on("routeChangeStart", close);
    return () => router.events.off("routeChangeStart", close);
  }, [router.events]);

  // Active link helper – works for routes and /#hash anchors
  const activeHref = useMemo(() => {
    // e.g. "/#features" or "/shopping"
    const path = router.asPath || router.pathname;
    return path;
  }, [router.asPath, router.pathname]);

  const isActive = (href: string) => {
    // Exact match or same base path with hash
    if (href.startsWith("/#")) {
      // anchors on the landing page
      return activeHref === href;
    }
    // For pages, match the segment start ("/shopping", "/enterpriseai", "/about")
    return activeHref === href || activeHref.startsWith(href + "/");
  };

  return (
    <header
      role="banner"
      className="
        sticky top-0 z-50
        bg-[#003B49]/95
        backdrop-blur
        supports-[backdrop-filter]:bg-[#003B49]/80
        border-b border-[#0a2b33]
        pt-[env(safe-area-inset-top)]
      "
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logos/logo.png"
              alt="RewmoAI"
              width={36}
              height={36}
              className="rounded-md border border-[#15C5C1]/30"
              priority
            />
            <span className="sr-only">RewmoAI</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((l) => (
              <Link
                key={l.name}
                href={l.href}
                className={
                  "text-[15px] font-semibold transition " +
                  (isActive(l.href)
                    ? "text-white"
                    : "text-[#FF9151] hover:text-[#FFB98E]")
                }
                prefetch={false}
              >
                {l.name}
              </Link>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/signin"  // <- change if you really use /api/auth/signin
              className="inline-flex items-center rounded-lg bg-[#FF6B00] px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-[#ff7d22] active:translate-y-px transition"
              prefetch={false}
            >
              Sign In
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label="Open main menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-[#FF9151] hover:bg-white/5 focus:outline-none"
          >
            <svg className={`h-6 w-6 ${open ? "hidden" : "block"}`} viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <svg className={`h-6 w-6 ${open ? "block" : "hidden"}`} viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      <div
        className={
          "md:hidden transition-opacity duration-200 " +
          (open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0")
        }
      >
        {/* backdrop */}
        <div
          className="fixed inset-0 bg-black/40"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
        {/* panel (account for safe-area & sticky height) */}
        <div className="fixed inset-x-0 top-[calc(env(safe-area-inset-top)+56px)] z-50 mx-auto max-w-6xl px-4">
          <div className="rounded-2xl border border-white/10 bg-[#072b33] p-3 shadow-2xl">
            <nav className="grid gap-1">
              {navLinks.map((l) => (
                <Link
                  key={l.name}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={
                    "rounded-lg px-3 py-3 text-base font-semibold " +
                    (isActive(l.href)
                      ? "bg-white/5 text-white"
                      : "text-[#B6E7EB] hover:bg-white/5 hover:text-white")
                  }
                  prefetch={false}
                >
                  {l.name}
                </Link>
              ))}

              <Link
                href="/signin"  // <- change if you use a different sign-in route
                onClick={() => setOpen(false)}
                className="mt-1 inline-flex items-center justify-center rounded-lg bg-[#FF6B00] px-4 py-3 text-base font-bold text-white shadow hover:bg-[#ff7d22]"
                prefetch={false}
              >
                Sign In
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
