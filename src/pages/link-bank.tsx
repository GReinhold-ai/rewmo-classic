import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { saveBankLinkStatus } from '@/lib/saveBankLinkStatus';
import { useAuth } from "@/lib/AuthProvider";
import BottomTabBar from '@/components/BottomTabBar';

export default function LinkBankPage() {
  const router = useRouter();
  const { currentUser } = useAuth(); // must return currentUser?.uid

  const handleLinkBank = async () => {
    if (!currentUser?.uid) return alert("You must be logged in");

    await saveBankLinkStatus(currentUser.uid);
    alert("Bank linked successfully!");
    router.push('/profile');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-xl font-bold mb-4">Link Your Bank</h1>
      <p className="text-sm text-center max-w-md mb-6">
        This is a mock experience for testing purposes. Once Rewmo is verified with Plaid, this page will connect to real bank accounts.
      </p>
      <button
        onClick={handleLinkBank}
        className="bg-orange-600 text-white font-semibold px-6 py-3 rounded hover:bg-orange-700"
      >
        Link Sandbox Bank Account
      </button>
      <BottomTabBar />
    </div>
  );
}
