import DocsLayout from '@/components/layout/DocsLayout'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <DocsLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About VideoAI
          </h1>
          <p className="text-xl text-gray-600">
            Making professional video creation accessible to everyone
          </p>
        </div>

        <div className="border-t border-gray-200 pt-8 space-y-8">
          {/* Mission */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              VideoAI was founded with a simple mission: to democratize video content creation. We believe everyone should
              have access to professional-quality video production tools, regardless of budget, technical skills, or resources.
            </p>
            <p className="text-gray-600 leading-relaxed">
              By leveraging cutting-edge AI technology, we've made it possible for individuals, small businesses, and enterprises
              to create engaging video content in minutes—without cameras, actors, or expensive production teams.
            </p>
          </section>

          {/* Story */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-8">
              <p className="text-gray-600 leading-relaxed mb-4">
                VideoAI was born from frustration. Our founders, experienced marketers and content creators, saw how expensive
                and time-consuming traditional video production had become. Creating a single product ad required hiring actors,
                renting equipment, booking studios, and spending days in post-production.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                In 2023, we set out to change this. We assembled a team of AI researchers, video production experts, and
                software engineers to build something revolutionary: a platform that could generate photorealistic video
                content using AI avatars and voices.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Today, VideoAI serves thousands of users worldwide—from solo entrepreneurs to Fortune 500 companies—helping
                them create millions of videos for marketing, education, entertainment, and more.
              </p>
            </div>
          </section>

          {/* Values */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-2 border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Accessibility</h3>
                <p className="text-gray-600 text-sm">
                  We make professional video creation tools available to everyone, regardless of experience level or budget.
                  Our platform is designed to be intuitive and easy to use.
                </p>
              </div>

              <div className="border-2 border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Innovation</h3>
                <p className="text-gray-600 text-sm">
                  We're constantly pushing the boundaries of what's possible with AI technology. Our research team works
                  tirelessly to improve realism, add new features, and enhance user experience.
                </p>
              </div>

              <div className="border-2 border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Ethical AI</h3>
                <p className="text-gray-600 text-sm">
                  We're committed to responsible AI development. We have strict policies against misuse, deepfakes,
                  and harmful content. Our goal is to empower creators, not enable deception.
                </p>
              </div>

              <div className="border-2 border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Success</h3>
                <p className="text-gray-600 text-sm">
                  Your success is our success. We provide world-class support, extensive documentation, and continuous
                  platform improvements based on your feedback.
                </p>
              </div>

              <div className="border-2 border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Transparency</h3>
                <p className="text-gray-600 text-sm">
                  We believe in open communication about our capabilities, limitations, and pricing. We're honest about
                  what our AI can and cannot do.
                </p>
              </div>

              <div className="border-2 border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Diversity & Inclusion</h3>
                <p className="text-gray-600 text-sm">
                  Our avatar library represents people of all backgrounds, ages, and appearances. We believe everyone
                  should see themselves represented in AI-generated content.
                </p>
              </div>
            </div>
          </section>

          {/* Technology */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">The Technology</h2>
            <p className="text-gray-600 mb-6">
              VideoAI is built on state-of-the-art AI models and technologies:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Photorealistic Avatars</h3>
                <p className="text-sm text-gray-600">
                  Our avatars are created using advanced generative AI models trained on millions of images. Each avatar
                  features natural facial movements, realistic expressions, and authentic appearance.
                </p>
              </div>

              <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Neural Text-to-Speech</h3>
                <p className="text-sm text-gray-600">
                  We use cutting-edge neural TTS technology to generate human-like voices in 35+ languages. Our voices
                  capture natural intonation, emotion, and speaking patterns.
                </p>
              </div>

              <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Advanced Lip-Sync</h3>
                <p className="text-sm text-gray-600">
                  Our proprietary lip-sync algorithm ensures perfect audio-visual synchronization across all languages,
                  creating videos that look genuinely authentic.
                </p>
              </div>

              <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Cloud Infrastructure</h3>
                <p className="text-sm text-gray-600">
                  Built on enterprise-grade cloud infrastructure with global CDN delivery, ensuring fast generation times
                  and reliable video delivery worldwide.
                </p>
              </div>
            </div>
          </section>

          {/* Team */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Leadership Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border-2 border-gray-200 rounded-xl p-6 text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-1">Sarah Chen</h3>
                <p className="text-sm text-gray-600 mb-2">CEO & Co-Founder</p>
                <p className="text-xs text-gray-500">
                  Former VP of Product at tech unicorn. Stanford CS.
                </p>
              </div>

              <div className="border-2 border-gray-200 rounded-xl p-6 text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-1">Michael Rodriguez</h3>
                <p className="text-sm text-gray-600 mb-2">CTO & Co-Founder</p>
                <p className="text-xs text-gray-500">
                  AI researcher, 15+ years in machine learning. MIT PhD.
                </p>
              </div>

              <div className="border-2 border-gray-200 rounded-xl p-6 text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-1">Emily Thompson</h3>
                <p className="text-sm text-gray-600 mb-2">Head of Product</p>
                <p className="text-xs text-gray-500">
                  Product leader from Adobe. Expert in creative tools.
                </p>
              </div>
            </div>
          </section>

          {/* Investors */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Backed By Leading Investors</h2>
            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-8">
              <p className="text-gray-600 mb-4">
                VideoAI is proud to be backed by top-tier venture capital firms and angel investors who believe in our mission:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="p-4">
                  <div className="text-lg font-semibold text-gray-900">Sequoia Capital</div>
                </div>
                <div className="p-4">
                  <div className="text-lg font-semibold text-gray-900">Andreessen Horowitz</div>
                </div>
                <div className="p-4">
                  <div className="text-lg font-semibold text-gray-900">Y Combinator</div>
                </div>
                <div className="p-4">
                  <div className="text-lg font-semibold text-gray-900">Index Ventures</div>
                </div>
              </div>
            </div>
          </section>

          {/* Stats */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">By The Numbers</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="border-2 border-gray-200 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">50K+</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
              <div className="border-2 border-gray-200 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">2M+</div>
                <div className="text-sm text-gray-600">Videos Generated</div>
              </div>
              <div className="border-2 border-gray-200 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">35+</div>
                <div className="text-sm text-gray-600">Languages Supported</div>
              </div>
              <div className="border-2 border-gray-200 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">99.9%</div>
                <div className="text-sm text-gray-600">Customer Satisfaction</div>
              </div>
            </div>
          </section>

          {/* Careers */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Join Our Team</h2>
            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-8">
              <p className="text-gray-600 mb-6">
                We're always looking for talented individuals who are passionate about AI, video technology, and making
                creative tools accessible to everyone.
              </p>
              <a
                href="mailto:careers@videoai.com"
                className="inline-block px-8 py-4 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
              >
                View Open Positions
              </a>
            </div>
          </section>

          {/* Contact */}
          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Get In Touch</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border-2 border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">General Inquiries</h3>
                <p className="text-sm text-gray-600 mb-2">hello@videoai.com</p>
              </div>

              <div className="border-2 border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Press & Media</h3>
                <p className="text-sm text-gray-600 mb-2">press@videoai.com</p>
              </div>

              <div className="border-2 border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Partnerships</h3>
                <p className="text-sm text-gray-600 mb-2">partnerships@videoai.com</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </DocsLayout>
  )
}
