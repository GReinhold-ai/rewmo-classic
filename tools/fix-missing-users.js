// tools/fix-missing-users.js
// This script creates Firestore documents for users who are in Auth but missing their Firestore profile
// Run: node tools/fix-missing-users.js

const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// Download your service account key from:
// Firebase Console → Project Settings → Service Accounts → Generate New Private Key
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const auth = admin.auth();
const db = admin.firestore();

async function fixMissingUsers() {
  console.log('🔍 Scanning for users in Auth without Firestore documents...\n');

  try {
    // Get all users from Firebase Auth
    const listUsersResult = await auth.listUsers(1000);
    const authUsers = listUsersResult.users;
    
    console.log(`Found ${authUsers.length} users in Firebase Auth\n`);

    let fixed = 0;
    let alreadyExist = 0;
    const missingUsers = [];

    for (const user of authUsers) {
      const userRef = db.collection('users').doc(user.uid);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        console.log(`❌ Missing Firestore doc for: ${user.email || user.uid}`);
        missingUsers.push(user);

        // Create the missing document
        const userData = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || user.email?.split('@')[0] || 'User',
          photoURL: user.photoURL || null,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
          
          // Rewards & Tier
          rewardPoints: 0,
          rewards: 0,
          membershipTier: 'Silver',
          tier: 'FREE',
          goal: 10000,
          
          // Referrals
          referralCode: `REF-${user.uid.slice(0, 8)}`,
          referredBy: null,
          referralCount: 0,
        };

        await userRef.set(userData);
        console.log(`✅ Created Firestore document for: ${user.email || user.uid}\n`);
        fixed++;
      } else {
        alreadyExist++;
      }
    }

    console.log('\n📊 Summary:');
    console.log(`✅ Users with existing Firestore docs: ${alreadyExist}`);
    console.log(`🔧 Users fixed (docs created): ${fixed}`);
    console.log(`📝 Total users in Auth: ${authUsers.length}`);

    if (missingUsers.length > 0) {
      console.log('\n📋 Fixed users:');
      missingUsers.forEach(user => {
        console.log(`  - ${user.email || user.uid} (${user.uid})`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }

  process.exit(0);
}

// Run the script
fixMissingUsers();