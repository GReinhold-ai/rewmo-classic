import {onCall} from "firebase-functions/v2/https";
import {getFirestore} from "firebase-admin/firestore";
import {logger} from "firebase-functions";

const db = getFirestore();

export const logRewardRedemption = onCall({region: "us-central1"}, async (request) => {
  const {userId, rewardType, pointsUsed} = request.data;

  if (!userId || !rewardType || !pointsUsed) {
    logger.error("Missing required fields:", {userId, rewardType, pointsUsed});
    throw new Error("Missing required fields");
  }

  try {
    await db
      .collection("users")
      .doc(userId)
      .collection("rewards")
      .add({
        type: rewardType,
        pointsUsed,
        redeemedAt: new Date().toISOString(),
      });

    logger.info(`✅ Logged reward for ${userId}: ${rewardType} (-${pointsUsed})`);
    return {success: true};
  } catch (error) {
    logger.error("❌ Failed to log redemption:", error);
    throw new Error("Failed to log reward redemption");
  }
});
