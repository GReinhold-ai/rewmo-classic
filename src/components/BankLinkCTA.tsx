import Link from 'next/link';

export default function BankLinkCTA() {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow mt-6">
      <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
        🔗 Link Your Bank
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        Link your primary bank account to manage bills, rent, and savings — all from one place.
        Get smarter financial insights and automatic reward tracking.
      </p>

      <Link href="/link-bank">
        <button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-4 py-2 rounded transition">
          Link Bank Account
        </button>
      </Link>
    </div>
  );
}
