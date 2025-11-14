import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase/admin';

const INSTAGRAM_APP_ID = process.env.INSTAGRAM_APP_ID || '';
const INSTAGRAM_REDIRECT_URI = process.env.INSTAGRAM_REDIRECT_URI || '';

/**
 * GET /api/auth/instagram/authorize
 * Initiate Instagram OAuth flow
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

    if (!INSTAGRAM_APP_ID || !INSTAGRAM_REDIRECT_URI) {
      return NextResponse.json(
        { error: 'Instagram OAuth not configured' },
        { status: 500 }
      );
    }

    // Instagram OAuth scopes
    const scopes = [
      'instagram_basic',
      'instagram_content_publish',
      'pages_read_engagement',
      'pages_show_list',
    ].join(',');

    // Generate state parameter for CSRF protection
    const state = Buffer.from(JSON.stringify({ userId, timestamp: Date.now() })).toString('base64');

    // Build authorization URL
    const authUrl = new URL('https://api.instagram.com/oauth/authorize');
    authUrl.searchParams.append('client_id', INSTAGRAM_APP_ID);
    authUrl.searchParams.append('redirect_uri', INSTAGRAM_REDIRECT_URI);
    authUrl.searchParams.append('scope', scopes);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('state', state);

    return NextResponse.json({
      url: authUrl.toString(),
    });
  } catch (error: any) {
    console.error('Error initiating Instagram OAuth:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initiate Instagram OAuth' },
      { status: 500 }
    );
  }
}
