'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  Check,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Trash2,
  Settings,
  Lock,
  Users,
  TrendingUp,
  BarChart3,
  Loader,
} from 'lucide-react';
import { FaTiktok } from 'react-icons/fa';
import { Instagram, Youtube } from 'lucide-react';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { SocialConnection } from '@/lib/firestore/types';

function SocialConnectionsContent() {
  const router = useRouter();
  const { user } = useAuth();

  const [connections, setConnections] = useState<SocialConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<string | null>(null);

  // Fetch social connections from Firestore
  useEffect(() => {
    const fetchConnections = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const connectionsQuery = query(
          collection(db, 'socialConnections'),
          where('userId', '==', user.uid)
        );
        const snapshot = await getDocs(connectionsQuery);
        const connectionsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as SocialConnection[];

        // Create a map of all platforms with their connection status
        const platforms: ('tiktok' | 'instagram' | 'youtube')[] = ['tiktok', 'instagram', 'youtube'];
        const fullConnections = platforms.map(platform => {
          const existing = connectionsData.find(c => c.platform === platform);
          return existing || { platform, connected: false };
        });

        setConnections(fullConnections);
      } catch (error) {
        console.error('Error fetching social connections:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, [user]);

  const getPlatformInfo = (platform: string) => {
    switch (platform) {
      case 'tiktok':
        return {
          name: 'TikTok',
          icon: <FaTiktok className="h-6 w-6" />,
          color: 'from-gray-900 to-gray-700',
          bgColor: 'bg-gray-900',
          lightBg: 'from-gray-50 to-gray-100',
          borderColor: 'border-gray-200',
        };
      case 'instagram':
        return {
          name: 'Instagram',
          icon: <Instagram className="h-6 w-6" />,
          color: 'from-gray-700 to-gray-700',
          bgColor: 'bg-gradient-to-br from-gray-700 to-gray-700',
          lightBg: 'from-gray-50 to-gray-50',
          borderColor: 'border-gray-200',
        };
      case 'youtube':
        return {
          name: 'YouTube',
          icon: <Youtube className="h-6 w-6" />,
          color: 'from-gray-700 to-gray-600',
          bgColor: 'bg-gray-700',
          lightBg: 'from-gray-50 to-gray-50',
          borderColor: 'border-gray-200',
        };
      default:
        return {
          name: platform,
          icon: <Settings className="h-6 w-6" />,
          color: 'from-gray-600 to-gray-500',
          bgColor: 'bg-gray-600',
          lightBg: 'from-gray-50 to-gray-100',
          borderColor: 'border-gray-200',
        };
    }
  };

  const handleConnect = async (platform: string) => {
    setConnecting(platform);

    // Simulate OAuth flow
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // TODO: In production, this would:
    // 1. Redirect to OAuth authorization URL
    // 2. Handle OAuth callback
    // 3. Store access token in Firestore
    // 4. Fetch user profile

    setConnections(
      connections.map((conn) =>
        conn.platform === platform
          ? {
              ...conn,
              connected: true,
              username: `@${user?.email?.split('@')[0]}`,
              followers: Math.floor(Math.random() * 10000),
              connectedAt: new Date(),
              permissions: ['read_profile', 'post_videos', 'read_analytics'],
            }
          : conn
      )
    );

    setConnecting(null);
  };

  const handleDisconnect = async (platform: string) => {
    if (confirm(`Are you sure you want to disconnect ${getPlatformInfo(platform).name}?`)) {
      try {
        const connection = connections.find(c => c.platform === platform);
        if (connection?.id) {
          await deleteDoc(doc(db, 'socialConnections', connection.id));
        }

        // Update local state
        setConnections(
          connections.map((conn) =>
            conn.platform === platform
              ? { platform: conn.platform, connected: false }
              : conn
          )
        );
      } catch (error) {
        console.error('Error disconnecting:', error);
        alert('Failed to disconnect. Please try again.');
      }
    }
  };

  const connectedCount = connections.filter((c) => c.connected).length;

  return (
    <div className="p-4 h-full overflow-hidden">
      <div className="bg-white h-full rounded-[40px] shadow-sm border border-gray-200/60 overflow-y-auto">
        {/* Header */}
        <header className="h-20 px-8 flex items-center justify-between border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur z-10">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Social Media Connections</h1>
            <p className="text-sm text-gray-500">Connect your accounts to auto-post videos</p>
          </div>
          <div className="px-4 py-2 bg-gradient-to-br from-gray-50 to-gray-50 rounded-xl border border-gray-200">
            <span className="text-xs font-bold text-gray-600">
              {connectedCount} of {connections.length} connected
            </span>
          </div>
        </header>

        {/* Main Content */}
        <div className="p-8 max-w-5xl mx-auto">
          {/* Info Banner */}
          <div className="mb-8 p-6 bg-gradient-to-br from-gray-50 to-gray-50 rounded-[24px] border border-gray-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center flex-shrink-0">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Secure OAuth 2.0</h3>
                <p className="text-sm text-gray-700">
                  We use industry-standard OAuth 2.0 to connect your accounts. We never store your
                  passwords and you can revoke access at any time.
                </p>
              </div>
            </div>
          </div>

          {/* Social Connections */}
          <div className="space-y-6">
            {connections.map((connection) => {
              const platformInfo = getPlatformInfo(connection.platform);

              return (
                <div
                  key={connection.platform}
                  className={`bg-gradient-to-br ${platformInfo.lightBg} rounded-[24px] p-6 border-2 ${platformInfo.borderColor}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div
                        className={`w-16 h-16 ${platformInfo.bgColor} rounded-2xl flex items-center justify-center flex-shrink-0 text-white`}
                      >
                        {platformInfo.icon}
                      </div>

                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {platformInfo.name}
                        </h3>

                        {connection.connected ? (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Check className="h-5 w-5 text-gray-600" />
                              <span className="text-sm font-semibold text-gray-700">
                                Connected
                              </span>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm">
                                <Users className="h-4 w-4 text-gray-500" />
                                <span className="font-bold text-gray-900">
                                  {connection.username}
                                </span>
                                <span className="text-gray-600">
                                  • {connection.followers?.toLocaleString()} followers
                                </span>
                              </div>

                              <div className="text-xs text-gray-600">
                                Connected on{' '}
                                {connection.connectedAt?.toLocaleDateString('en-US', {
                                  month: 'long',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </div>
                            </div>

                            {/* Permissions */}
                            <div className="mt-4">
                              <div className="text-xs font-semibold text-gray-600 mb-2">
                                PERMISSIONS
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {connection.permissions?.map((perm) => (
                                  <span
                                    key={perm}
                                    className="px-2 py-1 bg-white rounded-lg text-xs font-medium text-gray-700 border border-gray-200"
                                  >
                                    {perm.replace('_', ' ')}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-600">
                            Connect your {platformInfo.name} account to enable automatic posting
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 ml-6">
                      {connection.connected ? (
                        <>
                          {connection.profileUrl && (
                            <a
                              href={connection.profileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-white hover:bg-gray-50 rounded-xl text-sm font-semibold text-gray-900 transition-all border border-gray-200 flex items-center gap-2"
                            >
                              View Profile
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                          <button
                            onClick={() => handleConnect(connection.platform)}
                            className="px-4 py-2 bg-white hover:bg-gray-50 rounded-xl text-sm font-semibold text-gray-900 transition-all border border-gray-200 flex items-center gap-2"
                          >
                            <RefreshCw className="h-4 w-4" />
                            Refresh
                          </button>
                          <button
                            onClick={() => handleDisconnect(connection.platform)}
                            className="px-4 py-2 bg-white hover:bg-gray-50 rounded-xl text-sm font-semibold text-gray-600 transition-all border border-gray-200 flex items-center gap-2"
                          >
                            <Trash2 className="h-4 w-4" />
                            Disconnect
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleConnect(connection.platform)}
                          disabled={connecting === connection.platform}
                          className={`px-6 py-3 bg-gradient-to-r ${platformInfo.color} text-white rounded-xl font-bold hover:shadow-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
                        >
                          {connecting === connection.platform ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Connecting...
                            </>
                          ) : (
                            <>
                              Connect {platformInfo.name}
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Help Section */}
          <div className="mt-8 p-6 bg-gray-50 rounded-[24px] border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Need Help?</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-gray-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>TikTok:</strong> You'll need a TikTok Business account to use the API.
                  Learn more in our{' '}
                  <a href="/docs/tiktok" className="text-gray-600 hover:underline">
                    TikTok integration guide
                  </a>
                  .
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-gray-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Instagram:</strong> Requires a Facebook Business Page linked to your
                  Instagram account.{' '}
                  <a href="/docs/instagram" className="text-gray-600 hover:underline">
                    Setup instructions
                  </a>
                  .
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-gray-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>YouTube:</strong> Works with any YouTube channel. Make sure you have
                  upload permissions.{' '}
                  <a href="/docs/youtube" className="text-gray-600 hover:underline">
                    Learn more
                  </a>
                  .
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SocialConnectionsPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <SocialConnectionsContent />
      </AppLayout>
    </ProtectedRoute>
  );
}
