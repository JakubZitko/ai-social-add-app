import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase/admin';
import { enhanceScript } from '@/lib/ai/script-enhancer';

/**
 * POST /api/ai/enhance-script
 * Enhance video script with AI
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    await auth.verifyIdToken(token);

    // Parse request body
    const body = await request.json();
    const {
      script,
      contentType,
      platform,
      tone,
      targetLength,
      includeHook,
      includeCTA,
    } = body;

    if (!script) {
      return NextResponse.json(
        { error: 'Script is required' },
        { status: 400 }
      );
    }

    // Enhance script
    const result = await enhanceScript({
      script,
      contentType: contentType || 'ad',
      platform,
      tone,
      targetLength,
      includeHook: includeHook !== false,
      includeCTA: includeCTA !== false,
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error('Error in /api/ai/enhance-script:', error);
    return NextResponse.json(
      { error: error.message || 'Script enhancement failed' },
      { status: 500 }
    );
  }
}
