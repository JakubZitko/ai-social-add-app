import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import OpenAI from 'openai';
import axios from 'axios';
import { openaiApiKey, elevenLabsApiKey, syncLabsApiKey, ELEVENLABS_API_URL, SYNCLABS_API_URL } from '../config';
import { Project } from '../utils/types';

/**
 * Main orchestration function
 * Triggers when a new project document is created
 * Orchestrates the entire video generation pipeline:
 * 1. Validate content
 * 2. Deduct credits
 * 3. Generate audio (if TTS)
 * 4. Generate video
 * 5. Update project status
 */
export const onProjectCreated = functions.firestore
  .document('projects/{projectId}')
  .onCreate(async (snapshot, context) => {
    const projectId = context.params.projectId;
    const project = snapshot.data() as Project;

    functions.logger.info(`Processing new project: ${projectId}`);

    try {
      // Update status to processing
      await snapshot.ref.update({
        status: 'processing',
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Step 1: Validate content
      functions.logger.info('Step 1: Validating content');
      const contentToValidate =
        project.type === 'talking_actor'
          ? project.scriptText
          : project.gesturePrompt || '';

      const isContentValid = await validateContentInternal(contentToValidate);

      if (!isContentValid.isValid) {
        throw new Error(isContentValid.message || 'Content validation failed');
      }

      // Step 2: Deduct credits
      functions.logger.info('Step 2: Deducting credits');
      await deductCreditsInternal(project.userId, project.creditsUsed);

      let audioUrl = project.audioUrl || '';
      let audioDuration = 0;

      // Step 3: Generate audio (for talking actor with TTS)
      if (project.type === 'talking_actor' && project.audioType === 'tts') {
        functions.logger.info('Step 3: Generating audio with ElevenLabs');

        const audioResult = await generateAudioInternal(
          projectId,
          project.scriptText,
          project.selectedVoiceId || '',
          project.voiceSettings
        );

        audioUrl = audioResult.audioUrl;
        audioDuration = audioResult.duration;

        // Update project with audio URL
        await snapshot.ref.update({
          audioUrl,
          duration: audioDuration,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      // Step 4: Generate video
      functions.logger.info('Step 4: Initiating video generation');
      await generateVideoInternal(
        projectId,
        project.userId,
        audioUrl,
        project.selectedAvatarId,
        project.aspectRatio,
        project.type === 'gesture_only' ? project.gesturePrompt : undefined
      );

      functions.logger.info(
        `Project ${projectId} submitted for video generation`
      );

      // The webhook will update the project when video is ready
    } catch (error: any) {
      functions.logger.error(`Error processing project ${projectId}:`, error);

      // Update project with error
      await snapshot.ref.update({
        status: 'failed',
        errorMessage: error.message || 'Unknown error occurred',
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Refund credits if they were deducted
      try {
        await refundCredits(project.userId, project.creditsUsed, projectId);
      } catch (refundError) {
        functions.logger.error('Failed to refund credits:', refundError);
      }
    }
  });

/**
 * Internal helper: Validate content using OpenAI
 */
async function validateContentInternal(text: string) {
  try {
    const openai = new OpenAI({ apiKey: openaiApiKey.value() });

    const moderation = await openai.moderations.create({
      input: text,
    });

    const result = moderation.results[0];

    if (result.flagged) {
      const flaggedCategories = Object.entries(result.categories)
        .filter(([_, value]) => value)
        .map(([key]) => key);

      return {
        isValid: false,
        message: `Content flagged for: ${flaggedCategories.join(', ')}`,
      };
    }

    return { isValid: true };
  } catch (error: any) {
    functions.logger.error('Content validation error:', error);
    throw error;
  }
}

/**
 * Internal helper: Deduct credits from user
 */
async function deductCreditsInternal(userId: string, amount: number) {
  const db = admin.firestore();

  await db.runTransaction(async (transaction) => {
    const userRef = db.collection('users').doc(userId);
    const userDoc = await transaction.get(userRef);

    if (!userDoc.exists) {
      throw new Error('User not found');
    }

    const userData = userDoc.data();
    const currentCredits = userData?.credits || 0;

    if (currentCredits < amount) {
      throw new Error(
        `Insufficient credits. You have ${currentCredits} but need ${amount}.`
      );
    }

    transaction.update(userRef, {
      credits: admin.firestore.FieldValue.increment(-amount),
    });
  });
}

/**
 * Internal helper: Generate audio with ElevenLabs
 */
async function generateAudioInternal(
  projectId: string,
  text: string,
  voiceId: string,
  voiceSettings: any
) {
  try {
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
      },
    });

    await file.makePublic();

    const audioUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    const wordCount = text.split(' ').length;
    const duration = Math.ceil((wordCount / 150) * 60);

    return { audioUrl, duration };
  } catch (error: any) {
    functions.logger.error('Audio generation error:', error);
    throw new Error(`Failed to generate audio: ${error.message}`);
  }
}

/**
 * Internal helper: Initiate video generation
 */
async function generateVideoInternal(
  projectId: string,
  userId: string,
  audioUrl: string,
  avatarId: string,
  aspectRatio: string,
  gesturePrompt?: string
) {
  try {
    const webhookUrl = `https://us-central1-${process.env.GCLOUD_PROJECT}.cloudfunctions.net/handleVideoWebhook`;

    // For gesture-only videos
    if (gesturePrompt && !audioUrl) {
      await axios.post(
        `${SYNCLABS_API_URL}/generate-gesture`,
        {
          avatarId,
          prompt: gesturePrompt,
          aspectRatio,
          webhookUrl,
          metadata: { projectId, userId },
        },
        {
          headers: {
            Authorization: `Bearer ${syncLabsApiKey.value()}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return;
    }

    // For talking actor videos
    await axios.post(
      `${SYNCLABS_API_URL}/generate`,
      {
        audioUrl,
        avatarId,
        aspectRatio,
        syncMode: 'full',
        webhookUrl,
        metadata: { projectId, userId },
      },
      {
        headers: {
          Authorization: `Bearer ${syncLabsApiKey.value()}`,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error: any) {
    functions.logger.error('Video generation error:', error);
    throw new Error(`Failed to initiate video generation: ${error.message}`);
  }
}

/**
 * Internal helper: Refund credits
 */
async function refundCredits(
  userId: string,
  amount: number,
  projectId: string
) {
  const db = admin.firestore();

  await db.collection('users').doc(userId).update({
    credits: admin.firestore.FieldValue.increment(amount),
  });

  await db.collection('transactions').add({
    userId,
    type: 'refund',
    amount,
    projectId,
    description: 'Credit refund for failed video generation',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  functions.logger.info(`Refunded ${amount} credits to user ${userId}`);
}
