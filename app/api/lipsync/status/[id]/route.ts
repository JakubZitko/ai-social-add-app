import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase/admin';
import { checkLipSyncStatus } from '@/lib/ai/lipsync';

/**
 * GET /api/lipsync/status/[id]
 * Check lip-sync video status
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    await auth.verifyIdToken(token);

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Lip-sync ID is required' },
        { status: 400 }
      );
    }

    // Check status
    const result = await checkLipSyncStatus(id);

    return NextResponse.json({
      lipSyncId: id,
      status: result.status,
      resultUrl: result.resultUrl,
      duration: result.duration,
      error: result.error,
    });
  } catch (error: any) {
    console.error('Error checking lip-sync status:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
