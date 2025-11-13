import * as functions from 'firebase-functions';
import axios from 'axios';
import { syncLabsApiKey, SYNCLABS_API_URL } from '../config';
import { VideoGenerationResult } from '../utils/types';

/**
 * Generates video using SyncLabs API
 * This initiates the video generation job
 * The actual video URL will be delivered via webhook
 */
export const generateVideo = functions.https.onCall(
  async (
    data: {
      projectId: string;
      audioUrl: string;
      avatarId: string;
      aspectRatio: string;
      gesturePrompt?: string;
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

    const { projectId, audioUrl, avatarId, aspectRatio, gesturePrompt } = data;

    if (!projectId || !avatarId) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Missing required parameters.'
      );
    }

    try {
      functions.logger.info(
        `Generating video for project ${projectId} with avatar ${avatarId}`
      );

      // For gesture-only videos
      if (gesturePrompt && !audioUrl) {
        const response = await axios.post(
          `${SYNCLABS_API_URL}/generate-gesture`,
          {
            avatarId,
            prompt: gesturePrompt,
            aspectRatio,
            webhookUrl: `https://us-central1-${process.env.GCLOUD_PROJECT}.cloudfunctions.net/handleVideoWebhook`,
            metadata: {
              projectId,
              userId: context.auth.uid,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${syncLabsApiKey.value()}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const result: VideoGenerationResult = {
          videoUrl: '', // Will be provided by webhook
          thumbnailUrl: '',
          duration: 5,
          jobId: response.data.jobId,
        };

        return result;
      }

      // For talking actor videos
      const response = await axios.post(
        `${SYNCLABS_API_URL}/generate`,
        {
          audioUrl,
          avatarId,
          aspectRatio,
          syncMode: 'full', // Full lip-sync
          webhookUrl: `https://us-central1-${process.env.GCLOUD_PROJECT}.cloudfunctions.net/handleVideoWebhook`,
          metadata: {
            projectId,
            userId: context.auth.uid,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${syncLabsApiKey.value()}`,
            'Content-Type': 'application/json',
          },
        }
      );

      functions.logger.info(
        `Video generation job started: ${response.data.jobId}`
      );

      const result: VideoGenerationResult = {
        videoUrl: '', // Will be provided by webhook
        thumbnailUrl: '',
        duration: 0, // Will be calculated from audio
        jobId: response.data.jobId,
      };

      return result;
    } catch (error: any) {
      functions.logger.error('Video generation error:', error);

      if (error.response) {
        functions.logger.error('API Error Response:', error.response.data);
      }

      throw new functions.https.HttpsError(
        'internal',
        `Failed to generate video: ${error.message}`
      );
    }
  }
);
