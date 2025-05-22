// src/components/BottomTabBar.tsx
import Link from "next/link";
import { useRouter } from "next/router";
import { Home, Gift, ShoppingCart, User, Info } from "lucide-react"; // icons

const tabs = [
  { href: "/", label: "Home", icon: <Home size={22} /> },
  { href: "/rewards", label: "Rewards", icon: <Gift size={22} /> },
  { href: "/shopping", label: "Shop", icon: <ShoppingCart size={22} /> },
  { href: "/profile", label: "Profile", icon: <User size={22} /> },
  { href: "/about", label: "About", icon: <Info size={22} /> },
];

export default function BottomTabBar() {
  const router = useRouter();
  return (
    <nav className="fixed md:hidden bottom-0 left-0 right-0 z-40 bg-black text-white flex justify-around items-center h-14 border-t border-neutral-800">
      {tabs.map((tab) => (
        <Link key={tab.href} href={tab.href} className="flex flex-col items-center">
          <span className={router.pathname === tab.href ? "text-orange-400" : "text-gray-300"}>
            {tab.icon}
          </span>
          <span className="text-xs mt-1">{tab.label}</span>
        </Link>
      ))}
    </nav>
  );
}
