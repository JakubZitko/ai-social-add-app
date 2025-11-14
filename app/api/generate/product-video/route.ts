import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase/admin';
import { createProject, updateProjectStatus } from '@/lib/firestore/projects';
import { deductCredits, recordVideoTransaction } from '@/lib/firestore/init';
import { generateVideo } from '@/lib/ai/video-generator';
import { getTemplateById, parseScriptTemplate } from '@/lib/templates/video-templates';

/**
 * POST /api/generate/product-video
 * Generate professional product showcase videos
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
      productDescription,
      features,
      benefits,
      website,
      avatar,
      voice,
      showProductImages,
      productImages,
      customScript,
    } = body;

    let script = customScript;
    let title = 'Product Video';

    if (templateId) {
      const template = getTemplateById(templateId);

      if (!template || template.category !== 'product') {
        return NextResponse.json(
          { error: 'Invalid product video template' },
          { status: 400 }
        );
      }

      if (template.scriptTemplate) {
        const featuresList = features || ['Premium quality', 'Easy to use', 'Great value'];

        script = parseScriptTemplate(template.scriptTemplate, {
          product_name: productName || 'Product',
          product_description: productDescription || 'An innovative product',
          feature_1: featuresList[0] || 'Feature 1',
          feature_2: featuresList[1] || 'Feature 2',
          feature_3: featuresList[2] || 'Feature 3',
          explanation: benefits || 'It works by providing amazing results',
          benefits: benefits || 'Save time, save money, get better results',
          website: website || 'our website',
        });
      }

      title = `${template.name} - ${productName}`;
    }

    // Product videos cost 3 credits
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
      avatar: avatar || 'professional-host',
      voice: voice || 'clear-narrator',
      aspectRatio: '16:9', // Product videos are typically landscape
      background: 'product-studio',
      tags: ['product', 'showcase', templateId || 'custom'],
      creditsUsed: creditsNeeded,
    });

    await recordVideoTransaction(userId, projectId, creditsNeeded);
    await updateProjectStatus(projectId, 'processing');

    generateVideo({
      projectId,
      userId,
      script,
      avatar: avatar || 'professional-host',
      voice: voice || 'clear-narrator',
      aspectRatio: '16:9',
      background: 'product-studio',
    }).catch((error) => {
      console.error('Product video generation failed:', error);
      updateProjectStatus(projectId, 'failed', { errorMessage: error.message });
    });

    return NextResponse.json({
      success: true,
      projectId,
      message: 'Product video generation started',
      productName,
      aspectRatio: '16:9',
    });
  } catch (error: any) {
    console.error('Error in /api/generate/product-video:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
