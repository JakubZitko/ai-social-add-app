import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';

const TIKTOK_CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY || '';
const TIKTOK_CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET || '';

/**
 * GET /api/auth/tiktok/callback
 * Handle TikTok OAuth callback
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      console.error('TikTok OAuth error:', error);
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
    const tokenResponse = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_key: TIKTOK_CLIENT_KEY,
        client_secret: TIKTOK_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.TIKTOK_REDIRECT_URI || '',
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('TikTok token exchange failed:', errorData);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/settings/social?error=token_exchange_failed`
      );
    }

    const tokenData = await tokenResponse.json();
    const { access_token, refresh_token, expires_in, open_id } = tokenData;

    // Get user info
    const userInfoResponse = await fetch('https://open.tiktokapis.com/v2/user/info/?fields=display_name,avatar_url,follower_count,username', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
      },
    });

    let username = 'TikTok User';
    let followers = 0;
    let profileUrl = '';

    if (userInfoResponse.ok) {
      const userInfo = await userInfoResponse.json();
      username = userInfo.data?.user?.username || userInfo.data?.user?.display_name || 'TikTok User';
      followers = userInfo.data?.user?.follower_count || 0;
      profileUrl = `https://www.tiktok.com/@${username}`;
    }

    // Save connection to Firestore
    const socialConnectionRef = db.collection('socialConnections').doc(`${userId}_tiktok`);
    await socialConnectionRef.set({
      userId,
      platform: 'tiktok',
      connected: true,
      username,
      profileUrl,
      followers,
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresAt: new Date(Date.now() + expires_in * 1000),
      permissions: ['user.info.basic', 'user.info.profile', 'video.publish', 'video.upload'],
      connectedAt: new Date(),
      lastRefreshedAt: new Date(),
      openId: open_id,
    });

    console.log(`✅ TikTok connected for user ${userId}: @${username}`);

    // Redirect back to settings page
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/settings/social?success=tiktok_connected`
    );
  } catch (error: any) {
    console.error('Error in TikTok callback:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/settings/social?error=callback_failed`
    );
  }
}
