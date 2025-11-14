import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';

const INSTAGRAM_APP_ID = process.env.INSTAGRAM_APP_ID || '';
const INSTAGRAM_APP_SECRET = process.env.INSTAGRAM_APP_SECRET || '';
const INSTAGRAM_REDIRECT_URI = process.env.INSTAGRAM_REDIRECT_URI || '';

/**
 * GET /api/auth/instagram/callback
 * Handle Instagram OAuth callback
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      console.error('Instagram OAuth error:', error);
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
    const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: INSTAGRAM_APP_ID,
        client_secret: INSTAGRAM_APP_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: INSTAGRAM_REDIRECT_URI,
        code,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('Instagram token exchange failed:', errorData);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/settings/social?error=token_exchange_failed`
      );
    }

    const tokenData = await tokenResponse.json();
    const { access_token, user_id } = tokenData;

    // Exchange short-lived token for long-lived token
    const longLivedResponse = await fetch(
      `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${INSTAGRAM_APP_SECRET}&access_token=${access_token}`
    );

    const longLivedData = await longLivedResponse.json();
    const longLivedToken = longLivedData.access_token;
    const expiresIn = longLivedData.expires_in; // Usually 60 days

    // Get user profile info
    const profileResponse = await fetch(
      `https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${longLivedToken}`
    );

    let username = 'Instagram User';
    let followers = 0;
    let profileUrl = '';

    if (profileResponse.ok) {
      const profileData = await profileResponse.json();
      username = profileData.username || 'Instagram User';
      profileUrl = `https://www.instagram.com/${username}`;
      // Note: Follower count requires additional permissions
    }

    // Save connection to Firestore
    const socialConnectionRef = db.collection('socialConnections').doc(`${userId}_instagram`);
    await socialConnectionRef.set({
      userId,
      platform: 'instagram',
      connected: true,
      username,
      profileUrl,
      followers,
      accessToken: longLivedToken,
      expiresAt: new Date(Date.now() + expiresIn * 1000),
      permissions: ['instagram_basic', 'instagram_content_publish'],
      connectedAt: new Date(),
      lastRefreshedAt: new Date(),
      instagramUserId: user_id,
    });

    console.log(`✅ Instagram connected for user ${userId}: @${username}`);

    // Redirect back to settings page
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/settings/social?success=instagram_connected`
    );
  } catch (error: any) {
    console.error('Error in Instagram callback:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/settings/social?error=callback_failed`
    );
  }
}
