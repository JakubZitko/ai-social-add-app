'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCredits } from '@/hooks/useCredits';
import {
  Squares2X2Icon,
  PlusIcon,
  VideoCameraIcon,
  FolderIcon,
  Cog6ToothIcon,
  MicrophoneIcon,
  ArrowRightOnRectangleIcon,
  SparklesIcon,
  CreditCardIcon,
  FilmIcon,
  CalendarIcon,
  RectangleStackIcon,
  BoltIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

function NavItem({ icon, label, href, active }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`
      flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200
      ${
        active
          ? 'bg-white shadow-sm text-gray-900 font-semibold border border-gray-100'
          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
      }
    `}
    >
      <div className={active ? 'text-black' : 'text-gray-400'}>{icon}</div>
      <span className="text-sm">{label}</span>
    </Link>
  );
}

export function Sidebar() {
  const { user, signOut } = useAuth();
  const { credits } = useCredits();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-xl shadow-lg border border-gray-200"
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6 text-gray-600" />
        ) : (
          <Bars3Icon className="h-6 w-6 text-gray-600" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed lg:relative inset-y-0 left-0 z-40
        w-72 flex flex-col p-6 shrink-0 bg-[#F3F4F6]
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-3 px-2 mb-10">
        <div className="w-8 h-8 bg-gray-900 rounded-xl flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white rounded-full"></div>
        </div>
        <span className="font-bold text-lg tracking-tight">VideoAI</span>
      </Link>

      {/* New Project Button */}
      <Link
        href="/create"
        className="mb-6 flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-3 rounded-2xl hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/20 hover:shadow-xl"
      >
        <PlusIcon className="h-5 w-5" />
        <span className="font-semibold text-sm">New Project</span>
      </Link>

      {/* Nav Menu */}
      <nav className="space-y-1 flex-1 overflow-y-auto">
        {/* Main Navigation */}
        <NavItem
          icon={<Squares2X2Icon className="h-5 w-5" />}
          label="Dashboard"
          href="/dashboard"
          active={pathname === '/dashboard'}
        />
        <NavItem
          icon={<VideoCameraIcon className="h-5 w-5" />}
          label="Create Video"
          href="/create"
          active={pathname === '/create'}
        />
        <NavItem
          icon={<FolderIcon className="h-5 w-5" />}
          label="My Projects"
          href="/projects"
          active={pathname === '/projects'}
        />

        {/* Workspace Section */}
        <div className="pt-6 pb-2">
          <p className="px-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
            Workspace
          </p>
        </div>

        <NavItem
          icon={<FilmIcon className="h-5 w-5" />}
          label="Scene Generator"
          href="/scenes"
          active={pathname === '/scenes'}
        />
        <NavItem
          icon={<CalendarIcon className="h-5 w-5" />}
          label="Posting Calendar"
          href="/posts"
          active={pathname === '/posts'}
        />
        <NavItem
          icon={<RectangleStackIcon className="h-5 w-5" />}
          label="Bulk Generation"
          href="/batches/new"
          active={pathname === '/batches/new'}
        />
        <NavItem
          icon={<BoltIcon className="h-5 w-5" />}
          label="Automations"
          href="/automations"
          active={pathname === '/automations'}
        />
        <NavItem
          icon={<MicrophoneIcon className="h-5 w-5" />}
          label="Voices"
          href="/voices"
          active={pathname === '/voices'}
        />
        <NavItem
          icon={<CreditCardIcon className="h-5 w-5" />}
          label="Billing"
          href="/billing"
          active={pathname === '/billing'}
        />
        <NavItem
          icon={<Cog6ToothIcon className="h-5 w-5" />}
          label="Settings"
          href="/settings"
          active={pathname === '/settings'}
        />
      </nav>

      {/* Credits Card */}
      <div className="mb-4 bg-gradient-to-br from-green-50 to-blue-50 p-4 rounded-2xl border-2 border-green-200">
        <div className="flex items-center gap-2 mb-2">
          <SparklesIcon className="h-4 w-4 text-green-600" />
          <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
            Your Credits
          </span>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-3">
          {credits || 0}
        </div>
        <Link
          href="/billing"
          className="block w-full text-center bg-white text-gray-900 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-gray-50 transition-colors border border-gray-200"
        >
          Get More Credits
        </Link>
      </div>

      {/* User Profile (Bottom) */}
      <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full overflow-hidden border border-white shadow-inner">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600 font-bold">
              {user?.email?.[0].toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-gray-900 truncate">
            {user?.displayName || user?.email?.split('@')[0] || 'User'}
          </div>
          <div className="text-xs text-gray-500 truncate">{user?.email}</div>
        </div>
        <button
          onClick={handleSignOut}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Sign out"
        >
          <ArrowRightOnRectangleIcon className="h-4 w-4 text-gray-400" />
        </button>
      </div>
    </aside>
    </>
  );
}
