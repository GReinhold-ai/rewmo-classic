import Link from "next/link";
import { useRouter } from "next/router";

const tabs = [
  { label: "Home", path: "/" },
  { label: "Features", path: "/features" },
  { label: "Rewards", path: "/rewards" },
  { label: "Shopping", path: "/shopping" },
  { label: "Profile", path: "/profile" },
];

export default function BottomTabBar() {
  const router = useRouter();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-black border-t border-gray-800 flex justify-around items-center py-2 shadow-lg md:hidden">
      {tabs.map((tab) => (
        <Link key={tab.path} href={tab.path}>
          <span
            className={`flex flex-col items-center text-xs ${
              router.pathname === tab.path
                ? "text-orange-500 font-semibold"
                : "text-gray-300"
            }`}
          >
            {tab.label}
          </span>
        </Link>
      ))}
    </nav>
  );
}
