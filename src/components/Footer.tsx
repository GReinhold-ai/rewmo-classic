import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full text-center py-6 text-gray-500 text-sm bg-white dark:bg-gray-900 mt-12 border-t">
      <p>© {new Date().getFullYear()} RewMo. All Rights Reserved.</p>
      <div className="flex justify-center gap-6 mt-2">
        <Link href="/" className="hover:underline">Home</Link>
        <Link href="/features" className="hover:underline">Features</Link>
        <Link href="/about" className="hover:underline">How It Works</Link>
        <Link href="/shopping" className="hover:underline">Shopping</Link>
      </div>
    </footer>
  );
}
