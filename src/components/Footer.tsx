// src/components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-neutral-900 text-gray-200 text-sm py-5 px-4 mt-10 flex flex-col md:flex-row justify-between items-center">
      <div className="mb-2 md:mb-0">
        &copy; {new Date().getFullYear()} RewmoAI. All rights reserved.
      </div>
      <div className="flex space-x-4">
        <Link href="/support" className="hover:text-orange-400">Support</Link>
        <Link href="/privacy" className="hover:text-orange-400">Privacy</Link>
        <Link href="/terms" className="hover:text-orange-400">Terms</Link>
        <Link href="mailto:support@rewmo.ai" className="hover:text-orange-400">Contact</Link>
      </div>
    </footer>
  );
}
