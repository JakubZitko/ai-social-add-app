import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

/**
 * Handles webhook callbacks from video generation service
 * Updates project status and stores final video URL
 */
export const handleVideoWebhook = functions.https.onRequest(
  async (request, response) => {
    try {
      const { jobId, status, videoUrl, thumbnailUrl, duration, metadata, error } =
        request.body;

      functions.logger.info('Video webhook received:', {
        jobId,
        status,
        projectId: metadata?.projectId,
      });

      if (!metadata?.projectId) {
        functions.logger.error('No projectId in webhook metadata');
        response.status(400).json({ error: 'Missing projectId in metadata' });
        return;
      }

      const projectRef = admin
        .firestore()
        .collection('projects')
        .doc(metadata.projectId);

      const projectDoc = await projectRef.get();

      if (!projectDoc.exists) {
        functions.logger.error(`Project ${metadata.projectId} not found`);
        response.status(404).json({ error: 'Project not found' });
        return;
      }

      // Update project based on status
      if (status === 'completed') {
        await projectRef.update({
          status: 'completed',
          outputUrl: videoUrl,
          thumbnailUrl: thumbnailUrl || '',
          duration: duration || 0,
          completedAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        functions.logger.info(
          `Project ${metadata.projectId} completed successfully`
        );

        // TODO: Send email notification to user
      } else if (status === 'failed') {
        await projectRef.update({
          status: 'failed',
          errorMessage: error || 'Video generation failed',
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Refund credits
        const project = projectDoc.data();
        if (project?.userId && project?.creditsUsed) {
          const userRef = admin
            .firestore()
            .collection('users')
            .doc(project.userId);

          await userRef.update({
            credits: admin.firestore.FieldValue.increment(project.creditsUsed),
          });

          // Log transaction
          await admin.firestore().collection('transactions').add({
            userId: project.userId,
            type: 'refund',
            amount: project.creditsUsed,
            projectId: metadata.projectId,
            description: 'Credit refund for failed video generation',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          });

          functions.logger.info(
            `Refunded ${project.creditsUsed} credits to user ${project.userId}`
          );
        }
      }

      response.status(200).json({ success: true });
    } catch (error: any) {
      functions.logger.error('Webhook handling error:', error);
      response.status(500).json({ error: error.message });
    }
  }
);
