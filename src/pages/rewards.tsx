import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function RewardsPage() {
  return (
    <main className="min-h-screen bg-black text-white px-4 py-12 flex flex-col items-center">
      <div className="mb-10 text-center">
        <Image src="/rewmo-logo.png" alt="RewmoAI Logo" width={100} height={100} className="mx-auto mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold">
          Featured <span className="text-orange-500">Shopping Rewards</span>
        </h1>
        <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
          Earn points every time you shop at your favorite retailers. Track your rewards, save more, and unlock exclusive offers.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl w-full">
        <div className="bg-white text-black p-6 rounded-2xl shadow-md flex flex-col items-center text-center">
          <Image src="/amazon.png" alt="Amazon" width={80} height={80} className="mb-4" />
          <h3 className="text-xl font-semibold mb-2">Amazon</h3>
          <p className="text-sm text-gray-700 mb-4">Earn up to 5% back on your everyday Amazon purchases.</p>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white w-full">Shop & Earn</Button>
        </div>
        <div className="bg-white text-black p-6 rounded-2xl shadow-md flex flex-col items-center text-center">
          <Image src="/target.png" alt="Target" width={80} height={80} className="mb-4" />
          <h3 className="text-xl font-semibold mb-2">Target</h3>
          <p className="text-sm text-gray-700 mb-4">Get rewarded for every purchase made at Target stores.</p>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white w-full">Shop & Earn</Button>
        </div>
        <div className="bg-white text-black p-6 rounded-2xl shadow-md flex flex-col items-center text-center">
          <Image src="/walmart.png" alt="Walmart" width={80} height={80} className="mb-4" />
          <h3 className="text-xl font-semibold mb-2">Walmart</h3>
          <p className="text-sm text-gray-700 mb-4">Turn your Walmart shopping into real value with RewmoAI points.</p>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white w-full">Shop & Earn</Button>
        </div>
      </div>

      <div className="mt-16 text-sm text-gray-400 text-center">
        More retail partners coming soon.
      </div>

      <footer className="mt-10 text-sm text-gray-500 space-x-4 text-center">
        <Link href="/">Home</Link>
        <Link href="/profile">Profile</Link>
        <Link href="/rewards">Rewards</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
      </footer>
    </main>
  );
}
