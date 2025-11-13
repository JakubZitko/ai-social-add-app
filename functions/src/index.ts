import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin
admin.initializeApp();

// Export all functions
export { onProjectCreated } from './triggers/onProjectCreated';
export { validateContent } from './api/validateContent';
export { generateAudio } from './api/generateAudio';
export { generateVideo } from './api/generateVideo';
export { handleVideoWebhook } from './api/handleVideoWebhook';
export { deductCredits } from './api/deductCredits';

// Health check endpoint
export const healthCheck = functions.https.onRequest((request, response) => {
  response.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'VideoAI Cloud Functions',
  });
});
