import { updateProjectWithVideo, updateProjectStatus } from '@/lib/firestore/projects';
import { uploadVideoToStorage } from '@/lib/storage/upload';

/**
 * Video generation configuration
 */
interface VideoConfig {
  projectId: string;
  userId: string;
  script: string;
  avatar: string;
  voice: string;
  aspectRatio: '16:9' | '9:16' | '1:1';
  background: string;
}

/**
 * D-ID API Configuration
 * Docs: https://docs.d-id.com/reference/create-talk-stream
 */
const DID_API_KEY = process.env.DID_API_KEY || '';
const DID_API_URL = 'https://api.d-id.com/talks';

/**
 * Main video generation function
 */
export async function generateVideo(config: VideoConfig): Promise<void> {
  const { projectId, userId, script, avatar, voice, aspectRatio, background } = config;

  console.log(`🎬 Starting video generation for project ${projectId}`);

  try {
    // Step 1: Generate TTS audio (if needed)
    const audioUrl = await generateTTS(script, voice);
    console.log(`🎤 Audio generated: ${audioUrl}`);

    // Step 2: Create video with D-ID or similar service
    const videoResult = await createDIDVideo({
      script,
      audioUrl,
      avatar,
      aspectRatio,
    });

    console.log(`🎥 Video generation initiated: ${videoResult.id}`);

    // Step 3: Poll for completion
    const completedVideo = await pollVideoStatus(videoResult.id);

    if (!completedVideo.resultUrl) {
      throw new Error('Video generation failed - no result URL');
    }

    console.log(`✅ Video completed: ${completedVideo.resultUrl}`);

    // Step 4: Download and upload to Firebase Storage
    const { videoUrl, thumbnailUrl } = await uploadVideoToStorage(
      completedVideo.resultUrl,
      userId,
      projectId
    );

    // Step 5: Update project with final video
    await updateProjectWithVideo(
      projectId,
      videoUrl,
      thumbnailUrl,
      completedVideo.duration || 30
    );

    console.log(`🎉 Project ${projectId} completed successfully`);
  } catch (error: any) {
    console.error(`❌ Video generation failed for project ${projectId}:`, error);
    await updateProjectStatus(projectId, 'failed', {
      errorMessage: error.message,
    });
    throw error;
  }
}

/**
 * Generate TTS audio using ElevenLabs or similar
 */
async function generateTTS(text: string, voiceId: string): Promise<string> {
  // For now, we'll use a placeholder
  // TODO: Integrate with ElevenLabs API
  const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

  if (!ELEVENLABS_API_KEY) {
    console.warn('⚠️ ElevenLabs API key not configured, using default voice');
    return 'https://example.com/default-audio.mp3'; // Placeholder
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.statusText}`);
    }

    // Upload audio to storage and return URL
    // TODO: Implement audio upload to Firebase Storage
    const audioBlob = await response.blob();

    return 'https://example.com/audio.mp3'; // Placeholder
  } catch (error) {
    console.error('TTS generation error:', error);
    throw error;
  }
}

/**
 * Create video using D-ID API
 */
async function createDIDVideo(config: {
  script: string;
  audioUrl: string;
  avatar: string;
  aspectRatio: string;
}): Promise<{ id: string; status: string }> {
  if (!DID_API_KEY) {
    console.warn('⚠️ D-ID API key not configured, using mock response');
    // Return mock response for development
    return {
      id: `mock_${Date.now()}`,
      status: 'created',
    };
  }

  try {
    const response = await fetch(DID_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${DID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        script: {
          type: 'audio',
          audio_url: config.audioUrl,
        },
        source_url: getAvatarUrl(config.avatar),
        config: {
          stitch: true,
          result_format: 'mp4',
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`D-ID API error: ${error.message || response.statusText}`);
    }

    const data = await response.json();
    return {
      id: data.id,
      status: data.status,
    };
  } catch (error) {
    console.error('D-ID video creation error:', error);
    throw error;
  }
}

/**
 * Poll D-ID for video completion
 */
async function pollVideoStatus(
  videoId: string,
  maxAttempts: number = 60,
  interval: number = 5000
): Promise<{ resultUrl: string; duration?: number }> {
  if (videoId.startsWith('mock_')) {
    // Mock response for development
    console.log('📝 Using mock video response');
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate delay
    return {
      resultUrl: 'https://storage.googleapis.com/sample-videos/video.mp4',
      duration: 30,
    };
  }

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await fetch(`${DID_API_URL}/${videoId}`, {
        headers: {
          'Authorization': `Basic ${DID_API_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to check video status: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.status === 'done') {
        return {
          resultUrl: data.result_url,
          duration: data.duration,
        };
      }

      if (data.status === 'error') {
        throw new Error(`Video generation failed: ${data.error?.message || 'Unknown error'}`);
      }

      // Still processing, wait and try again
      console.log(`⏳ Video ${videoId} status: ${data.status} (attempt ${attempt + 1}/${maxAttempts})`);
      await new Promise((resolve) => setTimeout(resolve, interval));
    } catch (error) {
      console.error(`Error polling video status (attempt ${attempt + 1}):`, error);
      if (attempt === maxAttempts - 1) {
        throw error;
      }
    }
  }

  throw new Error('Video generation timeout - exceeded maximum polling attempts');
}

/**
 * Get avatar URL from avatar ID
 */
function getAvatarUrl(avatarId: string): string {
  // Map avatar IDs to actual URLs
  // TODO: Load from database or config
  const avatarMap: Record<string, string> = {
    'sarah': 'https://d-id-public-bucket.s3.amazonaws.com/alice.jpg',
    'marcus': 'https://d-id-public-bucket.s3.amazonaws.com/marcus.jpg',
    'jennifer': 'https://d-id-public-bucket.s3.amazonaws.com/jennifer.jpg',
    // Add more avatars
  };

  return avatarMap[avatarId.toLowerCase()] || avatarMap['sarah'];
}
