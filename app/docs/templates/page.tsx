import DocsLayout from '@/components/layout/DocsLayout'
import Link from 'next/link'

export default function TemplatesPage() {
  const templates = [
    {
      name: 'UGC Testimonial',
      category: 'Social Proof',
      description: 'Create authentic user-generated content style testimonials that build trust and credibility.',
      platforms: ['TikTok', 'Instagram Reels', 'YouTube Shorts'],
      duration: '15-30 seconds',
      bestFor: 'Product reviews, customer testimonials, social proof',
      scriptStructure: [
        'Hook: Attention-grabbing problem statement',
        'Problem: Describe the pain point',
        'Solution: Introduce the product',
        'Results: Share the transformation',
        'CTA: Direct call-to-action'
      ]
    },
    {
      name: 'TikTok Ad',
      category: 'Paid Advertising',
      description: 'Optimized for TikTok\'s algorithm with trending hooks and native content style.',
      platforms: ['TikTok Ads'],
      duration: '9-15 seconds',
      bestFor: 'E-commerce products, app downloads, brand awareness',
      scriptStructure: [
        'Hook: Trending sound or phrase (0-3s)',
        'Value Prop: Quick benefit statement',
        'Product Showcase: Visual demonstration',
        'Urgency: Limited time offer or scarcity',
        'CTA: Clear next step'
      ]
    },
    {
      name: 'Facebook Ad',
      category: 'Paid Advertising',
      description: 'Longer-form content that works well in Facebook\'s news feed format.',
      platforms: ['Facebook', 'Instagram Feed'],
      duration: '20-45 seconds',
      bestFor: 'Lead generation, product sales, service promotion',
      scriptStructure: [
        'Hook: Question or bold statement',
        'Problem Agitation: Emphasize pain points',
        'Solution Introduction: Present your offer',
        'Benefits: List key advantages',
        'Social Proof: Mention results or testimonials',
        'CTA: Strong call-to-action'
      ]
    },
    {
      name: 'Product Showcase',
      category: 'E-commerce',
      description: 'Highlight product features and benefits in an engaging demonstration format.',
      platforms: ['All platforms'],
      duration: '30-60 seconds',
      bestFor: 'Product launches, feature highlights, comparisons',
      scriptStructure: [
        'Introduction: Product name and purpose',
        'Features: List 3-5 key features',
        'Benefits: How it improves life',
        'Demonstration: Show it in action',
        'Pricing/Offer: Special deal or pricing',
        'CTA: Where to buy'
      ]
    },
    {
      name: 'Affiliate Review',
      category: 'Affiliate Marketing',
      description: 'Honest, authentic review format that drives affiliate conversions.',
      platforms: ['YouTube', 'Instagram', 'TikTok'],
      duration: '45-90 seconds',
      bestFor: 'Affiliate products, honest reviews, recommendations',
      scriptStructure: [
        'Introduction: Personal context',
        'Experience: Your usage story',
        'Pros: What you love about it',
        'Cons: Honest drawbacks (builds trust)',
        'Recommendation: Who it\'s for',
        'CTA: Affiliate link mention'
      ]
    },
    {
      name: 'Educational Content',
      category: 'Educational',
      description: 'Teach concepts, explain processes, or share knowledge in an engaging way.',
      platforms: ['YouTube', 'LinkedIn', 'Instagram'],
      duration: '60-120 seconds',
      bestFor: 'Tutorials, how-to guides, explainer videos',
      scriptStructure: [
        'Hook: What they\'ll learn',
        'Context: Why it matters',
        'Step 1: First teaching point',
        'Step 2: Second teaching point',
        'Step 3: Third teaching point',
        'Recap: Summary of key points',
        'CTA: Next steps or resources'
      ]
    },
    {
      name: 'YouTube Shorts',
      category: 'Short-Form Video',
      description: 'Vertical videos optimized for YouTube\'s short-form algorithm.',
      platforms: ['YouTube Shorts'],
      duration: '15-60 seconds',
      bestFor: 'Quick tips, entertainment, viral content',
      scriptStructure: [
        'Hook: Compelling opening (0-2s)',
        'Value: Main point or entertainment',
        'Payoff: Deliver on the promise',
        'CTA: Subscribe or watch more'
      ]
    },
    {
      name: 'Instagram Reel',
      category: 'Social Media',
      description: 'Trendy, engaging content formatted for Instagram Reels.',
      platforms: ['Instagram Reels'],
      duration: '15-30 seconds',
      bestFor: 'Brand awareness, engagement, trending content',
      scriptStructure: [
        'Hook: Use trending audio or visual',
        'Value: Quick tip or entertainment',
        'Engagement: Ask a question',
        'CTA: Follow for more'
      ]
    }
  ]

  return (
    <DocsLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Video Templates
          </h1>
          <p className="text-xl text-gray-600">
            Pre-built templates designed for specific platforms and use cases
          </p>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 mb-8">
            <h2 className="font-semibold text-gray-900 mb-2">How to Use Templates</h2>
            <p className="text-gray-600 mb-4">
              Templates provide a proven structure for your video scripts. Simply select a template,
              customize the script with your specific content, choose your avatar and voice, and generate.
            </p>
            <Link
              href="/dashboard"
              className="inline-block px-6 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
            >
              Browse Templates in App
            </Link>
          </div>

          <div className="space-y-8">
            {templates.map((template, index) => (
              <div key={index} className="border-2 border-gray-200 rounded-2xl p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {template.name}
                    </h2>
                    <span className="inline-block px-3 py-1 bg-gray-900 text-white text-sm rounded-full">
                      {template.category}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 mb-6">
                  {template.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm">Platforms</h3>
                    <div className="flex flex-wrap gap-2">
                      {template.platforms.map((platform) => (
                        <span key={platform} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm">Duration</h3>
                    <p className="text-gray-600 text-sm">{template.duration}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm">Best For</h3>
                    <p className="text-gray-600 text-sm">{template.bestFor}</p>
                  </div>
                </div>

                <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Script Structure</h3>
                  <ol className="space-y-3">
                    {template.scriptStructure.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-900 text-white text-xs flex items-center justify-center font-semibold">
                          {idx + 1}
                        </span>
                        <span className="text-gray-600 text-sm pt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Best Practices */}
        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Template Best Practices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-2 border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Customization Tips</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-2 flex-shrink-0" />
                  <span>Adapt the script to your brand voice</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-2 flex-shrink-0" />
                  <span>Use specific numbers and data points</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-2 flex-shrink-0" />
                  <span>Add your unique selling propositions</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-2 flex-shrink-0" />
                  <span>Include specific CTAs relevant to your goal</span>
                </li>
              </ul>
            </div>

            <div className="border-2 border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Testing Recommendations</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-2 flex-shrink-0" />
                  <span>Test different hooks for the same content</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-2 flex-shrink-0" />
                  <span>Try various avatars to see what resonates</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-2 flex-shrink-0" />
                  <span>Experiment with video length</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-2 flex-shrink-0" />
                  <span>A/B test different CTAs</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DocsLayout>
  )
}
