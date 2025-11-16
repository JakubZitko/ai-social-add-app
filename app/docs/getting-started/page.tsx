import DocsLayout from '@/components/layout/DocsLayout'
import Link from 'next/link'

export default function GettingStartedPage() {
  return (
    <DocsLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Getting Started
          </h1>
          <p className="text-xl text-gray-600">
            Learn how to create your first AI video in minutes
          </p>
        </div>

        <div className="border-t border-gray-200 pt-8 space-y-8">
          {/* Step 1 */}
          <section>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold">
                1
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Create Your Account
              </h2>
            </div>
            <div className="ml-14 space-y-4">
              <p className="text-gray-600">
                Sign up for a free VideoAI account to get started. You'll receive 10 free credits to create your first videos.
              </p>
              <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Sign Up Options:</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                    <span>Email and password</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                    <span>Google OAuth (fastest option)</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/register"
                className="inline-block px-6 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
              >
                Sign Up Now
              </Link>
            </div>
          </section>

          {/* Step 2 */}
          <section>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold">
                2
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Complete Onboarding
              </h2>
            </div>
            <div className="ml-14 space-y-4">
              <p className="text-gray-600">
                After signing up, you'll be guided through a quick onboarding process to personalize your experience.
                Select your primary use case:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-2 border-gray-200 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-1">E-commerce Product Ads</h4>
                  <p className="text-sm text-gray-600">Create product showcase videos</p>
                </div>
                <div className="border-2 border-gray-200 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-1">Social Media Content</h4>
                  <p className="text-sm text-gray-600">Generate content for TikTok, Instagram, etc.</p>
                </div>
                <div className="border-2 border-gray-200 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-1">Affiliate Reviews</h4>
                  <p className="text-sm text-gray-600">Create authentic product reviews</p>
                </div>
                <div className="border-2 border-gray-200 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-1">Educational Videos</h4>
                  <p className="text-sm text-gray-600">Teach and explain concepts</p>
                </div>
              </div>
            </div>
          </section>

          {/* Step 3 */}
          <section>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold">
                3
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Choose Your Avatar
              </h2>
            </div>
            <div className="ml-14 space-y-4">
              <p className="text-gray-600">
                Browse our library of 300+ AI avatars and select the one that best fits your brand and message.
              </p>
              <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Filter Avatars By:</h3>
                <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                    <span>Gender (Male, Female, Non-binary)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                    <span>Age (18-25, 26-35, 36-50, 50+)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                    <span>Emotion (Happy, Serious, Friendly, etc.)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                    <span>Accessories (Glasses, Hats, None)</span>
                  </div>
                </div>
              </div>
              <Link
                href="/docs/avatars"
                className="inline-block px-6 py-3 border-2 border-gray-900 text-gray-900 rounded-full font-medium hover:bg-gray-50 transition-colors"
              >
                Learn More About Avatars
              </Link>
            </div>
          </section>

          {/* Step 4 */}
          <section>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold">
                4
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Write Your Script
              </h2>
            </div>
            <div className="ml-14 space-y-4">
              <p className="text-gray-600">
                Enter the text you want your AI avatar to speak. You can write up to 1,500 characters per video.
              </p>
              <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Script Writing Tips:</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-2 flex-shrink-0" />
                    <span><strong className="text-gray-900">Keep it conversational:</strong> Write like you're talking to a friend</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-2 flex-shrink-0" />
                    <span><strong className="text-gray-900">Hook in first 3 seconds:</strong> Grab attention immediately</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-2 flex-shrink-0" />
                    <span><strong className="text-gray-900">Include a clear CTA:</strong> Tell viewers what to do next</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-2 flex-shrink-0" />
                    <span><strong className="text-gray-900">Use AI enhancement:</strong> Click the enhance button for AI-powered script improvement</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Step 5 */}
          <section>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold">
                5
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Select Voice Settings
              </h2>
            </div>
            <div className="ml-14 space-y-4">
              <p className="text-gray-600">
                Choose an AI voice and customize it to match your brand's tone and style.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Voice Options</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• 35+ languages available</li>
                    <li>• Multiple accents per language</li>
                    <li>• Male and female voices</li>
                    <li>• Preview before selecting</li>
                  </ul>
                </div>
                <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Customization</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Speed: 0.5x - 2x</li>
                    <li>• Stability: 0 - 100%</li>
                    <li>• Similarity boost</li>
                    <li>• Style exaggeration</li>
                  </ul>
                </div>
              </div>
              <Link
                href="/docs/voices"
                className="inline-block px-6 py-3 border-2 border-gray-900 text-gray-900 rounded-full font-medium hover:bg-gray-50 transition-colors"
              >
                Explore Voice Library
              </Link>
            </div>
          </section>

          {/* Step 6 */}
          <section>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold">
                6
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Choose Aspect Ratio & Generate
              </h2>
            </div>
            <div className="ml-14 space-y-4">
              <p className="text-gray-600">
                Select the video format that matches your target platform and click generate.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border-2 border-gray-200 rounded-xl p-4 text-center">
                  <div className="w-16 h-28 bg-gray-200 rounded mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900">9:16 (Vertical)</h4>
                  <p className="text-sm text-gray-600 mt-1">TikTok, Instagram Reels, YouTube Shorts</p>
                </div>
                <div className="border-2 border-gray-200 rounded-xl p-4 text-center">
                  <div className="w-28 h-16 bg-gray-200 rounded mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900">16:9 (Horizontal)</h4>
                  <p className="text-sm text-gray-600 mt-1">YouTube, Facebook, LinkedIn</p>
                </div>
                <div className="border-2 border-gray-200 rounded-xl p-4 text-center">
                  <div className="w-20 h-20 bg-gray-200 rounded mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900">1:1 (Square)</h4>
                  <p className="text-sm text-gray-600 mt-1">Instagram Feed, Facebook Feed</p>
                </div>
              </div>
              <div className="bg-gray-100 border-2 border-gray-300 rounded-xl p-6">
                <p className="text-sm text-gray-700">
                  <strong>Generation Time:</strong> Your video will be ready in 2-5 minutes depending on length and complexity.
                  You'll receive a notification when it's complete.
                </p>
              </div>
            </div>
          </section>

          {/* Step 7 */}
          <section>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold">
                7
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Download & Share
              </h2>
            </div>
            <div className="ml-14 space-y-4">
              <p className="text-gray-600">
                Once your video is ready, you can download it in high quality or share it directly to social media platforms.
              </p>
              <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">What You Can Do:</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                    <span>Download in MP4 format (1080p)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                    <span>Share video URL with team members</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                    <span>Regenerate with different settings if needed</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                    <span>View all your projects in the dashboard</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* Next Steps */}
        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Next Steps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/docs/templates"
              className="p-6 border-2 border-gray-200 rounded-2xl hover:border-gray-900 transition-colors"
            >
              <h3 className="font-semibold text-gray-900 mb-2">Explore Templates</h3>
              <p className="text-sm text-gray-600">
                Use pre-built templates to speed up your video creation
              </p>
            </Link>
            <Link
              href="/docs/features"
              className="p-6 border-2 border-gray-200 rounded-2xl hover:border-gray-900 transition-colors"
            >
              <h3 className="font-semibold text-gray-900 mb-2">Learn Features</h3>
              <p className="text-sm text-gray-600">
                Discover advanced features to create better videos
              </p>
            </Link>
            <Link
              href="/docs/billing"
              className="p-6 border-2 border-gray-200 rounded-2xl hover:border-gray-900 transition-colors"
            >
              <h3 className="font-semibold text-gray-900 mb-2">Pricing Plans</h3>
              <p className="text-sm text-gray-600">
                Upgrade for more credits and advanced features
              </p>
            </Link>
          </div>
        </div>
      </div>
    </DocsLayout>
  )
}
