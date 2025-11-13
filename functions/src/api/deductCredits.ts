import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

/**
 * Deducts credits from user account
 * Uses Firestore transaction to ensure atomic operation
 */
export const deductCredits = functions.https.onCall(
  async (
    data: {
      projectId: string;
      creditsToDeduct: number;
    },
    context
  ) => {
    // Verify authentication
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'User must be authenticated.'
      );
    }

    const { projectId, creditsToDeduct } = data;
    const userId = context.auth.uid;

    if (!projectId || !creditsToDeduct || creditsToDeduct <= 0) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Invalid parameters.'
      );
    }

    try {
      const db = admin.firestore();

      // Use transaction to ensure atomic credit deduction
      await db.runTransaction(async (transaction) => {
        const userRef = db.collection('users').doc(userId);
        const userDoc = await transaction.get(userRef);

        if (!userDoc.exists) {
          throw new functions.https.HttpsError('not-found', 'User not found.');
        }

        const userData = userDoc.data();
        const currentCredits = userData?.credits || 0;

        if (currentCredits < creditsToDeduct) {
          throw new functions.https.HttpsError(
            'failed-precondition',
            `Insufficient credits. You have ${currentCredits} credits but need ${creditsToDeduct}.`
          );
        }

        // Deduct credits
        transaction.update(userRef, {
          credits: admin.firestore.FieldValue.increment(-creditsToDeduct),
        });

        // Log transaction
        const transactionRef = db.collection('transactions').doc();
        transaction.set(transactionRef, {
          userId,
          type: 'usage',
          amount: -creditsToDeduct,
          projectId,
          description: 'Credits used for video generation',
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      });

      functions.logger.info(
        `Deducted ${creditsToDeduct} credits from user ${userId} for project ${projectId}`
      );

      return {
        success: true,
        message: `${creditsToDeduct} credits deducted successfully`,
      };
    } catch (error: any) {
      functions.logger.error('Credit deduction error:', error);
      throw error;
    }
  }
);
