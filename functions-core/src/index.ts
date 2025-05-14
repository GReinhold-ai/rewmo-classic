import {onCall} from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

interface ReferralPayload {
  referrerId: string;
  newUserId: string;
}

export const handleReferral = onCall({region: "us-central1"}, async (request) => {
  const {referrerId, newUserId} = request.data as ReferralPayload;

  if (!referrerId || !newUserId) {
    throw new Error("Missing referrerId or newUserId");
  }

  const referrerRef = db.collection("users").doc(referrerId);

  await referrerRef.set(
    {
      referralCount: admin.firestore.FieldValue.increment(1),
      referrals: admin.firestore.FieldValue.arrayUnion(newUserId),
    },
    {merge: true}
  );

  const refSnap = await referrerRef.get();
  const referralCount = refSnap.data()?.referralCount || 0;

  if (referralCount % 5 === 0) {
    await referrerRef.update({
      totalPoints: admin.firestore.FieldValue.increment(1000),
    });
  }

  return {status: "success", newCount: referralCount};
});
