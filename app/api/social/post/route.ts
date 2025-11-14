import { NextRequest, NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebase/admin';

/**
 * POST /api/social/post
 * Post a video to social media platforms
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    // Parse request body
    const body = await request.json();
    const {
      projectId,
      videoUrl,
      platforms, // Array: ['tiktok', 'instagram', 'youtube']
      caption,
      hashtags,
    } = body;

    if (!projectId || !videoUrl || !platforms || platforms.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const results: Record<string, any> = {};

    // Post to each platform
    for (const platform of platforms) {
      try {
        let result;
        switch (platform) {
          case 'tiktok':
            result = await postToTikTok(userId, videoUrl, caption, hashtags);
            break;
          case 'instagram':
            result = await postToInstagram(userId, videoUrl, caption, hashtags);
            break;
          case 'youtube':
            result = await postToYouTube(userId, videoUrl, caption, hashtags);
            break;
          default:
            result = { success: false, error: 'Unsupported platform' };
        }
        results[platform] = result;
      } catch (error: any) {
        results[platform] = { success: false, error: error.message };
      }
    }

    // Log post to Firestore
    await db.collection('posts').add({
      userId,
      projectId,
      videoUrl,
      platforms,
      caption,
      hashtags,
      results,
      postedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error: any) {
    console.error('Error posting to social media:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to post' },
      { status: 500 }
    );
  }
}

/**
 * Post video to TikTok
 */
async function postToTikTok(
  userId: string,
  videoUrl: string,
  caption: string,
  hashtags?: string[]
): Promise<{ success: boolean; postId?: string; error?: string }> {
  try {
    // Get TikTok access token from Firestore
    const connectionDoc = await db.collection('socialConnections').doc(`${userId}_tiktok`).get();

    if (!connectionDoc.exists || !connectionDoc.data()?.connected) {
      throw new Error('TikTok not connected');
    }

    const accessToken = connectionDoc.data()?.accessToken;

    if (!accessToken) {
      throw new Error('TikTok access token missing');
    }

    // Step 1: Initialize video upload
    const initResponse = await fetch('https://open.tiktokapis.com/v2/post/publish/video/init/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        post_info: {
          title: caption,
          privacy_level: 'SELF_ONLY', // or 'PUBLIC_TO_EVERYONE'
          disable_duet: false,
          disable_comment: false,
          disable_stitch: false,
          video_cover_timestamp_ms: 1000,
        },
        source_info: {
          source: 'PULL_FROM_URL',
          video_url: videoUrl,
        },
      }),
    });

    if (!initResponse.ok) {
      const error = await initResponse.json();
      throw new Error(`TikTok upload failed: ${error.message || initResponse.statusText}`);
    }

    const initData = await initResponse.json();
    const publishId = initData.data?.publish_id;

    console.log(`✅ TikTok video posted: ${publishId}`);

    return {
      success: true,
      postId: publishId,
    };
  } catch (error: any) {
    console.error('TikTok posting error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Post video to Instagram
 */
async function postToInstagram(
  userId: string,
  videoUrl: string,
  caption: string,
  hashtags?: string[]
): Promise<{ success: boolean; postId?: string; error?: string }> {
  try {
    // Get Instagram access token
    const connectionDoc = await db.collection('socialConnections').doc(`${userId}_instagram`).get();

    if (!connectionDoc.exists || !connectionDoc.data()?.connected) {
      throw new Error('Instagram not connected');
    }

    const accessToken = connectionDoc.data()?.accessToken;
    const instagramUserId = connectionDoc.data()?.instagramUserId;

    if (!accessToken || !instagramUserId) {
      throw new Error('Instagram credentials missing');
    }

    // Build caption with hashtags
    const fullCaption = hashtags && hashtags.length > 0
      ? `${caption}\n\n${hashtags.map((tag) => `#${tag}`).join(' ')}`
      : caption;

    // Step 1: Create media container
    const containerResponse = await fetch(
      `https://graph.instagram.com/v18.0/${instagramUserId}/media`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          video_url: videoUrl,
          caption: fullCaption,
          media_type: 'REELS',
          access_token: accessToken,
        }),
      }
    );

    if (!containerResponse.ok) {
      const error = await containerResponse.json();
      throw new Error(`Instagram container creation failed: ${error.error?.message || containerResponse.statusText}`);
    }

    const containerData = await containerResponse.json();
    const containerId = containerData.id;

    // Step 2: Publish media
    const publishResponse = await fetch(
      `https://graph.instagram.com/v18.0/${instagramUserId}/media_publish`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          creation_id: containerId,
          access_token: accessToken,
        }),
      }
    );

    if (!publishResponse.ok) {
      const error = await publishResponse.json();
      throw new Error(`Instagram publish failed: ${error.error?.message || publishResponse.statusText}`);
    }

    const publishData = await publishResponse.json();
    const postId = publishData.id;

    console.log(`✅ Instagram Reel posted: ${postId}`);

    return {
      success: true,
      postId,
    };
  } catch (error: any) {
    console.error('Instagram posting error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Post video to YouTube
 */
async function postToYouTube(
  userId: string,
  videoUrl: string,
  caption: string,
  hashtags?: string[]
): Promise<{ success: boolean; postId?: string; error?: string }> {
  try {
    // Get YouTube access token
    const connectionDoc = await db.collection('socialConnections').doc(`${userId}_youtube`).get();

    if (!connectionDoc.exists || !connectionDoc.data()?.connected) {
      throw new Error('YouTube not connected');
    }

    const accessToken = connectionDoc.data()?.accessToken;

    if (!accessToken) {
      throw new Error('YouTube access token missing');
    }

    // Build description with hashtags
    const description = hashtags && hashtags.length > 0
      ? `${caption}\n\n${hashtags.map((tag) => `#${tag}`).join(' ')}`
      : caption;

    // Download video from URL
    const videoResponse = await fetch(videoUrl);
    const videoBlob = await videoResponse.blob();

    // Upload video to YouTube
    const uploadResponse = await fetch(
      'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=multipart&part=snippet,status',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          snippet: {
            title: caption.substring(0, 100), // Max 100 chars
            description,
            tags: hashtags || [],
            categoryId: '22', // People & Blogs
          },
          status: {
            privacyStatus: 'public', // or 'private', 'unlisted'
            selfDeclaredMadeForKids: false,
          },
        }),
      }
    );

    if (!uploadResponse.ok) {
      const error = await uploadResponse.json();
      throw new Error(`YouTube upload failed: ${error.error?.message || uploadResponse.statusText}`);
    }

    const uploadData = await uploadResponse.json();
    const videoId = uploadData.id;

    console.log(`✅ YouTube video posted: ${videoId}`);

    return {
      success: true,
      postId: videoId,
    };
  } catch (error: any) {
    console.error('YouTube posting error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}
