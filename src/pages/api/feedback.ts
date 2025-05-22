import type { NextApiRequest, NextApiResponse } from 'next';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
const serviceAccount = require('../../firebase/serviceAccount.json'); // Use require!

if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount as any) });
}
const db = getFirestore();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { userId, suggestion } = req.body;
  if (!userId || !suggestion) return res.status(400).json({ error: 'Missing fields' });

  await db.collection('suggestions').add({
    userId,
    suggestion,
    createdAt: new Date(),
  });

  return res.status(200).json({ success: true });
}
