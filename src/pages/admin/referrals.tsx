import Head from 'next/head';

export default function AdminReferrals() {
  return (
    <>
      <Head>
        <title>Admin: Referrals | RewMo</title>
      </Head>
      <main className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Referral Tracking</h1>
        <p className="text-gray-700">
          Review all referrals and milestones triggered by users.
        </p>
      </main>
    </>
  );
}
