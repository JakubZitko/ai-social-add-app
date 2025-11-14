import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase/admin';
import { createProject, updateProjectStatus } from '@/lib/firestore/projects';
import { deductCredits, recordVideoTransaction } from '@/lib/firestore/init';
import { generateVideo } from '@/lib/ai/video-generator';
import { getTemplateById, parseScriptTemplate } from '@/lib/templates/video-templates';

/**
 * POST /api/generate/ugc
 * Generate UGC (User Generated Content) style video
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
      templateId,
      productName,
      productBenefit,
      hook,
      cta,
      avatar,
      voice,
      customScript,
    } = body;

    // Validate required fields
    if (!templateId && !customScript) {
      return NextResponse.json(
        { error: 'Template ID or custom script required' },
        { status: 400 }
      );
    }

    let script = customScript;
    let title = 'UGC Video';

    // If using template, parse it
    if (templateId) {
      const template = getTemplateById(templateId);

      if (!template || template.category !== 'ugc') {
        return NextResponse.json(
          { error: 'Invalid UGC template' },
          { status: 400 }
        );
      }

      // Parse script template
      if (template.scriptTemplate) {
        script = parseScriptTemplate(template.scriptTemplate, {
          product_name: productName || 'this product',
          benefit: productBenefit || 'amazing results',
          hook: hook || template.hooks[0],
          cta: cta || template.ctas[0],
        });
      } else {
        // Generate script from template
        script = `${hook || template.hooks[0]}

I've been using ${productName || 'this'} for a few weeks now and ${productBenefit || 'the results are incredible'}.

Here's what I love about it:
✓ Super easy to use
✓ Actually works
✓ Great value for money

${cta || template.ctas[0]}`;
      }

      title = `${template.name} - ${productName || 'Product'}`;
    }

    // Calculate credits (UGC videos cost 2 credits)
    const creditsNeeded = 2;

    // Check and deduct credits
    try {
      await deductCredits(userId, creditsNeeded);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || 'Insufficient credits' },
        { status: 402 }
      );
    }

    // Create project
    const projectId = await createProject(userId, {
      title,
      script,
      avatar: avatar || 'casual-presenter',
      voice: voice || 'friendly-female',
      aspectRatio: '9:16', // UGC is typically vertical
      background: 'casual-room',
      tags: ['ugc', templateId || 'custom'],
      creditsUsed: creditsNeeded,
    });

    // Record transaction
    await recordVideoTransaction(userId, projectId, creditsNeeded);

    // Update to processing
    await updateProjectStatus(projectId, 'processing');

    // Start video generation
    generateVideo({
      projectId,
      userId,
      script,
      avatar: avatar || 'casual-presenter',
      voice: voice || 'friendly-female',
      aspectRatio: '9:16',
      background: 'casual-room',
    }).catch((error) => {
      console.error('UGC video generation failed:', error);
      updateProjectStatus(projectId, 'failed', {
        errorMessage: error.message,
      });
    });

    return NextResponse.json({
      success: true,
      projectId,
      message: 'UGC video generation started',
      template: templateId,
    });
  } catch (error: any) {
    console.error('Error in /api/generate/ugc:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
