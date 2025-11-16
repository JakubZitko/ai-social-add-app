import DocsLayout from '@/components/layout/DocsLayout'
import Link from 'next/link'
import { BookOpen, Code, Sparkles, Video, Users, Mic, CreditCard, HelpCircle } from 'lucide-react'

export default function DocsPage() {
  const cards = [
    {
      title: 'Quick Start',
      description: 'Get up and running with VideoAI in minutes. Learn the basics and create your first AI video.',
      href: '/docs/getting-started',
      icon: <BookOpen className="h-6 w-6" />
    },
    {
      title: 'Features',
      description: 'Explore all the powerful features VideoAI offers to create professional video content.',
      href: '/docs/features',
      icon: <Sparkles className="h-6 w-6" />
    },
    {
      title: 'Video Templates',
      description: 'Browse pre-built templates for UGC ads, social media content, product videos, and more.',
      href: '/docs/templates',
      icon: <Video className="h-6 w-6" />
    },
    {
      title: 'Avatar Library',
      description: 'Access 300+ AI avatars with diverse styles, ages, and emotions for your video projects.',
      href: '/docs/avatars',
      icon: <Users className="h-6 w-6" />
    },
    {
      title: 'Voice Library',
      description: 'Choose from realistic AI voices in 35+ languages with customizable settings.',
      href: '/docs/voices',
      icon: <Mic className="h-6 w-6" />
    },
    {
      title: 'API Reference',
      description: 'Integrate VideoAI into your workflow with our comprehensive API documentation.',
      href: '/docs/api',
      icon: <Code className="h-6 w-6" />
    },
    {
      title: 'Pricing & Billing',
      description: 'Understand our pricing plans, credit system, and how billing works.',
      href: '/docs/billing',
      icon: <CreditCard className="h-6 w-6" />
    },
    {
      title: 'FAQ',
      description: 'Find answers to commonly asked questions about VideoAI features and functionality.',
      href: '/docs/faq',
      icon: <HelpCircle className="h-6 w-6" />
    },
  ]

  return (
    <DocsLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            VideoAI Documentation
          </h1>
          <p className="text-xl text-gray-600">
            Everything you need to know about creating professional AI-powered videos with VideoAI.
          </p>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Popular Topics
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group block p-6 border-2 border-gray-200 rounded-2xl hover:border-gray-900 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-100 rounded-xl group-hover:bg-gray-900 transition-colors">
                    <div className="text-gray-900 group-hover:text-white transition-colors">
                      {card.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {card.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {card.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            What is VideoAI?
          </h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed">
              VideoAI is a cutting-edge AI-powered video creation platform that enables anyone to create professional,
              UGC-style video ads in minutes. Whether you're a marketer, content creator, or business owner, VideoAI
              provides the tools you need to produce engaging video content without expensive equipment or video editing skills.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              With access to 300+ realistic AI avatars, 35+ languages, advanced lip-sync technology, and pre-built templates,
              you can create videos for any platform including TikTok, Instagram, Facebook, YouTube, and more.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Need Help?
          </h2>
          <div className="flex gap-4">
            <Link
              href="/docs/support"
              className="px-6 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
            >
              Contact Support
            </Link>
            <Link
              href="/docs/faq"
              className="px-6 py-3 border-2 border-gray-900 text-gray-900 rounded-full font-medium hover:bg-gray-50 transition-colors"
            >
              View FAQ
            </Link>
          </div>
        </div>
      </div>
    </DocsLayout>
  )
}
