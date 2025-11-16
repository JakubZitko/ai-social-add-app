'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BookOpen,
  Code,
  Sparkles,
  Video,
  Users,
  Mic,
  CreditCard,
  HelpCircle,
  LifeBuoy,
  Shield,
  FileText,
  Info,
  Mail,
  Home,
  Zap
} from 'lucide-react'
import Header from './Header'

interface DocsLayoutProps {
  children: React.ReactNode
}

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
}

const navSections = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Introduction', href: '/docs', icon: <Home className="h-4 w-4" /> },
      { title: 'Quick Start', href: '/docs/getting-started', icon: <Zap className="h-4 w-4" /> },
    ]
  },
  {
    title: 'Guides',
    items: [
      { title: 'Features Overview', href: '/docs/features', icon: <Sparkles className="h-4 w-4" /> },
      { title: 'Video Templates', href: '/docs/templates', icon: <Video className="h-4 w-4" /> },
      { title: 'Avatar Library', href: '/docs/avatars', icon: <Users className="h-4 w-4" /> },
      { title: 'Voice Library', href: '/docs/voices', icon: <Mic className="h-4 w-4" /> },
      { title: 'Pricing & Billing', href: '/docs/billing', icon: <CreditCard className="h-4 w-4" /> },
    ]
  },
  {
    title: 'API Reference',
    items: [
      { title: 'API Documentation', href: '/docs/api', icon: <Code className="h-4 w-4" /> },
    ]
  },
  {
    title: 'Support',
    items: [
      { title: 'FAQ', href: '/docs/faq', icon: <HelpCircle className="h-4 w-4" /> },
      { title: 'Support', href: '/docs/support', icon: <LifeBuoy className="h-4 w-4" /> },
      { title: 'Contact Us', href: '/docs/contact', icon: <Mail className="h-4 w-4" /> },
    ]
  },
  {
    title: 'Legal',
    items: [
      { title: 'Privacy Policy', href: '/docs/privacy', icon: <Shield className="h-4 w-4" /> },
      { title: 'Terms of Service', href: '/docs/terms', icon: <FileText className="h-4 w-4" /> },
      { title: 'About Us', href: '/docs/about', icon: <Info className="h-4 w-4" /> },
    ]
  },
]

export default function DocsLayout({ children }: DocsLayoutProps) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex gap-12">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-8">
              {navSections.map((section) => (
                <div key={section.title}>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    {section.title}
                  </h3>
                  <ul className="space-y-2">
                    {section.items.map((item) => {
                      const isActive = pathname === item.href
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                              isActive
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                          >
                            {item.icon}
                            {item.title}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </ul>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="prose prose-gray max-w-none">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
