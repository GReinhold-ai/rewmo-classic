// src/components/Navbar.tsx
import Link from 'next/link';
import { useAuth } from '@/lib/useAuth';

export default function Navbar() {
  const { currentUser } = useAuth();

  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow-sm">
      <div className="flex space-x-4 text-orange-600 text-sm">
        <Link href="/">Home</Link>
        <Link href="/profile">Profile</Link>
        <Link href="/rewards">Rewards</Link>
        <Link href="/dashboard">Dashboard</Link>
      </div>
      {currentUser && (
        <span className="text-sm text-gray-600">Welcome, {currentUser.displayName?.split(' ')[0]}</span>
      )}
    </nav>
  );
}
