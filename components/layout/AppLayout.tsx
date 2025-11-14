'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutGrid,
  Plus,
  Video,
  Folder,
  Settings,
  Mic,
  LogOut,
  Sparkles,
  CreditCard,
} from 'lucide-react';

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

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="flex h-screen bg-[#F3F4F6] font-sans text-gray-900">
      {/* --- SIDEBAR (Fixed Left) --- */}
      <aside className="w-72 flex flex-col p-6 shrink-0">
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
          <Plus size={20} />
          <span className="font-semibold text-sm">New Project</span>
        </Link>

        {/* Nav Menu */}
        <nav className="space-y-1 flex-1">
          <NavItem
            icon={<LayoutGrid size={20} />}
            label="Dashboard"
            href="/dashboard"
            active={pathname === '/dashboard'}
          />
          <NavItem
            icon={<Video size={20} />}
            label="Create Video"
            href="/create"
            active={pathname === '/create'}
          />
          <NavItem
            icon={<Folder size={20} />}
            label="My Projects"
            href="/projects"
            active={pathname === '/projects'}
          />

          <div className="pt-6 pb-2">
            <p className="px-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
              Workspace
            </p>
          </div>

          <NavItem
            icon={<Mic size={20} />}
            label="Voices"
            href="/voices"
            active={pathname === '/voices'}
          />
          <NavItem
            icon={<CreditCard size={20} />}
            label="Billing"
            href="/billing"
            active={pathname === '/billing'}
          />
          <NavItem
            icon={<Settings size={20} />}
            label="Settings"
            href="/settings"
            active={pathname === '/settings'}
          />
        </nav>

        {/* Credits Card */}
        <div className="mb-4 bg-gradient-to-br from-green-50 to-blue-50 p-4 rounded-2xl border-2 border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-green-600" />
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
              Your Credits
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-3">
            {user?.credits || 0}
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
            <LogOut size={16} className="text-gray-400" />
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
