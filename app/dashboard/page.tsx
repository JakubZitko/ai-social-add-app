'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import {
  Sparkles,
  Plus,
  Video,
  Clock,
  CheckCircle,
  XCircle,
  User,
  LogOut,
} from 'lucide-react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Project } from '@/types';

function DashboardContent() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const projectsRef = collection(db, 'projects');
      const q = query(
        projectsRef,
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      const projectsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        completedAt: doc.data().completedAt?.toDate(),
      })) as Project[];

      setProjects(projectsData);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-blue-600 animate-spin" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'processing':
        return 'Processing';
      case 'failed':
        return 'Failed';
      default:
        return 'Draft';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">VideoAI</span>
            </div>

            <div className="flex items-center gap-4">
              {/* Credit Counter */}
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
                <Sparkles className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-semibold text-blue-900">
                  {user?.credits || 0} Credits
                </span>
              </div>

              {/* User Menu */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user?.email}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.displayName || 'Creator'}!
          </h1>
          <p className="mt-2 text-gray-600">
            Create professional video ads in minutes with AI
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card
            hover
            onClick={() => router.push('/create')}
            className="cursor-pointer border-2 border-blue-600 bg-gradient-to-br from-blue-50 to-white"
          >
            <CardBody className="flex flex-col items-center justify-center py-8">
              <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center mb-4">
                <Plus className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Create New Video
              </h3>
              <p className="text-sm text-gray-600 mt-2 text-center">
                Start a new project with AI avatars
              </p>
            </CardBody>
          </Card>

          <Card hover className="cursor-pointer">
            <CardBody className="flex flex-col items-center justify-center py-8">
              <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <Video className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Browse Templates
              </h3>
              <p className="text-sm text-gray-600 mt-2 text-center">
                Use pre-made templates for faster creation
              </p>
            </CardBody>
          </Card>

          <Card hover className="cursor-pointer">
            <CardBody className="flex flex-col items-center justify-center py-8">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Sparkles className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Buy More Credits
              </h3>
              <p className="text-sm text-gray-600 mt-2 text-center">
                Get more credits to create unlimited videos
              </p>
            </CardBody>
          </Card>
        </div>

        {/* Projects Section */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">
              Your Projects
            </h2>
          </CardHeader>
          <CardBody>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-12">
                <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No projects yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Create your first video to get started
                </p>
                <Button
                  variant="primary"
                  onClick={() => router.push('/create')}
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Create Your First Video
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <Card
                    key={project.id}
                    hover
                    onClick={() => router.push(`/video/${project.id}`)}
                    className="cursor-pointer"
                  >
                    <div className="aspect-video bg-gray-900 rounded-t-lg relative">
                      {project.thumbnailUrl ? (
                        <img
                          src={project.thumbnailUrl}
                          alt={project.scriptText.slice(0, 50)}
                          className="w-full h-full object-cover rounded-t-lg"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Video className="h-12 w-12 text-gray-600" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <div className="flex items-center gap-1 px-2 py-1 bg-black/70 rounded-full text-white text-xs">
                          {getStatusIcon(project.status)}
                          <span className="ml-1">{getStatusText(project.status)}</span>
                        </div>
                      </div>
                    </div>
                    <CardBody>
                      <h3 className="font-semibold text-gray-900 mb-1 truncate">
                        {project.scriptText.slice(0, 50)}
                        {project.scriptText.length > 50 && '...'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {project.type === 'talking_actor' ? 'Talking Head' : 'Gesture Only'}
                        {' · '}
                        {project.createdAt.toLocaleDateString()}
                      </p>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
