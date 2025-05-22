// src/pages/api/agent/reward.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// 1. Build service account from ENV VARS
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

// 2. Initialize Firebase Admin SDK if not already
if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount as any),
  });
}
const db = getFirestore();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Simple test endpoint
  if (req.method === 'GET') {
    return res.status(200).json({ message: 'Rewards API is working!' });
  }

  // Example: Handle POSTs (save reward, etc.)
  if (req.method === 'POST') {
    try {
      const { userId, rewardType, points } = req.body;
      if (!userId || !rewardType || !points) {
        return res.status(400).json({ error: 'Missing parameters.' });
      }
      // Example Firestore save
      await db.collection('rewards').add({
        userId,
        rewardType,
        points,
        createdAt: new Date(),
      });
      return res.status(201).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: (err as Error).message });
    }
  }

  // Only allow GET and POST
  return res.status(405).json({ error: 'Method not allowed' });
}
