import Head from 'next/head';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About RewMo | How It Works</title>
        <meta name="description" content="Discover how RewMo helps you turn everyday payments into unstoppable rewards. Join the rewards movement today!" />
      </Head>

      <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-br from-blue-50 to-blue-100 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6">
          How RewMo Works
        </h1>

        <p className="text-lg text-gray-700 max-w-3xl mb-10">
          RewMo makes your everyday payments — mortgage, rent, car payments, Amazon purchases — work for you by turning them into valuable reward points.  
          The longer you save, the more powerful your rewards grow.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl">
          <StepCard number="1" title="Pay Normally" description="Use RewMo for your existing monthly payments — rent, mortgage, car loans, Amazon orders, and more." />
          <StepCard number="2" title="Earn Instantly" description="Every dollar you spend earns reward points automatically, without any extra effort." />
          <StepCard number="3" title="Redeem Rewards" description="Trade points for flights, shopping, rent reductions, and future savings boosts!" />
        </div>

        <Link href="/signin" className="mt-10 inline-block px-8 py-4 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition font-semibold">
          🚀 Join RewMo Today
        </Link>
      </main>
    </>
  );
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition transform hover:scale-105">
      <div className="text-blue-600 text-3xl font-extrabold mb-2">{number}</div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}
