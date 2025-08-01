import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/lib/AuthProvider";

export default function Navbar() {
  const auth = useAuth();
  const currentUser = auth?.currentUser;
  const logout = auth?.logout;

  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = (
    <>
      <Link href="/dashboard" className="text-white hover:text-orange-400">
        Dashboard
      </Link>
      <Link href="/rewards" className="text-white hover:text-orange-400">
        Rewards
      </Link>
      <Link href="/profile" className="text-white hover:text-orange-400">
        Profile
      </Link>
    </>
  );

  return (
    <nav className="bg-black px-4 py-3 flex justify-between items-center shadow-md sticky top-0 z-50">
      <Link href="/" className="text-2xl font-bold text-orange-400">
        RewMoAI
      </Link>

      <div className="hidden md:flex gap-6 items-center">{navLinks}</div>

      <div className="md:hidden">
        <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? <X size={28} className="text-white" /> : <Menu size={28} className="text-white" />}
        </button>
      </div>

      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-black px-4 py-3 flex flex-col gap-4 md:hidden">
          {navLinks}
          {currentUser && logout && (
            <button
              onClick={logout}
              className="text-white hover:text-orange-400 mt-2 text-left"
            >
              Sign Out
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
