import type { NextApiRequest, NextApiResponse } from 'next';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import ExcelJS from 'exceljs';
const serviceAccount = require('../../../firebase/serviceAccount.json');

if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount as any) });
}
const db = getFirestore();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const snapshot = await db.collection('suggestions').get();
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('User Suggestions');
  sheet.columns = [
    { header: 'User ID', key: 'userId', width: 30 },
    { header: 'Suggestion', key: 'suggestion', width: 80 },
    { header: 'Created At', key: 'createdAt', width: 30 },
  ];

  snapshot.forEach(doc => {
    const data = doc.data();
    sheet.addRow({
      userId: data.userId,
      suggestion: data.suggestion,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : '',
    });
  });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=suggestions.xlsx');
  await workbook.xlsx.write(res);
  res.end();
};
