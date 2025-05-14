// src/components/BottomTabBar.tsx
import Link from 'next/link';
import { FaChartBar, FaGift, FaUser, FaHome } from 'react-icons/fa';

export default function BottomTabBar() {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-md z-50 md:hidden">
      <div className="flex justify-around py-2 text-gray-600">
        <Link href="/" passHref>
          <div className="flex flex-col items-center">
            <FaHome className="text-xl" />
            <span className="text-xs">Home</span>
          </div>
        </Link>
        <Link href="/dashboard" passHref>
          <div className="flex flex-col items-center">
            <FaChartBar className="text-xl" />
            <span className="text-xs">Track</span>
          </div>
        </Link>
        <Link href="/rewards" passHref>
          <div className="flex flex-col items-center">
            <FaGift className="text-xl" />
            <span className="text-xs">Rewards</span>
          </div>
        </Link>
        <Link href="/profile" passHref>
          <div className="flex flex-col items-center">
            <FaUser className="text-xl" />
            <span className="text-xs">Profile</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
