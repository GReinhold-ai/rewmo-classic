import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/AuthProvider";
import { Menu, X } from "lucide-react"; // Use lucide-react for icons

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = (
    <>
      <Link href="/dashboard" className="nav-link">Dashboard</Link>
      <Link href="/features" className="nav-link">Features</Link>
      <Link href="/shopping" className="nav-link">Shopping</Link>
      <Link href="/rewards" className="nav-link">Rewards</Link>
      <Link href="/lean-lab" className="nav-link">Lean Lab</Link>
      {currentUser ? (
        <>
          <Link href="/profile" className="nav-link">Profile</Link>
          <button
            onClick={logout}
            className="ml-2 bg-[#FF9151] hover:bg-[#FFA36C] text-[#003B49] font-bold px-4 py-1 rounded transition"
          >
            Sign Out
          </button>
        </>
      ) : (
        <Link
          href="/signin"
          className="ml-2 bg-[#FF9151] hover:bg-[#FFA36C] text-[#003B49] font-bold px-4 py-1 rounded transition"
        >
          Sign In
        </Link>
      )}
    </>
  );

  return (
    <nav className="w-full bg-[#003B49] border-b border-[#072b33] px-4 py-3 flex items-center justify-between">
      {/* Brand */}
      <Link href="/" className="flex items-center gap-2">
        <Image src="/logos/logo.png" alt="Rewmo Logo" width={50} height={50} style={{ borderRadius: 0 }} />
        <span className="text-[#FF9151] text-xl font-black ml-1">RewmoAI</span>
      </Link>
      {/* Desktop Nav */}
      <div className="hidden md:flex gap-5 items-center">{navLinks}</div>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-[#FF9151] focus:outline-none"
        onClick={() => setMenuOpen((open) => !open)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <X size={32} /> : <Menu size={32} />}
      </button>
      {/* Mobile Nav Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-40 flex flex-col md:hidden">
          <div className="bg-[#003B49] w-3/4 max-w-xs h-full p-6 shadow-2xl z-50 flex flex-col">
            {/* Close Button */}
            <button
              className="self-end mb-6 text-[#FF9151] focus:outline-none"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={32} />
            </button>
            <div className="flex flex-col gap-6 text-lg font-semibold">
              {React.Children.map(navLinks.props.children, (child) =>
                React.cloneElement(child, {
                  onClick: () => setMenuOpen(false), // close menu on click
                  className: (child.props?.className || "") + " py-2",
                })
              )}
            </div>
          </div>
          {/* Click outside closes menu */}
          <div
            className="flex-1"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu overlay"
          />
        </div>
      )}
      <style jsx>{`
        .nav-link {
          color: #fff;
          transition: color 0.2s;
        }
        .nav-link:hover {
          color: #15C5C1;
        }
      `}</style>
    </nav>
  );
}
