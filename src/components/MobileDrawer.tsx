import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react"; // Modern icon set (install with `npm install lucide-react`)

const links = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/rewards", label: "Rewards" },
  { href: "/shopping", label: "Shopping" },
  { href: "/profile", label: "Profile" },
  { href: "/about", label: "About" },
  { href: "/support", label: "Support" },
];

export default function MobileDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      {/* Hamburger Icon */}
      <button
        aria-label="Open menu"
        className="p-2 rounded focus:outline-none"
        onClick={() => setOpen(true)}
      >
        <Menu size={28} />
      </button>

      {/* Overlay & Drawer */}
      {open && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
            onClick={() => setOpen(false)}
          />
          {/* Drawer */}
          <nav
            className={`fixed top-0 left-0 w-4/5 max-w-xs h-full bg-white shadow-xl z-50 flex flex-col transition-transform duration-200 ${
              open ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex justify-between items-center px-4 py-4 border-b">
              <span className="text-xl font-extrabold text-orange-600 tracking-tight">
                RewmoAI
              </span>
              <button
                aria-label="Close menu"
                className="p-2"
                onClick={() => setOpen(false)}
              >
                <X size={26} />
              </button>
            </div>
            <div className="flex flex-col space-y-2 px-6 py-6">
              {links.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="py-2 text-base font-medium hover:text-orange-500 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        </>
      )}
    </div>
  );
}
