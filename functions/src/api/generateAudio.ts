import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';
import { elevenLabsApiKey, ELEVENLABS_API_URL } from '../config';
import { AudioGenerationResult, VoiceSettings } from '../utils/types';

/**
 * Generates audio using ElevenLabs Text-to-Speech API
 * Uploads the generated audio to Firebase Storage
 */
export const generateAudio = functions.https.onCall(
  async (
    data: {
      projectId: string;
      text: string;
      voiceId: string;
      voiceSettings: VoiceSettings;
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

    const { projectId, text, voiceId, voiceSettings } = data;

    if (!projectId || !text || !voiceId) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Missing required parameters.'
      );
    }

    try {
      functions.logger.info(
        `Generating audio for project ${projectId} with voice ${voiceId}`
      );

      // Call ElevenLabs API
      const response = await axios.post(
        `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`,
        {
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: voiceSettings.stability,
            similarity_boost: voiceSettings.similarity,
            style: voiceSettings.styleExaggeration,
            use_speaker_boost: true,
          },
        },
        {
          headers: {
            'xi-api-key': elevenLabsApiKey.value(),
            'Content-Type': 'application/json',
            Accept: 'audio/mpeg',
          },
          responseType: 'arraybuffer',
        }
      );

      // Upload to Firebase Storage
      const bucket = admin.storage().bucket();
      const fileName = `audio/${projectId}/generated.mp3`;
      const file = bucket.file(fileName);

      await file.save(Buffer.from(response.data), {
        metadata: {
          contentType: 'audio/mpeg',
          metadata: {
            projectId,
            voiceId,
            generatedAt: new Date().toISOString(),
          },
        },
      });

      // Make the file publicly accessible
      await file.makePublic();

      const audioUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

      // Calculate approximate duration (rough estimate)
      const wordCount = text.split(' ').length;
      const duration = Math.ceil((wordCount / 150) * 60); // ~150 words per minute

      functions.logger.info(`Audio generated successfully: ${audioUrl}`);

      const result: AudioGenerationResult = {
        audioUrl,
        duration,
      };

      return result;
    } catch (error: any) {
      functions.logger.error('Audio generation error:', error);

      if (error.response) {
        functions.logger.error('API Error Response:', error.response.data);
      }

      throw new functions.https.HttpsError(
        'internal',
        `Failed to generate audio: ${error.message}`
      );
    }
  }
);
