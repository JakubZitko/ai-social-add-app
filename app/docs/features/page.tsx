import DocsLayout from '@/components/layout/DocsLayout'
import { Users, Mic, Video, Sparkles, Globe, Wand2, Download, Share2 } from 'lucide-react'

export default function FeaturesPage() {
  const features = [
    {
      icon: <Users className="h-8 w-8" />,
      title: '300+ AI Avatars',
      description: 'Access a diverse library of photorealistic AI avatars representing different ages, genders, ethnicities, and styles.',
      capabilities: [
        'Multiple age ranges (18-25, 26-35, 36-50, 50+)',
        'Diverse gender representation',
        'Various emotional expressions',
        'Different accessories (glasses, hats, jewelry)',
        'Professional and casual styles',
        'Industry-specific avatars'
      ]
    },
    {
      icon: <Mic className="h-8 w-8" />,
      title: 'AI Voice Library',
      description: 'Choose from realistic AI voices in 35+ languages with customizable voice settings for the perfect tone.',
      capabilities: [
        '35+ languages and dialects',
        'Multiple accents per language',
        'Male and female voice options',
        'Adjustable speed (0.5x - 2x)',
        'Voice stability control',
        'Similarity boost for consistency',
        'Style exaggeration options'
      ]
    },
    {
      icon: <Video className="h-8 w-8" />,
      title: 'Advanced Lip-Sync',
      description: 'Industry-leading lip-sync technology ensures your avatar\'s mouth movements perfectly match the audio.',
      capabilities: [
        'Automatic audio-visual synchronization',
        'Multi-language lip-sync support',
        'Natural facial animations',
        'Emotion-aware expressions',
        'Realistic mouth movements',
        'No manual timing required'
      ]
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: 'AI Script Enhancement',
      description: 'Use AI to improve your scripts with better hooks, structure, and calls-to-action.',
      capabilities: [
        'Automatic script improvement',
        'Hook generation for first 3 seconds',
        'CTA suggestions',
        'Tone adjustment',
        'Length optimization',
        'Grammar and clarity fixes'
      ]
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: 'Multiple Aspect Ratios',
      description: 'Export videos in any format for different social media platforms and use cases.',
      capabilities: [
        '9:16 (Vertical) - TikTok, Reels, Shorts',
        '16:9 (Horizontal) - YouTube, Facebook',
        '1:1 (Square) - Instagram Feed',
        'High quality 1080p output',
        'Optimized file sizes',
        'Platform-specific formatting'
      ]
    },
    {
      icon: <Wand2 className="h-8 w-8" />,
      title: 'Pre-Built Templates',
      description: 'Speed up creation with professionally designed templates for various content types.',
      capabilities: [
        'UGC testimonial templates',
        'Product showcase templates',
        'TikTok ad templates',
        'Facebook ad templates',
        'Educational content templates',
        'Affiliate review templates',
        'Customizable scripts and hooks'
      ]
    },
    {
      icon: <Download className="h-8 w-8" />,
      title: 'Easy Export & Download',
      description: 'Download your videos in high quality or share directly to social media platforms.',
      capabilities: [
        'MP4 format downloads',
        '1080p HD quality',
        'Fast download speeds',
        'Shareable video links',
        'Bulk download options',
        'Cloud storage integration'
      ]
    },
    {
      icon: <Share2 className="h-8 w-8" />,
      title: 'Social Media Integration',
      description: 'Connect your social accounts and post directly from VideoAI.',
      capabilities: [
        'Instagram posting',
        'TikTok publishing',
        'YouTube uploads',
        'Facebook sharing',
        'Auto-caption generation',
        'Scheduling capabilities'
      ]
    }
  ]

  return (
    <DocsLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Features Overview
          </h1>
          <p className="text-xl text-gray-600">
            Explore the powerful features that make VideoAI the best platform for creating AI-powered videos
          </p>
        </div>

        <div className="border-t border-gray-200 pt-8 space-y-12">
          {features.map((feature, index) => (
            <section key={index} className="border-2 border-gray-200 rounded-2xl p-8">
              <div className="flex items-start gap-6">
                <div className="p-4 bg-gray-900 text-white rounded-xl flex-shrink-0">
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h2>
                  <p className="text-gray-600 mb-6">
                    {feature.description}
                  </p>
                  <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Capabilities:</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {feature.capabilities.map((capability, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-2 flex-shrink-0" />
                          <span>{capability}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* Additional Features */}
        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Additional Capabilities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-2 border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Project Management</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                  <span>Organize videos in collections</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                  <span>Search and filter projects</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                  <span>Track video status in real-time</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                  <span>Bulk operations support</span>
                </li>
              </ul>
            </div>

            <div className="border-2 border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Collaboration</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                  <span>Share projects with team members</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                  <span>Commenting and feedback</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                  <span>Version history</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                  <span>Team workspace management</span>
                </li>
              </ul>
            </div>

            <div className="border-2 border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Automation</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                  <span>Batch video generation</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                  <span>Scheduled posting</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                  <span>Workflow automation</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                  <span>API integration</span>
                </li>
              </ul>
            </div>

            <div className="border-2 border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Analytics</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                  <span>Video performance metrics</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                  <span>Credit usage tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                  <span>Generation time stats</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                  <span>Usage reports</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Coming Soon
          </h2>
          <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-600">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                <span>Custom avatar creation from photos</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                <span>Voice cloning technology</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                <span>Background scene customization</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                <span>Multi-avatar scenes</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                <span>Advanced video editing tools</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                <span>Real-time collaboration</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </DocsLayout>
  )
}
