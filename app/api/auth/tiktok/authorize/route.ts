import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase/admin';

const TIKTOK_CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY || '';
const TIKTOK_REDIRECT_URI = process.env.TIKTOK_REDIRECT_URI || '';

/**
 * GET /api/auth/tiktok/authorize
 * Initiate TikTok OAuth flow
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    if (!TIKTOK_CLIENT_KEY || !TIKTOK_REDIRECT_URI) {
      return NextResponse.json(
        { error: 'TikTok OAuth not configured' },
        { status: 500 }
      );
    }

    // TikTok OAuth scopes
    const scopes = [
      'user.info.basic',
      'user.info.profile',
      'user.info.stats',
      'video.publish',
      'video.upload',
    ].join(',');

    // Generate state parameter for CSRF protection
    const state = Buffer.from(JSON.stringify({ userId, timestamp: Date.now() })).toString('base64');

    // Build authorization URL
    const authUrl = new URL('https://www.tiktok.com/v2/auth/authorize/');
    authUrl.searchParams.append('client_key', TIKTOK_CLIENT_KEY);
    authUrl.searchParams.append('scope', scopes);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('redirect_uri', TIKTOK_REDIRECT_URI);
    authUrl.searchParams.append('state', state);

    return NextResponse.json({
      url: authUrl.toString(),
    });
  } catch (error: any) {
    console.error('Error initiating TikTok OAuth:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initiate TikTok OAuth' },
      { status: 500 }
    );
  }
}
