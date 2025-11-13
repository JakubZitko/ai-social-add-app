'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Sparkles, Menu, X } from 'lucide-react';

export function Header() {
  const { user, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold text-gray-900">VideoAI</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:gap-x-8">
          <Link
            href="#features"
            className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors"
          >
            Features
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="#examples"
            className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors"
          >
            Examples
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex md:items-center md:gap-x-4">
          {loading ? (
            <div className="h-10 w-32 bg-gray-200 animate-pulse rounded-lg" />
          ) : user ? (
            <>
              <Link href="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-900">
                  {user.credits} Credits
                </span>
              </div>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link href="/register">
                <Button variant="primary">Get Started</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="space-y-1 px-4 pb-3 pt-2">
            <Link
              href="#features"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="#examples"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Examples
            </Link>
            <div className="border-t border-gray-200 pt-2">
              {user ? (
                <>
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="primary" className="w-full mb-2">
                      Dashboard
                    </Button>
                  </Link>
                  <div className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-900">
                      {user.credits} Credits
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full mb-2">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="primary" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
