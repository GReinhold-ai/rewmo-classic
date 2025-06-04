import { onCall } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import sgMail from "@sendgrid/mail";

admin.initializeApp();
const db = admin.firestore();

// Read SendGrid key from Firebase functions config
const SENDGRID_API_KEY = functions.config().sendgrid.key;
sgMail.setApiKey(SENDGRID_API_KEY);

interface ReferralPayload {
  referrerId: string;
  newUserId: string;
  newUserEmail: string; // Optional: pass this from client if you want to email the referred person too
}

export const handleReferral = onCall({ region: "us-central1" }, async (request) => {
  const { referrerId, newUserId } = request.data as ReferralPayload;

  if (!referrerId || !newUserId) {
    throw new Error("Missing referrerId or newUserId");
  }

  const referrerRef = db.collection("users").doc(referrerId);

  await referrerRef.set(
    {
      referralCount: admin.firestore.FieldValue.increment(1),
      referrals: admin.firestore.FieldValue.arrayUnion(newUserId),
    },
    { merge: true }
  );

  const refSnap = await referrerRef.get();
  const referralCount = refSnap.data()?.referralCount || 0;

  // === SENDGRID EMAIL NOTIFICATION (add this part!) ===
  try {
    await sgMail.send({
      to: "YOUR-TEST-EMAIL@domain.com", // <-- Change this to referrer's email or your test email
      from: "noreply@rewmo.ai", // <-- Must be a verified sender in SendGrid!
      subject: "You got a new referral on RewmoAI!",
      text: `Congrats! You just referred a new member. Your current referral count is ${referralCount}.`,
      // Optionally add html: "<b>Congrats...</b>"
    });
  } catch (e) {
    console.error("SendGrid error:", e);
  }
  // === END EMAIL SECTION ===

  if (referralCount % 5 === 0) {
    await referrerRef.update({
      totalPoints: admin.firestore.FieldValue.increment(1000),
    });
  }

  return { status: "success", newCount: referralCount };
});
