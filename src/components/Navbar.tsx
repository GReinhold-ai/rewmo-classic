import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/lib/AuthProvider";

const ADMIN_EMAILS = ["gary.reinhold@leafpays.com"];

export default function Navbar() {
  const { currentUser, login, logout } = useAuth();
  const router = useRouter();
  const isAdmin = currentUser && ADMIN_EMAILS.includes(currentUser.email || "");

  const links = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/features", label: "Features" },
  { href: "/analytics", label: "Analytics" },
  { href: "/insights", label: "Insights" },
  { href: "/invite", label: "Invite" },
  { href: "/profile", label: "Profile" },
  { href: "/rewards", label: "Rewards" },
  { href: "/shopping", label: "Shopping" },
  { href: "/about", label: "About" },
  ...(isAdmin ? [{ href: "/admin/rewards", label: "Admin" }] : []),
];

  return (
    <nav className="hidden md:flex justify-between items-center p-4 bg-white shadow-sm">
      <div className="flex space-x-4 text-orange-600 text-sm">
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            <span
              className={`cursor-pointer px-2 py-1 rounded ${
                router.pathname === link.href
                  ? "bg-orange-500 text-white"
                  : "hover:bg-orange-100"
              }`}
            >
              {link.label}
            </span>
          </Link>
        ))}
      </div>
      <div className="flex items-center space-x-3">
        {currentUser && (
          <span className="text-sm text-gray-600">
            Welcome, {currentUser.displayName?.split(" ")[0]}
          </span>
        )}
        {!currentUser ? (
          <button
            onClick={login}
            className="ml-4 px-3 py-1 rounded bg-orange-500 text-white text-sm"
          >
            Sign In
          </button>
        ) : (
          <button
            onClick={logout}
            className="ml-4 px-3 py-1 rounded bg-orange-500 text-white text-sm"
          >
            Sign Out
          </button>
        )}
      </div>
    </nav>
  );
}
