import DocsLayout from '@/components/layout/DocsLayout'

export default function PrivacyPage() {
  return (
    <DocsLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-600">
            Last updated: January 15, 2024
          </p>
        </div>

        <div className="border-t border-gray-200 pt-8 prose prose-gray max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
            <p className="text-gray-600 leading-relaxed">
              VideoAI ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect,
              use, disclose, and safeguard your information when you use our AI video generation platform and services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Personal Information</h3>
            <p className="text-gray-600 mb-3">We collect personal information that you voluntarily provide to us when you:</p>
            <ul className="space-y-2 text-gray-600 mb-4">
              <li>• Register for an account (name, email address, password)</li>
              <li>• Make a purchase (billing information, payment details)</li>
              <li>• Contact customer support (correspondence, support tickets)</li>
              <li>• Connect social media accounts (OAuth tokens, profile data)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Usage Data</h3>
            <p className="text-gray-600 mb-3">We automatically collect certain information when you use our services:</p>
            <ul className="space-y-2 text-gray-600 mb-4">
              <li>• Device information (IP address, browser type, operating system)</li>
              <li>• Usage analytics (pages visited, features used, time spent)</li>
              <li>• Video generation data (scripts, avatar choices, voice settings)</li>
              <li>• Performance metrics (generation times, success rates)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Content Data</h3>
            <p className="text-gray-600 mb-3">We store content you create using our platform:</p>
            <ul className="space-y-2 text-gray-600 mb-4">
              <li>• Video scripts and text input</li>
              <li>• Generated video files</li>
              <li>• Custom audio uploads</li>
              <li>• Project settings and configurations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
            <p className="text-gray-600 mb-3">We use the information we collect to:</p>
            <ul className="space-y-2 text-gray-600">
              <li>• Provide, maintain, and improve our services</li>
              <li>• Process your transactions and manage your account</li>
              <li>• Generate AI videos based on your input</li>
              <li>• Send you technical notices, updates, and support messages</li>
              <li>• Respond to your comments, questions, and customer service requests</li>
              <li>• Analyze usage patterns to improve user experience</li>
              <li>• Detect, prevent, and address technical issues and fraud</li>
              <li>• Comply with legal obligations and enforce our terms</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Information Sharing and Disclosure</h2>
            <p className="text-gray-600 mb-3">We may share your information in the following circumstances:</p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Service Providers</h3>
            <p className="text-gray-600 mb-3">We work with third-party service providers who perform services on our behalf:</p>
            <ul className="space-y-2 text-gray-600 mb-4">
              <li>• Payment processing (Stripe)</li>
              <li>• Cloud storage (Google Cloud, AWS)</li>
              <li>• Analytics (Google Analytics)</li>
              <li>• Email delivery (SendGrid)</li>
              <li>• Customer support (Intercom)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Legal Requirements</h3>
            <p className="text-gray-600 mb-4">
              We may disclose your information if required to do so by law or in response to valid requests by public authorities
              (e.g., a court or government agency).
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Business Transfers</h3>
            <p className="text-gray-600 mb-4">
              If we are involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
            <p className="text-gray-600 mb-3">
              We implement appropriate technical and organizational measures to protect your personal information:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>• Encryption of data in transit and at rest (TLS/SSL, AES-256)</li>
              <li>• Regular security audits and penetration testing</li>
              <li>• Access controls and authentication mechanisms</li>
              <li>• Secure cloud infrastructure with redundancy</li>
              <li>• Employee training on data protection</li>
              <li>• Incident response procedures</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Retention</h2>
            <p className="text-gray-600 mb-3">We retain your information for as long as necessary to:</p>
            <ul className="space-y-2 text-gray-600 mb-4">
              <li>• Provide our services to you</li>
              <li>• Comply with legal obligations</li>
              <li>• Resolve disputes and enforce agreements</li>
            </ul>
            <p className="text-gray-600">
              Generated videos are stored indefinitely unless you delete them. Account data is retained for 90 days after account deletion.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
            <p className="text-gray-600 mb-3">Depending on your location, you may have the following rights:</p>
            <ul className="space-y-2 text-gray-600 mb-4">
              <li>• <strong>Access:</strong> Request a copy of your personal data</li>
              <li>• <strong>Correction:</strong> Update or correct inaccurate information</li>
              <li>• <strong>Deletion:</strong> Request deletion of your personal data</li>
              <li>• <strong>Portability:</strong> Receive your data in a structured format</li>
              <li>• <strong>Objection:</strong> Object to certain processing activities</li>
              <li>• <strong>Restriction:</strong> Request restriction of processing</li>
              <li>• <strong>Withdrawal:</strong> Withdraw consent at any time</li>
            </ul>
            <p className="text-gray-600">
              To exercise these rights, please contact us at privacy@videoai.com.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Tracking</h2>
            <p className="text-gray-600 mb-3">We use cookies and similar tracking technologies to:</p>
            <ul className="space-y-2 text-gray-600 mb-4">
              <li>• Maintain your session and preferences</li>
              <li>• Analyze site traffic and usage patterns</li>
              <li>• Personalize content and advertisements</li>
              <li>• Improve our services</li>
            </ul>
            <p className="text-gray-600">
              You can control cookies through your browser settings. Note that disabling cookies may affect functionality.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Links</h2>
            <p className="text-gray-600">
              Our service may contain links to third-party websites. We are not responsible for the privacy practices of these sites.
              We encourage you to read their privacy policies before providing any information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
            <p className="text-gray-600">
              Our services are not intended for children under 13 years of age. We do not knowingly collect personal information
              from children under 13. If you become aware that a child has provided us with personal information, please contact us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">International Data Transfers</h2>
            <p className="text-gray-600">
              Your information may be transferred to and processed in countries other than your country of residence. These countries
              may have data protection laws different from those in your country. We ensure appropriate safeguards are in place for
              such transfers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">GDPR Compliance</h2>
            <p className="text-gray-600 mb-3">
              For users in the European Economic Area (EEA), we comply with the General Data Protection Regulation (GDPR):
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>• We process personal data lawfully, fairly, and transparently</li>
              <li>• We collect data only for specified, explicit, and legitimate purposes</li>
              <li>• We minimize data collection to what is necessary</li>
              <li>• We keep personal data accurate and up to date</li>
              <li>• We retain data only as long as necessary</li>
              <li>• We implement appropriate security measures</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">California Privacy Rights</h2>
            <p className="text-gray-600 mb-3">
              California residents have additional rights under the California Consumer Privacy Act (CCPA):
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>• Right to know what personal information is collected</li>
              <li>• Right to know if personal information is sold or disclosed</li>
              <li>• Right to opt-out of the sale of personal information</li>
              <li>• Right to deletion of personal information</li>
              <li>• Right to non-discrimination for exercising CCPA rights</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
            <p className="text-gray-600">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy
              on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
              <p className="text-gray-600 mb-2"><strong>Email:</strong> privacy@videoai.com</p>
              <p className="text-gray-600 mb-2"><strong>Address:</strong> VideoAI Inc., 123 AI Street, San Francisco, CA 94102</p>
              <p className="text-gray-600"><strong>Data Protection Officer:</strong> dpo@videoai.com</p>
            </div>
          </section>
        </div>
      </div>
    </DocsLayout>
  )
}
