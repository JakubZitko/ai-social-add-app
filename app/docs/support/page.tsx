import DocsLayout from '@/components/layout/DocsLayout'
import Link from 'next/link'
import { Mail, MessageCircle, Book, Video } from 'lucide-react'

export default function SupportPage() {
  return (
    <DocsLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Support
          </h1>
          <p className="text-xl text-gray-600">
            Get help from our support team
          </p>
        </div>

        <div className="border-t border-gray-200 pt-8 space-y-8">
          {/* Support Options */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How Can We Help?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-2 border-gray-200 rounded-2xl p-8">
                <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Email Support</h3>
                <p className="text-gray-600 mb-4">
                  Send us an email and we'll get back to you within 24 hours (12 hours for paid plans).
                </p>
                <a
                  href="mailto:support@videoai.com"
                  className="inline-block px-6 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
                >
                  support@videoai.com
                </a>
              </div>

              <div className="border-2 border-gray-200 rounded-2xl p-8">
                <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mb-4">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Live Chat</h3>
                <p className="text-gray-600 mb-4">
                  Chat with our support team in real-time. Available for Creator and Pro plans.
                </p>
                <button className="inline-block px-6 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors">
                  Start Live Chat
                </button>
              </div>

              <div className="border-2 border-gray-200 rounded-2xl p-8">
                <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mb-4">
                  <Book className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Documentation</h3>
                <p className="text-gray-600 mb-4">
                  Browse our comprehensive documentation and guides to find answers to common questions.
                </p>
                <Link
                  href="/docs"
                  className="inline-block px-6 py-3 border-2 border-gray-900 text-gray-900 rounded-full font-medium hover:bg-gray-50 transition-colors"
                >
                  Browse Docs
                </Link>
              </div>

              <div className="border-2 border-gray-200 rounded-2xl p-8">
                <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mb-4">
                  <Video className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Video Tutorials</h3>
                <p className="text-gray-600 mb-4">
                  Watch step-by-step video tutorials to learn how to use VideoAI effectively.
                </p>
                <a
                  href="https://youtube.com/@videoai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 border-2 border-gray-900 text-gray-900 rounded-full font-medium hover:bg-gray-50 transition-colors"
                >
                  Watch Tutorials
                </a>
              </div>
            </div>
          </section>

          {/* Response Times */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Response Times</h2>
            <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Plan</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email Response</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Live Chat</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Priority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">Free</td>
                    <td className="px-6 py-4 text-gray-600">24-48 hours</td>
                    <td className="px-6 py-4 text-gray-600">Not available</td>
                    <td className="px-6 py-4 text-gray-600">Standard</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">Starter</td>
                    <td className="px-6 py-4 text-gray-600">12-24 hours</td>
                    <td className="px-6 py-4 text-gray-600">Not available</td>
                    <td className="px-6 py-4 text-gray-600">Standard</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">Creator</td>
                    <td className="px-6 py-4 text-gray-600">6-12 hours</td>
                    <td className="px-6 py-4 text-gray-600">Available</td>
                    <td className="px-6 py-4 text-gray-600">Priority</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">Pro</td>
                    <td className="px-6 py-4 text-gray-600">2-6 hours</td>
                    <td className="px-6 py-4 text-gray-600">Available</td>
                    <td className="px-6 py-4 text-gray-600">High Priority</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">Enterprise</td>
                    <td className="px-6 py-4 text-gray-600">1-2 hours</td>
                    <td className="px-6 py-4 text-gray-600">Dedicated</td>
                    <td className="px-6 py-4 text-gray-600">Highest Priority</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Common Issues */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Common Issues</h2>
            <div className="space-y-4">
              <div className="border-2 border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Video generation failed</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Check if your script contains prohibited content, ensure audio files are not corrupted, and verify you have sufficient credits.
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Solution:</strong> Review error message in email, modify content, and try regenerating.
                </p>
              </div>

              <div className="border-2 border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Can't see my generated video</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Video may still be processing. Check the status in your projects page or wait for the completion email.
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Solution:</strong> Refresh the projects page or check your email for completion notification.
                </p>
              </div>

              <div className="border-2 border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Credits not showing after purchase</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Payment processing can take a few minutes. Check your billing page for transaction status.
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Solution:</strong> Wait 5-10 minutes and refresh. If issue persists, contact support with transaction ID.
                </p>
              </div>

              <div className="border-2 border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Poor lip-sync quality</h3>
                <p className="text-gray-600 text-sm mb-3">
                  This can happen with very fast speech, unusual punctuation, or extremely long sentences.
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Solution:</strong> Break script into shorter sentences, add proper punctuation, and adjust voice speed.
                </p>
              </div>

              <div className="border-2 border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Can't upload custom audio</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Ensure your file is in MP3, WAV, M4A, or OGG format, under 25MB, and less than 5 minutes long.
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Solution:</strong> Convert your file to a supported format and compress if needed.
                </p>
              </div>
            </div>
          </section>

          {/* Enterprise Support */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Enterprise Support</h2>
            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Need Dedicated Support?</h3>
              <p className="text-gray-600 mb-6">
                Enterprise customers get access to dedicated support channels, custom SLAs, priority bug fixes,
                and a dedicated account manager.
              </p>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                  <span>Dedicated Slack channel</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                  <span>99.9% uptime SLA</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                  <span>1-2 hour response time</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                  <span>Custom onboarding and training</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                  <span>Priority feature requests</span>
                </li>
              </ul>
              <a
                href="mailto:enterprise@videoai.com"
                className="inline-block px-8 py-4 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
              >
                Contact Enterprise Sales
              </a>
            </div>
          </section>

          {/* Contact Form CTA */}
          <section className="border-t border-gray-200 pt-8">
            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Need Immediate Assistance?
              </h2>
              <p className="text-gray-600 mb-6">
                Fill out our contact form and we'll get back to you as soon as possible.
              </p>
              <Link
                href="/docs/contact"
                className="inline-block px-8 py-4 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </section>
        </div>
      </div>
    </DocsLayout>
  )
}
