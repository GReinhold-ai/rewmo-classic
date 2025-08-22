// src/components/Navbar.tsx
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/AuthProvider";

function cx(...a: Array<string | false | null | undefined>) {
  return a.filter(Boolean).join(" ");
}

export default function Navbar() {
  const router = useRouter();
  const { currentUser, signOut } = useAuth();

  const [open, setOpen] = useState(false);
  const [trainingOpen, setTrainingOpen] = useState(false);

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (open) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      return () => {
        const y = document.body.style.top;
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        // restore scroll
        if (y) window.scrollTo(0, parseInt(y || "0") * -1);
      };
    }
  }, [open]);

  const redirectBack = useMemo(() => {
    // Return to current page after auth
    const path = router.asPath || "/";
    return encodeURIComponent(path);
  }, [router.asPath]);

  const desktopLink = (href: string, label: string) => (
    <Link
      key={href}
      href={href}
      className={cx(
        "px-3 py-2 text-sm font-semibold",
        "text-[#B6E7EB] hover:text-white hover:bg-white/5 rounded-md",
        router.pathname === href && "text-white"
      )}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 w-full bg-[#003B49]/95 backdrop-blur supports-[backdrop-filter]:bg-[#003B49]/80 shadow">
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:h-20">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            {/* Tiny logo block; swap if you have an Image */}
            <span className="inline-block h-7 w-7 rounded bg-white/10 ring-1 ring-white/20" />
            <span className="text-lg font-extrabold tracking-tight text-white">
              Rewmo<span className="text-[#FF6A00]">AI</span>
            </span>
          </Link>
        </div>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {desktopLink("/features", "Features")}
          {desktopLink("/shopping", "Shopping")}
          {desktopLink("/lean-lab", "Lean Lab")}
          {desktopLink("/rewards", "Rewards")}

          {/* Training root -> /learn with dropdown */}
          <div className="relative">
            <Link
              href="/learn"
              className={cx(
                "px-3 py-2 text-sm font-semibold rounded-md",
                "text-[#B6E7EB] hover:text-white hover:bg-white/5"
              )}
            >
              Training
            </Link>
            {/* dropdown */}
            <div className="invisible absolute left-0 mt-2 w-44 overflow-hidden rounded-xl border border-white/10 bg-[#032E38] shadow-lg opacity-0 transition group-hover:visible group-hover:opacity-100 md:group">
              {/* The wrapper above becomes a hover group if needed,
                  but we also show the menu on focus within for a11y */}
              <div className="flex flex-col py-2">
                <Link
                  href="/learn/genai"
                  className="px-4 py-2 text-sm text-[#B6E7EB] hover:bg-white/5 hover:text-white"
                >
                  AI Training
                </Link>
                <Link
                  href="/learn/tqm"
                  className="px-4 py-2 text-sm text-[#B6E7EB] hover:bg-white/5 hover:text-white"
                >
                  TQM Training
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Auth + hamburger */}
        <div className="flex items-center gap-2">
          {/* Account/Sign In (desktop) */}
          <div className="hidden md:block">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/account"
                  className="rounded-full bg-[#15C5C1] px-3 py-1.5 text-sm font-semibold text-[#083A3F] hover:opacity-90"
                >
                  Account
                </Link>
              </div>
            ) : (
              <Link
                href={`/signin?redirect=${redirectBack}`}
                className="rounded-full bg-[#FF6A00] px-3 py-1.5 text-sm font-semibold text-white hover:opacity-90"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Hamburger */}
          <button
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-white/10 md:hidden"
          >
            <svg
              className={cx("h-6 w-6 transition", open && "scale-0 opacity-0 absolute")}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6h16.5M3.75 12h16.5M3.75 18h16.5" />
            </svg>
            <svg
              className={cx("h-6 w-6 transition", !open && "scale-0 opacity-0 absolute")}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile sheet */}
      <div
        id="mobile-menu"
        className={cx(
          "md:hidden",
          "fixed inset-y-0 right-0 z-40 w-80 max-w-[90vw] translate-x-full bg-[#003B49] shadow-xl ring-1 ring-white/10 transition-transform",
          open && "translate-x-0"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <span className="text-base font-extrabold text-white">Menu</span>
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="rounded-md p-2 text-white hover:bg-white/10"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-4 pb-4">
          <MobileLink href="/features" onClick={() => setOpen(false)} active={router.pathname === "/features"}>
            Features
          </MobileLink>
          <MobileLink href="/shopping" onClick={() => setOpen(false)} active={router.pathname === "/shopping"}>
            Shopping
          </MobileLink>
          <MobileLink href="/lean-lab" onClick={() => setOpen(false)} active={router.pathname === "/lean-lab"}>
            Lean Lab
          </MobileLink>
          <MobileLink href="/rewards" onClick={() => setOpen(false)} active={router.pathname === "/rewards"}>
            Rewards
          </MobileLink>

          {/* Training accordion */}
          <button
            className="mt-2 flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold text-[#B6E7EB] hover:bg-white/5 hover:text-white"
            onClick={() => setTrainingOpen((v) => !v)}
            aria-expanded={trainingOpen}
          >
            <span>Training</span>
            <svg
              className={cx("h-4 w-4 transition-transform", trainingOpen && "rotate-180")}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {trainingOpen && (
            <div className="ml-2">
              <MobileLink href="/learn" onClick={() => setOpen(false)} active={router.pathname === "/learn"}>
                Overview
              </MobileLink>
              <MobileLink
                href="/learn/genai"
                onClick={() => setOpen(false)}
                active={router.asPath.startsWith("/learn/genai")}
              >
                AI Training
              </MobileLink>
              <MobileLink
                href="/learn/tqm"
                onClick={() => setOpen(false)}
                active={router.asPath.startsWith("/learn/tqm")}
              >
                TQM Training
              </MobileLink>
            </div>
          )}

          <div className="mt-4 border-t border-white/10 pt-4">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/account"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-full bg-[#15C5C1] px-3 py-2 text-center text-sm font-semibold text-[#083A3F] hover:opacity-90"
                >
                  Account
                </Link>
                <button
                  onClick={async () => {
                    await signOut();
                    setOpen(false);
                    // Optionally return to home
                    // router.push("/");
                  }}
                  className="rounded-full bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/15"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <Link
                href={`/signin?redirect=${redirectBack}`}
                onClick={() => setOpen(false)}
                className="block rounded-full bg-[#FF6A00] px-3 py-2 text-center text-sm font-semibold text-white hover:opacity-90"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Scrim */}
      <button
        aria-hidden={!open}
        onClick={() => setOpen(false)}
        className={cx(
          "fixed inset-0 z-30 bg-black/40 opacity-0 pointer-events-none transition md:hidden",
          open && "opacity-100 pointer-events-auto"
        )}
      />
    </header>
  );
}

function MobileLink({
  href,
  children,
  onClick,
  active,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cx(
        "mt-2 block rounded-lg px-3 py-2 text-sm font-semibold",
        active ? "bg-white/10 text-white" : "text-[#B6E7EB] hover:bg-white/5 hover:text-white"
      )}
    >
      {children}
    </Link>
  );
}
