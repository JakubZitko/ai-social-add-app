import * as functions from 'firebase-functions';
import OpenAI from 'openai';
import { openaiApiKey } from '../config';
import { ContentModerationResult } from '../utils/types';

/**
 * Validates content using OpenAI Moderation API
 * Checks for violent, hateful, sexual, or dangerous content
 */
export const validateContent = functions.https.onCall(
  async (data: { text: string }, context) => {
    // Verify authentication
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'User must be authenticated to validate content.'
      );
    }

    const { text } = data;

    if (!text || typeof text !== 'string') {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Text content is required.'
      );
    }

    try {
      const openai = new OpenAI({ apiKey: openaiApiKey.value() });

      const moderation = await openai.moderations.create({
        input: text,
      });

      const result = moderation.results[0];

      // Check if content is flagged
      if (result.flagged) {
        const flaggedCategories = Object.entries(result.categories)
          .filter(([_, value]) => value)
          .map(([key]) => key);

        const response: ContentModerationResult = {
          isValid: false,
          flaggedCategories,
          message: `Content flagged for: ${flaggedCategories.join(', ')}. Please revise your script.`,
        };

        return response;
      }

      return {
        isValid: true,
        message: 'Content is appropriate.',
      };
    } catch (error: any) {
      functions.logger.error('Content validation error:', error);
      throw new functions.https.HttpsError(
        'internal',
        `Failed to validate content: ${error.message}`
      );
    }
  }
);
