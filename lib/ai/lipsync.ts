/**
 * AI Lip-Sync Integration
 * Sync avatar lips to audio using D-ID or Wav2Lip
 */

const DID_API_KEY = process.env.DID_API_KEY || '';
const DID_API_URL = 'https://api.d-id.com/talks';

export interface LipSyncConfig {
  videoUrl?: string; // Source video with face
  imageUrl?: string; // Static image with face
  audioUrl: string; // Audio to sync to
  provider?: 'did' | 'wav2lip';
}

export interface LipSyncResult {
  id: string;
  status: 'processing' | 'completed' | 'failed';
  resultUrl?: string;
  duration?: number;
  error?: string;
}

/**
 * Create lip-sync video using D-ID
 */
export async function createLipSync(config: LipSyncConfig): Promise<LipSyncResult> {
  const { imageUrl, videoUrl, audioUrl, provider = 'did' } = config;

  if (provider === 'did') {
    return createDIDLipSync(imageUrl || videoUrl!, audioUrl);
  }

  // Default to D-ID
  return createDIDLipSync(imageUrl || videoUrl!, audioUrl);
}

/**
 * D-ID Lip-Sync Implementation
 */
async function createDIDLipSync(sourceUrl: string, audioUrl: string): Promise<LipSyncResult> {
  if (!DID_API_KEY) {
    console.warn('⚠️ D-ID API key not configured, using mock response');
    return {
      id: `mock_lipsync_${Date.now()}`,
      status: 'completed',
      resultUrl: 'https://storage.googleapis.com/sample-videos/lipsync-demo.mp4',
      duration: 30,
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
          audio_url: audioUrl,
        },
        source_url: sourceUrl,
        config: {
          stitch: true,
          result_format: 'mp4',
          fluent: true, // Better lip-sync quality
          pad_audio: 0,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`D-ID lip-sync failed: ${error.message || response.statusText}`);
    }

    const data = await response.json();

    return {
      id: data.id,
      status: 'processing',
    };
  } catch (error: any) {
    console.error('Lip-sync creation error:', error);
    return {
      id: `error_${Date.now()}`,
      status: 'failed',
      error: error.message,
    };
  }
}

/**
 * Check lip-sync status
 */
export async function checkLipSyncStatus(id: string): Promise<LipSyncResult> {
  if (id.startsWith('mock_')) {
    return {
      id,
      status: 'completed',
      resultUrl: 'https://storage.googleapis.com/sample-videos/lipsync-demo.mp4',
      duration: 30,
    };
  }

  if (!DID_API_KEY) {
    throw new Error('D-ID API key not configured');
  }

  try {
    const response = await fetch(`${DID_API_URL}/${id}`, {
      headers: {
        'Authorization': `Basic ${DID_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to check status: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      id: data.id,
      status: data.status === 'done' ? 'completed' : data.status === 'error' ? 'failed' : 'processing',
      resultUrl: data.result_url,
      duration: data.duration,
      error: data.error?.message,
    };
  } catch (error: any) {
    console.error('Error checking lip-sync status:', error);
    throw error;
  }
}

/**
 * Advanced lip-sync with multiple actors
 */
export async function createMultiActorLipSync(actors: Array<{
  imageUrl: string;
  audioUrl: string;
  position: 'left' | 'center' | 'right';
}>): Promise<string[]> {
  const results = await Promise.all(
    actors.map((actor) =>
      createLipSync({
        imageUrl: actor.imageUrl,
        audioUrl: actor.audioUrl,
      })
    )
  );

  return results.map((r) => r.id);
}
