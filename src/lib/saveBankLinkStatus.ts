// src/lib/saveBankLinkStatus.ts
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebaseClient';

export async function saveBankLinkStatus(userId: string) {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      bankLinked: true,
      linkedAt: serverTimestamp(),
    });
    console.log('✅ Bank link status updated in Firestore');
  } catch (error) {
    console.error('❌ Failed to update Firestore:', error);
    throw error;
  }
}
