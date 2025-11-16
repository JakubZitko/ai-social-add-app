/**
 * Video Editing Service
 * Add B-roll, captions, music, and transitions to AI videos
 */

export interface VideoEditConfig {
  videoUrl: string;
  userId: string;
  projectId: string;
  edits: {
    addCaptions?: {
      text: string;
      style: 'minimal' | 'bold' | 'animated';
      position: 'top' | 'center' | 'bottom';
    };
    addMusic?: {
      audioUrl: string;
      volume: number; // 0-100
      fadeIn: boolean;
      fadeOut: boolean;
    };
    addBRoll?: {
      clips: Array<{
        url: string;
        startTime: number;
        duration: number;
      }>;
    };
    addTransitions?: {
      type: 'fade' | 'slide' | 'zoom';
      duration: number; // in seconds
    };
    addWatermark?: {
      imageUrl: string;
      position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
      opacity: number; // 0-100
    };
    trim?: {
      start: number;
      end: number;
    };
    resize?: {
      aspectRatio: '9:16' | '16:9' | '1:1';
    };
  };
}

export interface EditedVideo {
  url: string;
  duration: number;
  size: number; // in bytes
}

/**
 * Edit video with AI enhancements
 */
export async function editVideo(config: VideoEditConfig): Promise<EditedVideo> {
  // Check if FFMPEG service is available
  const FFMPEG_SERVICE_URL = process.env.FFMPEG_SERVICE_URL;

  if (!FFMPEG_SERVICE_URL) {
    console.warn('⚠️ FFMPEG service not configured, returning original video');
    return {
      url: config.videoUrl,
      duration: 30,
      size: 1024 * 1024 * 5, // 5MB estimate
    };
  }

  try {
    // Send editing job to FFMPEG microservice
    const response = await fetch(`${FFMPEG_SERVICE_URL}/edit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.FFMPEG_API_KEY}`,
      },
      body: JSON.stringify({
        videoUrl: config.videoUrl,
        userId: config.userId,
        projectId: config.projectId,
        edits: config.edits,
      }),
    });

    if (!response.ok) {
      throw new Error(`FFMPEG service error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      url: data.outputUrl,
      duration: data.duration,
      size: data.fileSize,
    };
  } catch (error: any) {
    console.error('Video editing error:', error);
    throw error;
  }
}

/**
 * Add auto-generated captions
 */
export async function addAutoCaptions(
  videoUrl: string,
  audioUrl: string,
  language: string = 'en'
): Promise<{ captionsUrl: string; srtContent: string }> {
  const WHISPER_API_KEY = process.env.OPENAI_API_KEY;

  if (!WHISPER_API_KEY) {
    console.warn('⚠️ Whisper API not configured');
    return {
      captionsUrl: '',
      srtContent: '',
    };
  }

  try {
    // Use OpenAI Whisper for transcription
    const audioResponse = await fetch(audioUrl);
    const audioBlob = await audioResponse.blob();

    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.mp3');
    formData.append('model', 'whisper-1');
    formData.append('language', language);
    formData.append('response_format', 'srt');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHISPER_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Whisper API error: ${response.statusText}`);
    }

    const srtContent = await response.text();

    // Upload SRT file to storage
    // TODO: Implement SRT upload to Firebase Storage

    return {
      captionsUrl: 'https://example.com/captions.srt',
      srtContent,
    };
  } catch (error: any) {
    console.error('Caption generation error:', error);
    throw error;
  }
}

/**
 * Get stock B-roll footage
 */
export async function getStockBRoll(query: string, count: number = 5): Promise<Array<{
  url: string;
  thumbnail: string;
  duration: number;
  tags: string[];
}>> {
  const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

  if (!PEXELS_API_KEY) {
    // Return mock B-roll
    return [
      {
        url: 'https://www.pexels.com/video/example1.mp4',
        thumbnail: 'https://www.pexels.com/photo/example1.jpg',
        duration: 10,
        tags: ['business', 'professional'],
      },
    ];
  }

  try {
    const response = await fetch(
      `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=${count}`,
      {
        headers: {
          'Authorization': PEXELS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.statusText}`);
    }

    const data = await response.json();

    return data.videos.map((video: any) => ({
      url: video.video_files[0].link,
      thumbnail: video.image,
      duration: video.duration,
      tags: video.tags || [],
    }));
  } catch (error) {
    console.error('B-roll fetch error:', error);
    return [];
  }
}

/**
 * Get royalty-free background music
 */
export async function getBackgroundMusic(mood: 'energetic' | 'calm' | 'upbeat' | 'dramatic', duration: number): Promise<{
  url: string;
  name: string;
  duration: number;
}> {
  // Use a service like Epidemic Sound, Artlist, or generate with AI
  const MUSIC_API_KEY = process.env.MUSIC_API_KEY;

  if (!MUSIC_API_KEY) {
    // Return mock music
    return {
      url: 'https://www.bensound.com/bensound-music/bensound-sunny.mp3',
      name: 'Sunny Day',
      duration: 120,
    };
  }

  // TODO: Implement music API integration
  return {
    url: '',
    name: '',
    duration: 0,
  };
}

/**
 * Composite multiple elements (product placement)
 */
export async function compositeElements(config: {
  baseVideoUrl: string;
  elements: Array<{
    type: 'image' | 'video' | 'text';
    content: string; // URL or text
    position: { x: number; y: number; width: number; height: number };
    startTime: number;
    endTime: number;
  }>;
}): Promise<string> {
  const FFMPEG_SERVICE_URL = process.env.FFMPEG_SERVICE_URL;

  if (!FFMPEG_SERVICE_URL) {
    console.warn('⚠️ Compositing not available');
    return config.baseVideoUrl;
  }

  try {
    const response = await fetch(`${FFMPEG_SERVICE_URL}/composite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.FFMPEG_API_KEY}`,
      },
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      throw new Error(`Composite service error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.outputUrl;
  } catch (error: any) {
    console.error('Compositing error:', error);
    throw error;
  }
}
