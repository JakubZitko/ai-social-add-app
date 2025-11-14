import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase/admin';
import { createProject, updateProjectStatus } from '@/lib/firestore/projects';
import { deductCredits, recordVideoTransaction } from '@/lib/firestore/init';
import { generateVideo } from '@/lib/ai/video-generator';
import { getTemplateById } from '@/lib/templates/video-templates';

/**
 * POST /api/generate/shorts
 * Generate AI Shorts for Instagram Reels, TikTok, YouTube Shorts
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const body = await request.json();
    const {
      templateId,
      hook,
      mainContent,
      cta,
      avatar,
      voice,
      targetPlatform, // 'instagram' | 'tiktok' | 'youtube' | 'all'
      duration, // 15 | 30 | 60
      style, // 'viral' | 'educational' | 'behind-scenes' | 'funny'
      customScript,
    } = body;

    let script = customScript;
    let title = 'AI Shorts';
    const videoDuration = duration || 30;

    if (templateId) {
      const template = getTemplateById(templateId);

      if (!template || template.category !== 'shorts') {
        return NextResponse.json(
          { error: 'Invalid shorts template' },
          { status: 400 }
        );
      }

      // Generate script for shorts
      const selectedHook = hook || template.hooks![0];
      script = `${selectedHook}

${mainContent || 'Amazing content that hooks viewers in the first second!'}

${cta || 'Follow for more!'}`;

      title = `${template.name} - ${style || 'Viral'}`;
    }

    // Shorts cost 2 credits (short-form content)
    const creditsNeeded = 2;

    try {
      await deductCredits(userId, creditsNeeded);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || 'Insufficient credits' },
        { status: 402 }
      );
    }

    const projectId = await createProject(userId, {
      title,
      script,
      avatar: avatar || 'trendy-creator',
      voice: voice || 'energetic-young',
      aspectRatio: '9:16', // Shorts are always vertical
      background: style === 'behind-scenes' ? 'casual-home' : 'dynamic-background',
      tags: ['shorts', style || 'viral', targetPlatform || 'all', templateId || 'custom'],
      creditsUsed: creditsNeeded,
    });

    await recordVideoTransaction(userId, projectId, creditsNeeded);
    await updateProjectStatus(projectId, 'processing');

    generateVideo({
      projectId,
      userId,
      script,
      avatar: avatar || 'trendy-creator',
      voice: voice || 'energetic-young',
      aspectRatio: '9:16',
      background: style === 'behind-scenes' ? 'casual-home' : 'dynamic-background',
    }).catch((error) => {
      console.error('Shorts generation failed:', error);
      updateProjectStatus(projectId, 'failed', { errorMessage: error.message });
    });

    return NextResponse.json({
      success: true,
      projectId,
      message: 'AI Shorts generation started',
      targetPlatform: targetPlatform || 'all',
      duration: videoDuration,
      aspectRatio: '9:16',
    });
  } catch (error: any) {
    console.error('Error in /api/generate/shorts:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
