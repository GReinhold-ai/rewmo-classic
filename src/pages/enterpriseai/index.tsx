// src/pages/enterpriseai/index.tsx
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { auth } from '@/lib/firebaseClient';
import { onAuthStateChanged } from 'firebase/auth';

const EnterpriseAI = () => {
  const [email, setEmail] = useState('');
  
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user?.email) {
        setEmail(user.email);
      }
    });
    return () => unsub();
  }, []);

  const handleCheckout = async () => {
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Something went wrong.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout.');
    }
  };

  return (
    <>
      <Head>
        <title>EnterpriseAI – AI Agent for CEOs</title>
        <meta name="description" content="Pre-order the AI Agent built for CEOs and startup founders." />
      </Head>
      <main className="min-h-screen bg-[#00343D] text-white flex items-center justify-center px-4 py-20">
        <div className="max-w-2xl w-full bg-[#00343D] border border-teal-600 rounded-xl p-8 text-center shadow-lg">
          <h1 className="text-2xl sm:text-3xl font-bold text-orange-400 mb-4">
            EnterpriseAI: The AI Agent for CEOs and Founders
          </h1>
          <p className="text-gray-300 mb-6">
            Make strategic planning faster, smarter, and AI-powered. Designed for startup and enterprise leaders ready to lead with clarity.
          </p>

          {!email && (
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 mb-4 w-full rounded border border-gray-300 text-black"
            />
          )}

          <button
            onClick={handleCheckout}
            className="mt-2 bg-orange-500 text-white font-bold py-2 px-6 rounded hover:bg-orange-600 transition"
          >
            Pre-Order Now
          </button>
        </div>
      </main>
    </>
  );
};

export default EnterpriseAI;
