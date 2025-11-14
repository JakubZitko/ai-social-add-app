import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase/admin';

const YOUTUBE_CLIENT_ID = process.env.YOUTUBE_CLIENT_ID || '';
const YOUTUBE_REDIRECT_URI = process.env.YOUTUBE_REDIRECT_URI || '';

/**
 * GET /api/auth/youtube/authorize
 * Initiate YouTube OAuth flow
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

    if (!YOUTUBE_CLIENT_ID || !YOUTUBE_REDIRECT_URI) {
      return NextResponse.json(
        { error: 'YouTube OAuth not configured' },
        { status: 500 }
      );
    }

    // YouTube OAuth scopes
    const scopes = [
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/youtube',
      'https://www.googleapis.com/auth/youtube.readonly',
      'https://www.googleapis.com/auth/userinfo.profile',
    ].join(' ');

    // Generate state parameter for CSRF protection
    const state = Buffer.from(JSON.stringify({ userId, timestamp: Date.now() })).toString('base64');

    // Build authorization URL
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.append('client_id', YOUTUBE_CLIENT_ID);
    authUrl.searchParams.append('redirect_uri', YOUTUBE_REDIRECT_URI);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('scope', scopes);
    authUrl.searchParams.append('state', state);
    authUrl.searchParams.append('access_type', 'offline'); // Get refresh token
    authUrl.searchParams.append('prompt', 'consent'); // Force consent to get refresh token

    return NextResponse.json({
      url: authUrl.toString(),
    });
  } catch (error: any) {
    console.error('Error initiating YouTube OAuth:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initiate YouTube OAuth' },
      { status: 500 }
    );
  }
}
