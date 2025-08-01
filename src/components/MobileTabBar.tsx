// src/components/MobileTabBar.tsx
import Link from "next/link";
import { useRouter } from "next/router";
import { Home, LayoutDashboard, Gift, User, Shield } from "lucide-react";
import { useAuth } from "@/lib/AuthProvider";

// Set your admin emails here
const ADMIN_EMAILS = ["gary.reinhold@leafpays.com"];

export default function MobileTabBar() {
  const auth = useAuth();
  const currentUser = auth?.currentUser;

  const router = useRouter();
  const isAdmin = currentUser && ADMIN_EMAILS.includes(currentUser.email || "");

  // ...rest of the component
}
  const tabs = [
    {
      href: "/",
      label: "Home",
      icon: <Home size={22} />,
    },
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={22} />,
    },
    {
      href: "/features",
      label: "Features",
      icon: <Gift size={22} />,
    },
    {
      href: "/profile",
      label: "Profile",
      icon: <User size={22} />,
    },
    {
      href: "/rewards",
      label: "Rewards",
      icon: <Gift size={22} />,
    },
    ...(isAdmin
      ? [
          {
            href: "/admin/rewards",
            label: "Admin",
            icon: <Shield size={22} />,
          },
        ]
      : []),
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t shadow z-50 flex justify-around items-center py-2 md:hidden">
      {tabs.map((tab) => (
        <Link key={tab.href} href={tab.href} legacyBehavior>
          <a
            className={`flex flex-col items-center text-xs px-2 ${
              router.pathname === tab.href
                ? "text-orange-600 font-semibold"
                : "text-gray-500"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </a>
        </Link>
      ))}
    </nav>
  );
}
