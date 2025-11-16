import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase/admin';
import { generateBatchVideos, parseCSVForBatch } from '@/lib/ai/batch-generator';

/**
 * POST /api/ai/batch-generate
 * Generate multiple videos in batch
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
    const { template, variations, csvData } = body;

    if (!template || (!variations && !csvData)) {
      return NextResponse.json(
        { error: 'Template and variations (or CSV data) are required' },
        { status: 400 }
      );
    }

    // Parse variations from CSV if provided
    let parsedVariations = variations;
    if (csvData && !variations) {
      try {
        parsedVariations = parseCSVForBatch(csvData);
      } catch (error: any) {
        return NextResponse.json(
          { error: `CSV parsing failed: ${error.message}` },
          { status: 400 }
        );
      }
    }

    if (!parsedVariations || parsedVariations.length === 0) {
      return NextResponse.json(
        { error: 'No valid variations found' },
        { status: 400 }
      );
    }

    // Start batch generation
    const result = await generateBatchVideos({
      userId,
      template,
      variations: parsedVariations,
    });

    return NextResponse.json({
      success: true,
      ...result,
      message: `Batch generation started: ${result.successful} videos queued`,
    });
  } catch (error: any) {
    console.error('Error in /api/ai/batch-generate:', error);
    return NextResponse.json(
      { error: error.message || 'Batch generation failed' },
      { status: 500 }
    );
  }
}
