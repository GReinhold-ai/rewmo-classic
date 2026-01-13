// src/components/Header.tsx
import Link from "next/link";
import { useRouter } from "next/router";

export default function Header() {
  const router = useRouter();
  
  const navItems = [
    { label: "Lean Lab", href: "/lean-lab" },
    { label: "Shopping", href: "/shopping" },
    { label: "Rewards", href: "/rewards" },
    { label: "About", href: "/about" },
  ];
  
  const isActive = (href: string) => {
    return router.pathname === href || router.pathname.startsWith(href);
  };
  
  return (
    <header className="sticky top-0 z-50 bg-[#003B49] border-b border-white/10 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-black text-[#FF9151] group-hover:text-[#FFA36C] transition">
              RewmoAI
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  isActive(item.href)
                    ? "bg-[#FF9151] text-[#003B49]"
                    : "text-white/90 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          {/* Account Button */}
          <Link
            href="/account"
            className="bg-[#FF9151] text-[#003B49] px-6 py-2 rounded-lg font-bold hover:bg-[#FFA36C] transition"
          >
            Account
          </Link>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => {
              // Toggle mobile menu (you can implement this with state)
              alert("Mobile menu - implement with state management");
            }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
