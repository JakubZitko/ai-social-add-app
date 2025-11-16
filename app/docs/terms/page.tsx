import DocsLayout from '@/components/layout/DocsLayout'

export default function TermsPage() {
  return (
    <DocsLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-600">
            Last updated: January 15, 2024
          </p>
        </div>

        <div className="border-t border-gray-200 pt-8 prose prose-gray max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              By accessing and using VideoAI ("Service"), you accept and agree to be bound by the terms and provisions of this
              agreement. If you do not agree to these terms, please do not use the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-600 mb-3">
              VideoAI provides an AI-powered video generation platform that allows users to:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>• Create videos using AI avatars and voices</li>
              <li>• Access a library of 300+ AI avatars</li>
              <li>• Utilize text-to-speech technology in 35+ languages</li>
              <li>• Export videos in various formats and aspect ratios</li>
              <li>• Integrate with social media platforms</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Account Registration</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Account Creation</h3>
            <ul className="space-y-2 text-gray-600 mb-4">
              <li>• You must provide accurate and complete information</li>
              <li>• You must be at least 13 years of age</li>
              <li>• You are responsible for maintaining account security</li>
              <li>• You must notify us immediately of any unauthorized access</li>
              <li>• One person or entity may not maintain multiple free accounts</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Account Termination</h3>
            <p className="text-gray-600 mb-3">We reserve the right to suspend or terminate your account if:</p>
            <ul className="space-y-2 text-gray-600">
              <li>• You violate these Terms of Service</li>
              <li>• You provide false or misleading information</li>
              <li>• Your use of the Service poses security or legal risks</li>
              <li>• You engage in fraudulent or illegal activities</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Acceptable Use Policy</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Permitted Uses</h3>
            <p className="text-gray-600 mb-3">You may use the Service for:</p>
            <ul className="space-y-2 text-gray-600 mb-4">
              <li>• Creating marketing and advertising content</li>
              <li>• Producing educational videos</li>
              <li>• Generating social media content</li>
              <li>• Creating product demonstrations</li>
              <li>• Any other lawful commercial or personal purpose</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Prohibited Uses</h3>
            <p className="text-gray-600 mb-3">You may NOT use the Service to:</p>
            <ul className="space-y-2 text-gray-600">
              <li>• Create deepfakes or misleading content impersonating real people without consent</li>
              <li>• Generate hateful, discriminatory, or harassing content</li>
              <li>• Produce illegal, fraudulent, or defamatory material</li>
              <li>• Create sexually explicit or adult content</li>
              <li>• Violate intellectual property rights of others</li>
              <li>• Spread misinformation or disinformation</li>
              <li>• Engage in political campaigning or election interference</li>
              <li>• Create content that violates any laws or regulations</li>
              <li>• Abuse, harass, threaten, or intimidate others</li>
              <li>• Reverse engineer or attempt to extract our AI models</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Content Ownership and Rights</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Your Content</h3>
            <p className="text-gray-600 mb-3">
              You retain all rights to the scripts, audio, and input materials you provide. By using our Service, you grant us:
            </p>
            <ul className="space-y-2 text-gray-600 mb-4">
              <li>• A license to process your content for video generation</li>
              <li>• Permission to store your generated videos</li>
              <li>• Rights to use anonymized data for service improvement</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Generated Videos</h3>
            <p className="text-gray-600 mb-3">
              Videos generated using our Service are owned by you, subject to the following:
            </p>
            <ul className="space-y-2 text-gray-600 mb-4">
              <li>• You may use, modify, and distribute generated videos commercially</li>
              <li>• You must comply with our Acceptable Use Policy</li>
              <li>• You are responsible for ensuring your content doesn't infringe third-party rights</li>
              <li>• We retain no rights to your generated videos</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Our IP</h3>
            <p className="text-gray-600">
              The Service, including avatars, voices, software, algorithms, and technology, remains our exclusive property.
              You may not copy, modify, or redistribute these elements.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Pricing and Payment</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Subscription Plans</h3>
            <ul className="space-y-2 text-gray-600 mb-4">
              <li>• Subscription fees are billed monthly or annually</li>
              <li>• All fees are in USD unless otherwise stated</li>
              <li>• Fees are non-refundable except as required by law</li>
              <li>• We may change pricing with 30 days notice</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Credits</h3>
            <ul className="space-y-2 text-gray-600 mb-4">
              <li>• Monthly credits renew on your billing date</li>
              <li>• Unused monthly credits do not roll over</li>
              <li>• One-time credit purchases never expire</li>
              <li>• Credits are non-transferable and non-refundable</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Refunds</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• 7-day money-back guarantee on first subscription</li>
              <li>• Failed video generations don't consume credits</li>
              <li>• No refunds for used credits or completed videos</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Service Availability</h2>
            <ul className="space-y-2 text-gray-600">
              <li>• We strive for 99.9% uptime but don't guarantee uninterrupted access</li>
              <li>• Scheduled maintenance will be announced in advance when possible</li>
              <li>• We are not liable for service interruptions beyond our control</li>
              <li>• Enterprise customers may have specific SLA agreements</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Disclaimers and Limitations of Liability</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Service "As Is"</h3>
            <p className="text-gray-600 mb-4">
              The Service is provided "as is" without warranties of any kind, either express or implied. We do not guarantee
              that the Service will be error-free or that results will meet your expectations.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Limitation of Liability</h3>
            <p className="text-gray-600 mb-3">
              To the maximum extent permitted by law, VideoAI shall not be liable for:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>• Indirect, incidental, or consequential damages</li>
              <li>• Loss of profits, revenue, data, or business opportunities</li>
              <li>• Damages exceeding the amount you paid in the last 12 months</li>
              <li>• Third-party actions based on your use of the Service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Indemnification</h2>
            <p className="text-gray-600">
              You agree to indemnify and hold harmless VideoAI from any claims, damages, losses, and expenses (including
              legal fees) arising from your use of the Service, violation of these Terms, or infringement of any rights of
              another party.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Privacy</h2>
            <p className="text-gray-600">
              Your use of the Service is also governed by our Privacy Policy. Please review our Privacy Policy to understand
              our practices regarding your personal information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. API Usage</h2>
            <p className="text-gray-600 mb-3">If you use our API:</p>
            <ul className="space-y-2 text-gray-600">
              <li>• You must comply with rate limits for your plan</li>
              <li>• You must not abuse or overload our systems</li>
              <li>• API access can be revoked for violations</li>
              <li>• API terms may be updated separately</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Modifications to Terms</h2>
            <p className="text-gray-600">
              We reserve the right to modify these Terms at any time. We will provide notice of material changes via email
              or through the Service. Continued use after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Termination</h2>
            <p className="text-gray-600 mb-3">
              Either party may terminate this agreement:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>• You may cancel your account at any time</li>
              <li>• We may suspend or terminate for Terms violations</li>
              <li>• Upon termination, you lose access but retain generated videos</li>
              <li>• Certain provisions survive termination (ownership, liability, etc.)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Governing Law</h2>
            <p className="text-gray-600">
              These Terms are governed by the laws of the State of California, USA, without regard to conflict of law
              principles. Any disputes shall be resolved in the courts of San Francisco County, California.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Dispute Resolution</h2>
            <p className="text-gray-600 mb-3">
              For disputes arising from these Terms:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>• We encourage informal resolution first by contacting support</li>
              <li>• Binding arbitration may be required for certain disputes</li>
              <li>• You waive the right to participate in class actions</li>
              <li>• Small claims court remains available for qualifying disputes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">16. General Provisions</h2>
            <ul className="space-y-2 text-gray-600">
              <li>• <strong>Entire Agreement:</strong> These Terms constitute the entire agreement between parties</li>
              <li>• <strong>Severability:</strong> Invalid provisions don't affect remaining terms</li>
              <li>• <strong>Waiver:</strong> Failure to enforce a right doesn't waive that right</li>
              <li>• <strong>Assignment:</strong> You may not assign these Terms without our consent</li>
              <li>• <strong>Force Majeure:</strong> We're not liable for delays due to circumstances beyond our control</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">17. Contact Information</h2>
            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
              <p className="text-gray-600 mb-2">
                For questions about these Terms, please contact us:
              </p>
              <p className="text-gray-600 mb-2"><strong>Email:</strong> legal@videoai.com</p>
              <p className="text-gray-600 mb-2"><strong>Address:</strong> VideoAI Inc., 123 AI Street, San Francisco, CA 94102</p>
              <p className="text-gray-600"><strong>Support:</strong> support@videoai.com</p>
            </div>
          </section>
        </div>
      </div>
    </DocsLayout>
  )
}
