'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FullPageSpinner } from '@/components/ui/Spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showSpinner, setShowSpinner] = useState(true);

  useEffect(() => {
    // Only show spinner for a maximum of 1 second
    const spinnerTimeout = setTimeout(() => {
      setShowSpinner(false);
    }, 1000);

    return () => clearTimeout(spinnerTimeout);
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading && showSpinner) {
    return <FullPageSpinner />;
  }

  if (!user) {
    // Don't show anything while redirecting
    return null;
  }

  return <>{children}</>;
}
