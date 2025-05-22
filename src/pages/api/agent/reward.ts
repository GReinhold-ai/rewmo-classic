// src/pages/api/agent/reward.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import ExcelJS from 'exceljs';
import { OpenAI } from 'openai';
import serviceAccount from '@/firebase/serviceAccount.json'; // Adjust path if needed

// Initialize Firebase Admin SDK (safe to call multiple times)
if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount as any) });
}
const db = getFirestore();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ----------- Excel Download (GET) -----------
  if (req.method === 'GET') {
    const { userId, exportExcel } = req.query;
    if (!userId || typeof userId !== 'string') return res.status(400).json({ error: 'Missing userId' });

    if (exportExcel === 'true') {
      try {
        const snapshot = await db.collection(`users/${userId}/suggestions`).get();
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Suggestions');
        sheet.columns = [
          { header: 'Suggestion ID', key: 'id', width: 15 },
          { header: 'Content', key: 'content', width: 80 },
          { header: 'Timestamp', key: 'timestamp', width: 30 },
        ];

        snapshot.forEach(doc => {
          const suggestions = doc.data().suggestions || [];
          suggestions.forEach((s: any) => {
            sheet.addRow({ id: s.id, content: s.content, timestamp: s.timestamp });
          });
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=suggestions.xlsx');
        await workbook.xlsx.write(res);
        res.end();
        return;
      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Excel export failed.' });
      }
    }
    return res.status(405).json({ error: 'GET only supports exportExcel.' });
  }

  // ----------- AI Suggestions (POST) -----------
  if (req.method === 'POST') {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'Missing userId' });

    try {
      // AI prompt (customize for your brand/needs)
      const prompt = `
        Generate three short, actionable, personalized reward suggestions for a RewmoAI member who prefers American Made products. 
        Each should target one of: Amazon, Walmart, or Target.
        Each suggestion should be a single sentence.
        Format as a simple list, no numbering or extra text.
      `;

      // Call OpenAI API
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'system', content: prompt }],
        max_tokens: 250,
      });

      const text = completion.choices[0].message.content ?? '';
      // Parse response to array
      const aiSuggestions = text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map((content, idx) => ({
          id: String(idx + 1),
          content,
          timestamp: new Date().toISOString(),
        }));

      // Save suggestions in Firestore
      await db.collection('users').doc(userId).collection('suggestions').doc('latest').set({
        suggestions: aiSuggestions,
        createdAt: new Date(),
      });

      return res.status(200).json({ success: true, suggestions: aiSuggestions });
    } catch (err) {
      console.error('AI suggestion error:', err);
      return res.status(500).json({ error: 'Suggestion generation failed.' });
    }
  }

  // ----------- Method Not Allowed -----------
  return res.status(405).json({ error: 'Method not allowed' });
}
