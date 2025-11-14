import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase/admin';
import { createProject, updateProjectStatus } from '@/lib/firestore/projects';
import { deductCredits, recordVideoTransaction } from '@/lib/firestore/init';
import { generateVideo } from '@/lib/ai/video-generator';
import { getTemplateById, parseScriptTemplate } from '@/lib/templates/video-templates';

/**
 * POST /api/generate/facebook-ad
 * Generate Facebook Ad video with high-converting templates
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
      problem,
      benefit,
      features,
      hook,
      cta,
      avatar,
      voice,
      customScript,
    } = body;

    let script = customScript;
    let title = 'Facebook Ad';
    let aspectRatio: '1:1' | '16:9' | '9:16' | '4:5' = '1:1';

    if (templateId) {
      const template = getTemplateById(templateId);

      if (!template || template.platform !== 'facebook') {
        return NextResponse.json(
          { error: 'Invalid Facebook ad template' },
          { status: 400 }
        );
      }

      aspectRatio = template.aspectRatio;

      // Parse script template
      if (template.scriptTemplate) {
        const featuresList = features || ['Feature 1', 'Feature 2', 'Feature 3'];
        script = parseScriptTemplate(template.scriptTemplate, {
          hook: hook || template.hooks![0],
          problem: problem || 'common problem',
          product_name: productName || 'our product',
          benefit: benefit || 'solving your problems',
          feature_1: featuresList[0] || 'Amazing feature',
          feature_2: featuresList[1] || 'Great quality',
          feature_3: featuresList[2] || 'Best price',
          cta: cta || template.ctas![0],
        });
      }

      title = `${template.name} - ${productName || 'Product'}`;
    }

    // Facebook ads cost 3 credits
    const creditsNeeded = 3;

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
      avatar: avatar || 'professional-presenter',
      voice: voice || 'energetic-male',
      aspectRatio,
      background: 'clean-studio',
      tags: ['facebook-ad', 'ad', templateId || 'custom'],
      creditsUsed: creditsNeeded,
    });

    await recordVideoTransaction(userId, projectId, creditsNeeded);
    await updateProjectStatus(projectId, 'processing');

    generateVideo({
      projectId,
      userId,
      script,
      avatar: avatar || 'professional-presenter',
      voice: voice || 'energetic-male',
      aspectRatio,
      background: 'clean-studio',
    }).catch((error) => {
      console.error('Facebook ad generation failed:', error);
      updateProjectStatus(projectId, 'failed', { errorMessage: error.message });
    });

    return NextResponse.json({
      success: true,
      projectId,
      message: 'Facebook ad generation started',
      platform: 'facebook',
      aspectRatio,
    });
  } catch (error: any) {
    console.error('Error in /api/generate/facebook-ad:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
