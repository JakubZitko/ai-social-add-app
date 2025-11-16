/**
 * Text-to-Speech Service
 * Supports ElevenLabs, Google Cloud TTS, and Amazon Polly
 */

import { uploadAudioToStorage } from '../storage/upload';

export interface TTSConfig {
  text: string;
  voiceId: string;
  provider?: 'elevenlabs' | 'google' | 'polly';
  settings?: {
    stability?: number; // 0-1
    similarityBoost?: number; // 0-1
    style?: number; // 0-1
    speed?: number; // 0.5-2
  };
  language?: string;
}

export interface TTSResult {
  audioUrl: string;
  duration: number;
  provider: string;
}

/**
 * Generate TTS audio
 */
export async function generateTTS(config: TTSConfig, userId: string, projectId: string): Promise<TTSResult> {
  const provider = config.provider || 'elevenlabs';

  switch (provider) {
    case 'elevenlabs':
      return generateElevenLabsTTS(config, userId, projectId);
    case 'google':
      return generateGoogleTTS(config, userId, projectId);
    case 'polly':
      return generatePollyTTS(config, userId, projectId);
    default:
      throw new Error(`Unsupported TTS provider: ${provider}`);
  }
}

/**
 * ElevenLabs TTS (Premium quality, 35+ languages)
 */
async function generateElevenLabsTTS(config: TTSConfig, userId: string, projectId: string): Promise<TTSResult> {
  const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

  if (!ELEVENLABS_API_KEY) {
    console.warn('⚠️ ElevenLabs API key not configured');
    // Return mock audio for development
    return {
      audioUrl: 'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav',
      duration: 10,
      provider: 'elevenlabs-mock',
    };
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${config.voiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: config.text,
          model_id: 'eleven_multilingual_v2', // Supports 35+ languages
          voice_settings: {
            stability: config.settings?.stability ?? 0.5,
            similarity_boost: config.settings?.similarityBoost ?? 0.75,
            style: config.settings?.style ?? 0,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`ElevenLabs API error: ${error.detail?.message || response.statusText}`);
    }

    // Get audio as buffer
    const audioBuffer = await response.arrayBuffer();
    const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });

    // Upload to Firebase Storage
    const audioUrl = await uploadAudioToStorage(audioBlob, userId, projectId);

    // Estimate duration (rough calculation: ~150 words per minute)
    const wordCount = config.text.split(/\s+/).length;
    const estimatedDuration = Math.ceil((wordCount / 150) * 60);

    return {
      audioUrl,
      duration: estimatedDuration,
      provider: 'elevenlabs',
    };
  } catch (error: any) {
    console.error('ElevenLabs TTS error:', error);
    throw new Error(`TTS generation failed: ${error.message}`);
  }
}

/**
 * Google Cloud TTS (Good quality, 100+ languages)
 */
async function generateGoogleTTS(config: TTSConfig, userId: string, projectId: string): Promise<TTSResult> {
  const GOOGLE_API_KEY = process.env.GOOGLE_CLOUD_API_KEY;

  if (!GOOGLE_API_KEY) {
    throw new Error('Google Cloud API key not configured');
  }

  try {
    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: { text: config.text },
          voice: {
            languageCode: config.language || 'en-US',
            name: config.voiceId,
            ssmlGender: 'NEUTRAL',
          },
          audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: config.settings?.speed ?? 1.0,
            pitch: 0,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Google TTS API error: ${response.statusText}`);
    }

    const data = await response.json();
    const audioContent = data.audioContent; // Base64 encoded

    // Decode and upload
    const audioBuffer = Buffer.from(audioContent, 'base64');
    const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });
    const audioUrl = await uploadAudioToStorage(audioBlob, userId, projectId);

    return {
      audioUrl,
      duration: Math.ceil(config.text.split(/\s+/).length / 150 * 60),
      provider: 'google',
    };
  } catch (error: any) {
    console.error('Google TTS error:', error);
    throw error;
  }
}

/**
 * Amazon Polly TTS (Good quality, 60+ languages)
 */
async function generatePollyTTS(config: TTSConfig, userId: string, projectId: string): Promise<TTSResult> {
  // Note: Polly requires AWS SDK which needs server-side implementation
  throw new Error('Amazon Polly integration coming soon');
}

/**
 * Get available voices for a provider
 */
export async function getAvailableVoices(provider: 'elevenlabs' | 'google' = 'elevenlabs') {
  if (provider === 'elevenlabs') {
    const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
    if (!ELEVENLABS_API_KEY) {
      throw new Error('ElevenLabs API key not configured');
    }

    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch voices: ${response.statusText}`);
    }

    const data = await response.json();
    return data.voices;
  }

  throw new Error(`Provider ${provider} not implemented for voice listing`);
}

/**
 * Clone a voice (ElevenLabs feature)
 */
export async function cloneVoice(audioFiles: Blob[], name: string, description: string) {
  const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
  if (!ELEVENLABS_API_KEY) {
    throw new Error('ElevenLabs API key not configured');
  }

  const formData = new FormData();
  formData.append('name', name);
  formData.append('description', description);

  audioFiles.forEach((file, index) => {
    formData.append(`files[${index}]`, file, `sample${index}.mp3`);
  });

  const response = await fetch('https://api.elevenlabs.io/v1/voices/add', {
    method: 'POST',
    headers: {
      'xi-api-key': ELEVENLABS_API_KEY,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Voice cloning failed: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    voiceId: data.voice_id,
    name: data.name,
  };
}
