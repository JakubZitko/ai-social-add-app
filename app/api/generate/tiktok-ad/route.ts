import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase/admin';
import { createProject, updateProjectStatus } from '@/lib/firestore/projects';
import { deductCredits, recordVideoTransaction } from '@/lib/firestore/init';
import { generateVideo } from '@/lib/ai/video-generator';
import { getTemplateById, parseScriptTemplate } from '@/lib/templates/video-templates';

/**
 * POST /api/generate/tiktok-ad
 * Generate TikTok Ad video with viral-style templates
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
      productName,
      hook,
      testimonial,
      cta,
      avatar,
      voice,
      trendingAudio,
      hashtags,
      customScript,
    } = body;

    let script = customScript;
    let title = 'TikTok Ad';

    if (templateId) {
      const template = getTemplateById(templateId);

      if (!template || template.platform !== 'tiktok') {
        return NextResponse.json(
          { error: 'Invalid TikTok ad template' },
          { status: 400 }
        );
      }

      if (template.scriptTemplate) {
        script = parseScriptTemplate(template.scriptTemplate, {
          hook: hook || template.hooks![0],
          product: productName || 'this product',
          testimonial: testimonial || 'Game changer!',
          cta: cta || template.ctas![0],
        });
      } else {
        // Generate TikTok-style script
        script = `${hook || template.hooks![0]}

*Shows ${productName || 'product'} in action*

${testimonial || 'This literally changed everything!'}

${hashtags ? hashtags.map((tag: string) => `#${tag}`).join(' ') : '#fyp #viral'}

${cta || template.ctas![0]}`;
      }

      title = `${template.name} - ${productName || 'Product'}`;
    }

    // TikTok ads cost 2 credits (shorter format)
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
      aspectRatio: '9:16', // TikTok is always vertical
      background: trendingAudio ? 'trending-setup' : 'casual-room',
      tags: ['tiktok-ad', 'ad', 'viral', templateId || 'custom'],
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
      background: trendingAudio ? 'trending-setup' : 'casual-room',
    }).catch((error) => {
      console.error('TikTok ad generation failed:', error);
      updateProjectStatus(projectId, 'failed', { errorMessage: error.message });
    });

    return NextResponse.json({
      success: true,
      projectId,
      message: 'TikTok ad generation started',
      platform: 'tiktok',
      aspectRatio: '9:16',
    });
  } catch (error: any) {
    console.error('Error in /api/generate/tiktok-ad:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
