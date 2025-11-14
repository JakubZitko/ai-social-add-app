import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase/admin';
import { deductCredits } from '@/lib/firestore/init';
import { createLipSync } from '@/lib/ai/lipsync';

/**
 * POST /api/lipsync/create
 * Create AI lip-sync video from image/video + audio
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
      imageUrl,
      videoUrl,
      audioUrl,
      provider, // 'did' | 'wav2lip'
    } = body;

    // Validate inputs
    if (!audioUrl) {
      return NextResponse.json(
        { error: 'Audio URL is required' },
        { status: 400 }
      );
    }

    if (!imageUrl && !videoUrl) {
      return NextResponse.json(
        { error: 'Either image URL or video URL is required' },
        { status: 400 }
      );
    }

    // Lip-sync costs 2 credits
    const creditsNeeded = 2;

    try {
      await deductCredits(userId, creditsNeeded);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || 'Insufficient credits' },
        { status: 402 }
      );
    }

    // Create lip-sync video
    const result = await createLipSync({
      imageUrl,
      videoUrl,
      audioUrl,
      provider: provider || 'did',
    });

    if (result.status === 'failed') {
      return NextResponse.json(
        { error: result.error || 'Lip-sync creation failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      lipSyncId: result.id,
      status: result.status,
      message: 'Lip-sync video creation started',
    });
  } catch (error: any) {
    console.error('Error in /api/lipsync/create:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
