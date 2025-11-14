import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';

const YOUTUBE_CLIENT_ID = process.env.YOUTUBE_CLIENT_ID || '';
const YOUTUBE_CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET || '';
const YOUTUBE_REDIRECT_URI = process.env.YOUTUBE_REDIRECT_URI || '';

/**
 * GET /api/auth/youtube/callback
 * Handle YouTube OAuth callback
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      console.error('YouTube OAuth error:', error);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/settings/social?error=${encodeURIComponent(error)}`
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/settings/social?error=missing_params`
      );
    }

    // Decode state to get userId
    const stateData = JSON.parse(Buffer.from(state, 'base64').toString());
    const { userId } = stateData;

    if (!userId) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/settings/social?error=invalid_state`
      );
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: YOUTUBE_CLIENT_ID,
        client_secret: YOUTUBE_CLIENT_SECRET,
        redirect_uri: YOUTUBE_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('YouTube token exchange failed:', errorData);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/settings/social?error=token_exchange_failed`
      );
    }

    const tokenData = await tokenResponse.json();
    const { access_token, refresh_token, expires_in } = tokenData;

    // Get channel info
    const channelResponse = await fetch(
      'https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true',
      {
        headers: {
          'Authorization': `Bearer ${access_token}`,
        },
      }
    );

    let username = 'YouTube Channel';
    let followers = 0;
    let profileUrl = '';
    let channelId = '';

    if (channelResponse.ok) {
      const channelData = await channelResponse.json();
      if (channelData.items && channelData.items.length > 0) {
        const channel = channelData.items[0];
        username = channel.snippet.title;
        channelId = channel.id;
        followers = parseInt(channel.statistics.subscriberCount || '0', 10);
        profileUrl = `https://www.youtube.com/channel/${channelId}`;
      }
    }

    // Save connection to Firestore
    const socialConnectionRef = db.collection('socialConnections').doc(`${userId}_youtube`);
    await socialConnectionRef.set({
      userId,
      platform: 'youtube',
      connected: true,
      username,
      profileUrl,
      followers,
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresAt: new Date(Date.now() + expires_in * 1000),
      permissions: ['youtube.upload', 'youtube', 'youtube.readonly'],
      connectedAt: new Date(),
      lastRefreshedAt: new Date(),
      channelId,
    });

    console.log(`✅ YouTube connected for user ${userId}: ${username}`);

    // Redirect back to settings page
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/settings/social?success=youtube_connected`
    );
  } catch (error: any) {
    console.error('Error in YouTube callback:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/settings/social?error=callback_failed`
    );
  }
}
