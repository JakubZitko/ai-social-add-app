import { storage } from '@/lib/firebase/config';
import { ref, uploadBytes, getDownloadURL, uploadString } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

/**
 * Upload video to Firebase Storage and return URLs
 */
export async function uploadVideoToStorage(
  videoUrl: string,
  userId: string,
  projectId: string
): Promise<{ videoUrl: string; thumbnailUrl: string }> {
  try {
    // Download video from source
    console.log(`📥 Downloading video from ${videoUrl}`);
    const response = await fetch(videoUrl);

    if (!response.ok) {
      throw new Error(`Failed to download video: ${response.statusText}`);
    }

    const videoBlob = await response.blob();

    // Generate unique filename
    const filename = `${projectId}_${Date.now()}.mp4`;
    const videoPath = `videos/${userId}/${filename}`;

    // Upload to Firebase Storage
    console.log(`☁️  Uploading video to Firebase Storage: ${videoPath}`);
    const videoRef = ref(storage, videoPath);
    await uploadBytes(videoRef, videoBlob, {
      contentType: 'video/mp4',
      customMetadata: {
        userId,
        projectId,
        uploadedAt: new Date().toISOString(),
      },
    });

    // Get download URL
    const uploadedVideoUrl = await getDownloadURL(videoRef);
    console.log(`✅ Video uploaded: ${uploadedVideoUrl}`);

    // Generate thumbnail
    const thumbnailUrl = await generateThumbnail(videoBlob, userId, projectId);

    return {
      videoUrl: uploadedVideoUrl,
      thumbnailUrl,
    };
  } catch (error: any) {
    console.error('Error uploading video to storage:', error);
    throw new Error(`Video upload failed: ${error.message}`);
  }
}

/**
 * Generate and upload thumbnail from video
 */
async function generateThumbnail(
  videoBlob: Blob,
  userId: string,
  projectId: string
): Promise<string> {
  try {
    // For server-side, we'll use a placeholder approach
    // In production, you'd use ffmpeg or a video processing service
    console.log('🖼️  Generating thumbnail...');

    // Create a placeholder thumbnail (1280x720 gradient)
    const canvas = createPlaceholderCanvas();
    const thumbnailBlob = await canvasToBlob(canvas);

    const thumbnailFilename = `${projectId}_thumb_${Date.now()}.jpg`;
    const thumbnailPath = `thumbnails/${userId}/${thumbnailFilename}`;

    const thumbnailRef = ref(storage, thumbnailPath);
    await uploadBytes(thumbnailRef, thumbnailBlob, {
      contentType: 'image/jpeg',
      customMetadata: {
        userId,
        projectId,
        uploadedAt: new Date().toISOString(),
      },
    });

    const thumbnailUrl = await getDownloadURL(thumbnailRef);
    console.log(`✅ Thumbnail uploaded: ${thumbnailUrl}`);

    return thumbnailUrl;
  } catch (error: any) {
    console.error('Error generating thumbnail:', error);
    // Return a default placeholder URL
    return 'https://via.placeholder.com/1280x720/6366f1/ffffff?text=Video+Thumbnail';
  }
}

/**
 * Create placeholder canvas for thumbnail
 * (Used when server-side video processing is not available)
 */
function createPlaceholderCanvas(): any {
  // This is a simplified version - in production, use node-canvas or similar
  // For now, return a data structure that represents a canvas
  return {
    width: 1280,
    height: 720,
    toDataURL: () => 'data:image/jpeg;base64,...',
  };
}

/**
 * Convert canvas to blob
 */
async function canvasToBlob(canvas: any): Promise<Blob> {
  // Simplified version - in production, use proper canvas conversion
  const base64Data = canvas.toDataURL();
  const response = await fetch(base64Data);
  return response.blob();
}

/**
 * Upload custom avatar image
 */
export async function uploadAvatarImage(
  file: File,
  userId: string
): Promise<string> {
  try {
    const filename = `avatar_${uuidv4()}_${Date.now()}.${file.name.split('.').pop()}`;
    const avatarPath = `avatars/${userId}/${filename}`;

    const avatarRef = ref(storage, avatarPath);
    await uploadBytes(avatarRef, file, {
      contentType: file.type,
      customMetadata: {
        userId,
        uploadedAt: new Date().toISOString(),
      },
    });

    const url = await getDownloadURL(avatarRef);
    console.log(`✅ Avatar uploaded: ${url}`);

    return url;
  } catch (error: any) {
    console.error('Error uploading avatar:', error);
    throw new Error(`Avatar upload failed: ${error.message}`);
  }
}

/**
 * Upload custom voice audio samples
 */
export async function uploadVoiceAudio(
  file: File,
  userId: string
): Promise<string> {
  try {
    const filename = `voice_${uuidv4()}_${Date.now()}.${file.name.split('.').pop()}`;
    const voicePath = `voices/${userId}/${filename}`;

    const voiceRef = ref(storage, voicePath);
    await uploadBytes(voiceRef, file, {
      contentType: file.type,
      customMetadata: {
        userId,
        uploadedAt: new Date().toISOString(),
      },
    });

    const url = await getDownloadURL(voiceRef);
    console.log(`✅ Voice audio uploaded: ${url}`);

    return url;
  } catch (error: any) {
    console.error('Error uploading voice audio:', error);
    throw new Error(`Voice upload failed: ${error.message}`);
  }
}

/**
 * Upload background image
 */
export async function uploadBackgroundImage(
  file: File,
  userId: string
): Promise<string> {
  try {
    const filename = `bg_${uuidv4()}_${Date.now()}.${file.name.split('.').pop()}`;
    const bgPath = `backgrounds/${userId}/${filename}`;

    const bgRef = ref(storage, bgPath);
    await uploadBytes(bgRef, file, {
      contentType: file.type,
      customMetadata: {
        userId,
        uploadedAt: new Date().toISOString(),
      },
    });

    const url = await getDownloadURL(bgRef);
    console.log(`✅ Background uploaded: ${url}`);

    return url;
  } catch (error: any) {
    console.error('Error uploading background:', error);
    throw new Error(`Background upload failed: ${error.message}`);
  }
}

/**
 * Upload audio file to Firebase Storage (for TTS)
 */
export async function uploadAudioToStorage(
  audioBlob: Blob,
  userId: string,
  projectId: string
): Promise<string> {
  try {
    const filename = `audio_${projectId}_${Date.now()}.mp3`;
    const audioPath = `audio/${userId}/${filename}`;

    console.log(`☁️  Uploading audio to Firebase Storage: ${audioPath}`);
    const audioRef = ref(storage, audioPath);
    await uploadBytes(audioRef, audioBlob, {
      contentType: 'audio/mpeg',
      customMetadata: {
        userId,
        projectId,
        uploadedAt: new Date().toISOString(),
      },
    });

    const url = await getDownloadURL(audioRef);
    console.log(`✅ Audio uploaded: ${url}`);

    return url;
  } catch (error: any) {
    console.error('Error uploading audio:', error);
    throw new Error(`Audio upload failed: ${error.message}`);
  }
}
