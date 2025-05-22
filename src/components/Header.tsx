import MobileDrawer from "@/components/MobileDrawer";

export default function Header() {
  return (
    <header className="w-full flex items-center justify-between px-4 py-3 bg-white shadow-md md:hidden z-50">
      {/* Hamburger Menu for Mobile */}
      <MobileDrawer />
      {/* App Name/Logo */}
      <span className="font-extrabold text-xl text-orange-600 tracking-tight ml-2">
        RewmoAI
      </span>
    </header>
  );
}
