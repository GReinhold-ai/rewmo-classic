export type UserData = {
  uid: string;
  email: string;
  name: string;
  rewardPoints: number;
  membershipTier: "Silver" | "Gold" | "Platinum" | string;
  goal: number;
  referralCode: string;
  referralCount: number;
  createdAt?: unknown; // Firestore serverTimestamp()
};
