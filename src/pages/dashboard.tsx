import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push('/');
    }
  }, [currentUser, router]);

  if (!currentUser) return null;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Dashboard</h1>
      <p>Welcome, {currentUser.email}</p>
    </div>
  );
}
