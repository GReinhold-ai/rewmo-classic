const admin = require('firebase-admin');
const csv = require('csv-parser');
const fs = require('fs');

// FIREBASE ADMIN INIT
admin.initializeApp({
  credential: admin.credential.applicationDefault(), // Or use serviceAccount
});
const db = admin.firestore();

// CONFIG
const CSV_PATH = './earnings.csv'; // path to your downloaded Amazon report
const REWARDS_COLLECTION = 'users'; // adjust if your users are stored differently

// Optionally, map Amazon affiliate tags to userIds/emails here:
const affiliateTagToUserId = {
  // 'your-affiliate-tag-20': 'userId1',
  // 'another-tag-20': 'userId2',
};

// MAIN
async function syncAmazonRewards() {
  const rewards = [];

  fs.createReadStream(CSV_PATH)
    .pipe(csv())
    .on('data', (row) => {
      // You may need to adjust field names based on your CSV structure!
      const tag = row['Tracking ID'];
      const date = row['Date'];
      const amount = parseFloat(row['Commission']);
      const product = row['Product Name'];

      if (amount > 0 && affiliateTagToUserId[tag]) {
        rewards.push({
          userId: affiliateTagToUserId[tag],
          reward: {
            type: 'amazon',
            amount,
            date: new Date(date),
            product,
            source: 'Amazon Associates',
          }
        });
      }
    })
    .on('end', async () => {
      console.log(`Parsed ${rewards.length} rewards from CSV`);
      for (const { userId, reward } of rewards) {
        await db
          .collection(REWARDS_COLLECTION)
          .doc(userId)
          .collection('rewards')
          .add(reward);
        console.log(`Reward added for user ${userId}: $${reward.amount} - ${reward.product}`);
      }
      console.log('Sync complete!');
      process.exit(0);
    });
}

syncAmazonRewards();
