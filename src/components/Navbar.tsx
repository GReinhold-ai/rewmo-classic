// src/components/Navbar.tsx
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import { auth } from "@/lib/firebaseClient";
import { onAuthStateChanged, signOut as fbSignOut, type User } from "firebase/auth";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const off = onAuthStateChanged(auth, setUser);
    return () => off();
  }, []);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const signOut = async () => {
    await fbSignOut(auth);
    router.push("/");
  };

  return (
    <header className="fixed inset-x-0 top-0 z-[100] bg-[#003B49]/90 backdrop-blur">
      <nav className="mx-auto flex h-16 md:h-20 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logos/logo.png"
            alt="Rewmo"
            width={36}
            height={36}
            className="h-9 w-9"
            priority
          />
          <span className="text-[#FF9151] font-extrabold text-lg md:text-xl">
            RewmoAI
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-white/90">
          <Link href="/features" className="hover:opacity-80">Features</Link>
          <Link href="/shopping" className="hover:opacity-80">Shopping</Link>

          {/* Training dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            ref={menuRef}
          >
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={open}
              onClick={() => setOpen(v => !v)}
              className="hover:opacity-80 inline-flex items-center gap-1"
            >
              Training
              <svg width="12" height="12" viewBox="0 0 20 20" className={`transition ${open ? "rotate-180" : ""}`}>
                <path fill="currentColor" d="M5.5 7.5L10 12l4.5-4.5H5.5z" />
              </svg>
            </button>

            {open && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-56 rounded-xl border border-white/10 bg-[#053d4b] p-2 shadow-xl z-[200] pointer-events-auto"
              >
                <Link
                  href="/learn"
                  className="block rounded-lg px-3 py-2 hover:bg-white/10"
                  onClick={() => setOpen(false)}
                  role="menuitem"
                >
                  All tracks
                </Link>
                <Link
                  href="/learn/genai"
                  className="block rounded-lg px-3 py-2 hover:bg-white/10"
                  onClick={() => setOpen(false)}
                  role="menuitem"
                >
                  GenAI
                </Link>
                <Link
                  href="/learn/tqm"
                  className="block rounded-lg px-3 py-2 hover:bg-white/10"
                  onClick={() => setOpen(false)}
                  role="menuitem"
                >
                  TQM
                </Link>
                <Link
                  href="/learn/finance"
                  className="block rounded-lg px-3 py-2 hover:bg-white/10"
                  onClick={() => setOpen(false)}
                  role="menuitem"
                >
                  Finance
                </Link>
              </div>
            )}
          </div>

          <Link href="/rewards" className="hover:opacity-80">Rewards</Link>
          <Link href="/about" className="hover:opacity-80">About</Link>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/account"
                className="rounded-lg bg-teal-500/90 px-3 py-1.5 text-white hover:bg-teal-400"
              >
                Account
              </Link>
              <button
                onClick={signOut}
                className="rounded-lg bg-orange-500 px-3 py-1.5 text-white hover:bg-orange-600"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/signin"
              className="rounded-lg bg-orange-500 px-3 py-1.5 text-white hover:bg-orange-600"
            >
              Sign In
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
