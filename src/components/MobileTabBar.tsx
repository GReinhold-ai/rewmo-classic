import Link from 'next/link';
import { useRouter } from 'next/router';

export default function MobileTabBar() {
  const { pathname } = useRouter();

  const isActive = (path: string) =>
    pathname === path ? 'text-orange-500 font-semibold' : 'text-gray-500';

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-2">
      <Link href="/dashboard" className={isActive('/dashboard')}>🏠</Link>
      <Link href="/profile" className={isActive('/profile')}>👤</Link>
      <Link href="/rewards" className={isActive('/rewards')}>🎁</Link>
      <Link href="/insights" className={isActive('/insights')}>💡</Link>
      <Link href="/analytics" className={isActive('/analytics')}>📊</Link>
    </nav>
  );
}
