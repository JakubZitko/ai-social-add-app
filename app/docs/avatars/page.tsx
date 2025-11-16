import DocsLayout from '@/components/layout/DocsLayout'
import Link from 'next/link'

export default function AvatarsPage() {
  return (
    <DocsLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Avatar Library
          </h1>
          <p className="text-xl text-gray-600">
            Access 300+ photorealistic AI avatars for your video projects
          </p>
        </div>

        <div className="border-t border-gray-200 pt-8 space-y-8">
          {/* Overview */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
            <p className="text-gray-600 mb-6">
              Our avatar library features over 300 diverse, photorealistic AI avatars representing different
              ages, genders, ethnicities, and professional backgrounds. Each avatar is optimized for natural
              movements, realistic expressions, and authentic lip-sync.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">300+</div>
                <div className="text-sm text-gray-600">Unique Avatars</div>
              </div>
              <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">50+</div>
                <div className="text-sm text-gray-600">Ethnicities</div>
              </div>
              <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">100%</div>
                <div className="text-sm text-gray-600">Photorealistic</div>
              </div>
            </div>
          </section>

          {/* Filter Options */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Filter Options</h2>
            <p className="text-gray-600 mb-6">
              Find the perfect avatar for your project using our advanced filtering system:
            </p>

            <div className="space-y-6">
              <div className="border-2 border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Gender</h3>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-gray-100 rounded-full text-sm">Male</span>
                  <span className="px-4 py-2 bg-gray-100 rounded-full text-sm">Female</span>
                  <span className="px-4 py-2 bg-gray-100 rounded-full text-sm">Non-binary</span>
                </div>
              </div>

              <div className="border-2 border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Age Range</h3>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-gray-100 rounded-full text-sm">18-25 years</span>
                  <span className="px-4 py-2 bg-gray-100 rounded-full text-sm">26-35 years</span>
                  <span className="px-4 py-2 bg-gray-100 rounded-full text-sm">36-50 years</span>
                  <span className="px-4 py-2 bg-gray-100 rounded-full text-sm">50+ years</span>
                </div>
              </div>

              <div className="border-2 border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Emotions</h3>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-gray-100 rounded-full text-sm">Happy</span>
                  <span className="px-4 py-2 bg-gray-100 rounded-full text-sm">Serious</span>
                  <span className="px-4 py-2 bg-gray-100 rounded-full text-sm">Friendly</span>
                  <span className="px-4 py-2 bg-gray-100 rounded-full text-sm">Professional</span>
                  <span className="px-4 py-2 bg-gray-100 rounded-full text-sm">Enthusiastic</span>
                  <span className="px-4 py-2 bg-gray-100 rounded-full text-sm">Calm</span>
                </div>
              </div>

              <div className="border-2 border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Accessories</h3>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-gray-100 rounded-full text-sm">Glasses</span>
                  <span className="px-4 py-2 bg-gray-100 rounded-full text-sm">Hats</span>
                  <span className="px-4 py-2 bg-gray-100 rounded-full text-sm">Jewelry</span>
                  <span className="px-4 py-2 bg-gray-100 rounded-full text-sm">None</span>
                </div>
              </div>

              <div className="border-2 border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Experience Level</h3>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-gray-100 rounded-full text-sm">Beginner-friendly</span>
                  <span className="px-4 py-2 bg-gray-100 rounded-full text-sm">Intermediate</span>
                  <span className="px-4 py-2 bg-gray-100 rounded-full text-sm">Advanced</span>
                </div>
              </div>
            </div>
          </section>

          {/* Avatar Categories */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Avatar Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-2 border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Professional</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Business attire, corporate backgrounds, suitable for B2B content, corporate training,
                  and professional services.
                </p>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Corporate executives</li>
                  <li>• Business professionals</li>
                  <li>• Industry experts</li>
                </ul>
              </div>

              <div className="border-2 border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Casual</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Relaxed attire, home or outdoor settings, perfect for UGC content, testimonials,
                  and social media ads.
                </p>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Everyday people</li>
                  <li>• Lifestyle influencers</li>
                  <li>• Authentic testimonials</li>
                </ul>
              </div>

              <div className="border-2 border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Creative</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Artistic, trendy styles for content creators, artists, and modern brands targeting
                  younger demographics.
                </p>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Social media creators</li>
                  <li>• Artists and designers</li>
                  <li>• Trend-forward individuals</li>
                </ul>
              </div>

              <div className="border-2 border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Educational</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Approachable, trustworthy appearance ideal for teaching, explaining concepts,
                  and educational content.
                </p>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Teachers and instructors</li>
                  <li>• Subject matter experts</li>
                  <li>• Course creators</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Selection Guide */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Avatar Selection Guide</h2>
            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">How to Choose the Right Avatar</h3>
              <div className="space-y-4 text-gray-600">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Match Your Target Audience</h4>
                    <p className="text-sm">
                      Choose an avatar that resembles your ideal customer. Age, gender, and style should
                      align with who you're trying to reach.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Consider Your Brand</h4>
                    <p className="text-sm">
                      Professional brands should use corporate avatars, while lifestyle brands work better
                      with casual, relatable avatars.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Emotion Matters</h4>
                    <p className="text-sm">
                      Happy, enthusiastic avatars work for exciting products. Serious, professional avatars
                      suit business solutions.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Preview Before Committing</h4>
                    <p className="text-sm">
                      Watch the avatar preview videos to see their movements, expressions, and overall
                      presence before generating your video.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    5
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Test Different Options</h4>
                    <p className="text-sm">
                      Create multiple versions with different avatars to see which performs best with
                      your audience.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Popular Avatars */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Most Popular Avatars</h2>
            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
              <p className="text-gray-600 mb-4">
                These avatars are frequently used across different industries and content types:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                  <span><strong className="text-gray-900">Professional Female (26-35):</strong> Most versatile for business and UGC content</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                  <span><strong className="text-gray-900">Casual Male (26-35):</strong> Great for product reviews and testimonials</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                  <span><strong className="text-gray-900">Young Female (18-25):</strong> Perfect for social media and trending content</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                  <span><strong className="text-gray-900">Mature Professional (50+):</strong> Ideal for expertise and authority content</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Technical Specs */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Technical Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-2 border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Video Quality</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 1080p HD resolution</li>
                  <li>• 30 FPS smooth animation</li>
                  <li>• Advanced anti-aliasing</li>
                  <li>• Natural motion blur</li>
                </ul>
              </div>

              <div className="border-2 border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Animation Features</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Realistic facial expressions</li>
                  <li>• Natural eye movements</li>
                  <li>• Head and body gestures</li>
                  <li>• Precise lip-sync</li>
                </ul>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="border-t border-gray-200 pt-8">
            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Ready to Explore Avatars?
              </h2>
              <p className="text-gray-600 mb-6">
                Browse our full library and find the perfect avatar for your next video project.
              </p>
              <Link
                href="/dashboard"
                className="inline-block px-8 py-4 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
              >
                Browse Avatar Library
              </Link>
            </div>
          </section>
        </div>
      </div>
    </DocsLayout>
  )
}
