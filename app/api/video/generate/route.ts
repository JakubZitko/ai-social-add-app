import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase/admin';
import { createProject, updateProjectStatus } from '@/lib/firestore/projects';
import { deductCredits, recordVideoTransaction } from '@/lib/firestore/init';
import { generateVideo } from '@/lib/ai/video-generator';

/**
 * POST /api/video/generate
 * Generate a new AI video
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
      title,
      script,
      avatar,
      voice,
      aspectRatio,
      background,
      tags,
    } = body;

    // Validate required fields
    if (!title || !script || !avatar || !voice) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate credits needed (2 credits per video)
    const creditsNeeded = 2;

    // Check if user has enough credits
    try {
      await deductCredits(userId, creditsNeeded);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || 'Insufficient credits' },
        { status: 402 }
      );
    }

    // Create project in database
    const projectId = await createProject(userId, {
      title,
      script,
      avatar,
      voice,
      aspectRatio: aspectRatio || '16:9',
      background: background || 'gradient',
      tags: tags || [],
      creditsUsed: creditsNeeded,
    });

    // Record transaction
    await recordVideoTransaction(userId, projectId, creditsNeeded);

    // Update project to processing
    await updateProjectStatus(projectId, 'processing');

    // Start video generation in background (async)
    generateVideo({
      projectId,
      userId,
      script,
      avatar,
      voice,
      aspectRatio: aspectRatio || '16:9',
      background: background || 'gradient',
    }).catch((error) => {
      console.error('Video generation failed:', error);
      updateProjectStatus(projectId, 'failed', {
        errorMessage: error.message,
      });
    });

    return NextResponse.json({
      success: true,
      projectId,
      message: 'Video generation started',
      status: 'processing',
    });
  } catch (error: any) {
    console.error('Error in /api/video/generate:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
