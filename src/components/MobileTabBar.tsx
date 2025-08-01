import { useRouter } from "next/router";
import { Home, LayoutDashboard, Gift, User, Shield } from "lucide-react";
import { useAuth } from "@/lib/AuthProvider";

const ADMIN_EMAILS = ["gary.reinhold@leafpays.com"];

export default function MobileTabBar() {
  const auth = useAuth();
  const currentUser = auth?.currentUser;
  const router = useRouter();
  const isAdmin = currentUser && ADMIN_EMAILS.includes(currentUser.email || "");

  const tabs = [
    {
      href: "/dashboard",
      icon: <Home size={22} />,
    },
    {
      href: "/rewards",
      icon: <Gift size={22} />,
    },
    ...(
      isAdmin
        ? [
            {
              href: "/admin/rewards",
              icon: <Shield size={22} />,
            },
          ]
        : []
    ),
    {
      href: "/profile",
      icon: <User size={22} />,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md flex justify-around p-2 z-50">
      {tabs.map((tab, idx) => (
        <button key={idx} onClick={() => router.push(tab.href)}>
          {tab.icon}
        </button>
      ))}
    </div>
  );
}
