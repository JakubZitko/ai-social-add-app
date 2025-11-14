import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase/admin';
import { createProject, updateProjectStatus } from '@/lib/firestore/projects';
import { deductCredits, recordVideoTransaction } from '@/lib/firestore/init';
import { generateVideo } from '@/lib/ai/video-generator';
import { getTemplateById, parseScriptTemplate } from '@/lib/templates/video-templates';

/**
 * POST /api/generate/affiliate
 * Generate Affiliate Marketing videos with disclosure
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
      firstImpressions,
      pros,
      cons,
      verdict,
      affiliateCode,
      discount,
      affiliateLink,
      avatar,
      voice,
      customScript,
    } = body;

    let script = customScript;
    let title = 'Affiliate Review';

    if (templateId) {
      const template = getTemplateById(templateId);

      if (!template || template.category !== 'affiliate') {
        return NextResponse.json(
          { error: 'Invalid affiliate template' },
          { status: 400 }
        );
      }

      if (template.scriptTemplate) {
        const prosList = pros || ['Great quality', 'Easy to use', 'Good value'];
        const consList = cons || ['Slightly pricey', 'Limited colors'];

        script = parseScriptTemplate(template.scriptTemplate, {
          product_name: productName || 'this product',
          first_impressions: firstImpressions || 'I was impressed right away',
          pro_1: prosList[0] || 'Pro 1',
          pro_2: prosList[1] || 'Pro 2',
          pro_3: prosList[2] || 'Pro 3',
          con_1: consList[0] || 'Con 1',
          con_2: consList[1] || 'Con 2',
          verdict: verdict || 'Overall, highly recommended!',
          code: affiliateCode || 'SAVE20',
          discount: discount || '20% off',
        });
      }

      title = `${template.name} - ${productName}`;
    }

    // Affiliate videos cost 3 credits (longer format with disclosure)
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
      avatar: avatar || 'honest-reviewer',
      voice: voice || 'trustworthy-narrator',
      aspectRatio: '16:9', // Affiliate reviews typically landscape
      background: 'home-office',
      tags: ['affiliate', 'review', productName || 'product', templateId || 'custom'],
      creditsUsed: creditsNeeded,
    });

    await recordVideoTransaction(userId, projectId, creditsNeeded);
    await updateProjectStatus(projectId, 'processing');

    generateVideo({
      projectId,
      userId,
      script,
      avatar: avatar || 'honest-reviewer',
      voice: voice || 'trustworthy-narrator',
      aspectRatio: '16:9',
      background: 'home-office',
    }).catch((error) => {
      console.error('Affiliate video generation failed:', error);
      updateProjectStatus(projectId, 'failed', { errorMessage: error.message });
    });

    return NextResponse.json({
      success: true,
      projectId,
      message: 'Affiliate video generation started',
      productName,
      affiliateCode,
      aspectRatio: '16:9',
    });
  } catch (error: any) {
    console.error('Error in /api/generate/affiliate:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
