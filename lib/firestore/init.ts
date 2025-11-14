import { db } from '@/lib/firebase/config';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  increment,
} from 'firebase/firestore';

/**
 * Initialize a new user in Firestore after authentication
 */
export async function initializeUser(userId: string, email: string, displayName?: string) {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    await setDoc(userRef, {
      email,
      displayName: displayName || email.split('@')[0],
      credits: 10, // Free starter credits
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      plan: 'free',
      totalSpent: 0,
      totalCreditsEarned: 10,
      videoCount: 0,
      settings: {
        notifications: {
          email: true,
          videoComplete: true,
          videoFailed: true,
          weeklyReport: true,
          productUpdates: false,
        },
        language: 'en-US',
        timezone: 'America/Los_Angeles',
      },
    });
    console.log('✅ User initialized in Firestore:', userId);
  }

  return userRef;
}

/**
 * Get user credits
 */
export async function getUserCredits(userId: string): Promise<number> {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    return userDoc.data().credits || 0;
  }

  return 0;
}

/**
 * Deduct credits from user account
 */
export async function deductCredits(userId: string, amount: number): Promise<boolean> {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    throw new Error('User not found');
  }

  const currentCredits = userDoc.data().credits || 0;

  if (currentCredits < amount) {
    throw new Error('Insufficient credits');
  }

  await updateDoc(userRef, {
    credits: increment(-amount),
    updatedAt: serverTimestamp(),
  });

  console.log(`✅ Deducted ${amount} credits from user ${userId}`);
  return true;
}

/**
 * Add credits to user account
 */
export async function addCredits(
  userId: string,
  amount: number,
  reason: string = 'purchase'
): Promise<void> {
  const userRef = doc(db, 'users', userId);

  await updateDoc(userRef, {
    credits: increment(amount),
    totalCreditsEarned: increment(amount),
    updatedAt: serverTimestamp(),
  });

  // Log transaction
  const transactionRef = doc(collection(db, 'transactions'));
  await setDoc(transactionRef, {
    userId,
    type: 'credit_added',
    amount,
    reason,
    createdAt: serverTimestamp(),
  });

  console.log(`✅ Added ${amount} credits to user ${userId}. Reason: ${reason}`);
}

/**
 * Record video generation transaction
 */
export async function recordVideoTransaction(
  userId: string,
  projectId: string,
  creditsUsed: number
): Promise<void> {
  const transactionRef = doc(collection(db, 'transactions'));

  await setDoc(transactionRef, {
    userId,
    projectId,
    type: 'video_generation',
    creditsUsed,
    createdAt: serverTimestamp(),
  });

  // Update user video count
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    videoCount: increment(1),
  });
}
