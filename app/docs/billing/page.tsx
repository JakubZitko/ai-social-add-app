import DocsLayout from '@/components/layout/DocsLayout'
import Link from 'next/link'

export default function BillingPage() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      credits: 10,
      features: [
        '10 video credits',
        '300+ AI avatars',
        'Basic voices',
        'All aspect ratios',
        'Standard processing',
        'Community support'
      ]
    },
    {
      name: 'Starter',
      price: '$29',
      credits: 50,
      features: [
        '50 video credits/month',
        '300+ AI avatars',
        'All premium voices',
        'All aspect ratios',
        'Priority processing',
        'Email support',
        'API access'
      ]
    },
    {
      name: 'Creator',
      price: '$79',
      credits: 200,
      features: [
        '200 video credits/month',
        '300+ AI avatars',
        'All premium voices',
        'All aspect ratios',
        'Priority processing',
        'Priority support',
        'API access',
        'Batch generation',
        'Social media scheduling'
      ]
    },
    {
      name: 'Pro',
      price: '$199',
      credits: 600,
      features: [
        '600 video credits/month',
        '300+ AI avatars',
        'All premium voices',
        'All aspect ratios',
        'Fastest processing',
        'Priority support',
        'Advanced API access',
        'Batch generation',
        'Social media scheduling',
        'Custom branding',
        'Team collaboration'
      ]
    }
  ]

  return (
    <DocsLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Pricing & Billing
          </h1>
          <p className="text-xl text-gray-600">
            Understand how our credit system and pricing plans work
          </p>
        </div>

        <div className="border-t border-gray-200 pt-8 space-y-8">
          {/* How Credits Work */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How Credits Work</h2>
            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 mb-6">
              <p className="text-gray-600 mb-4">
                VideoAI uses a credit-based system. Each video you generate costs credits based on video length
                and complexity. Credits never expire and roll over month-to-month for paid plans.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Short Videos</h3>
                  <div className="text-2xl font-bold text-gray-900 mb-1">3-5 Credits</div>
                  <p className="text-sm text-gray-600">15-30 seconds</p>
                </div>
                <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Medium Videos</h3>
                  <div className="text-2xl font-bold text-gray-900 mb-1">5-8 Credits</div>
                  <p className="text-sm text-gray-600">30-60 seconds</p>
                </div>
                <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Long Videos</h3>
                  <div className="text-2xl font-bold text-gray-900 mb-1">8-15 Credits</div>
                  <p className="text-sm text-gray-600">60-120 seconds</p>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing Plans */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Pricing Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`border-2 rounded-2xl p-6 ${
                    plan.name === 'Creator'
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200'
                  }`}
                >
                  {plan.name === 'Creator' && (
                    <div className="mb-3">
                      <span className="px-3 py-1 bg-gray-900 text-white text-xs rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    {plan.price !== '$0' && <span className="text-gray-600">/month</span>}
                  </div>
                  <div className="mb-6">
                    <div className="text-2xl font-semibold text-gray-900">{plan.credits}</div>
                    <div className="text-sm text-gray-600">video credits{plan.price !== '$0' && '/month'}</div>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/billing"
                    className={`block w-full text-center px-4 py-3 rounded-full font-medium transition-colors ${
                      plan.name === 'Creator'
                        ? 'bg-gray-900 text-white hover:bg-gray-800'
                        : 'border-2 border-gray-900 text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {plan.name === 'Free' ? 'Get Started' : 'Upgrade'}
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* Additional Credits */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Buy Additional Credits</h2>
            <p className="text-gray-600 mb-6">
              Need more credits? Purchase credit packs that never expire. Perfect for one-time projects or seasonal needs.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border-2 border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Small Pack</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">$19</span>
                </div>
                <div className="text-gray-600 mb-4">20 credits ($0.95/credit)</div>
                <button className="w-full px-4 py-3 border-2 border-gray-900 text-gray-900 rounded-full font-medium hover:bg-gray-50 transition-colors">
                  Purchase
                </button>
              </div>

              <div className="border-2 border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Medium Pack</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">$49</span>
                </div>
                <div className="text-gray-600 mb-4">60 credits ($0.82/credit)</div>
                <button className="w-full px-4 py-3 border-2 border-gray-900 text-gray-900 rounded-full font-medium hover:bg-gray-50 transition-colors">
                  Purchase
                </button>
              </div>

              <div className="border-2 border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Large Pack</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">$99</span>
                </div>
                <div className="text-gray-600 mb-4">150 credits ($0.66/credit)</div>
                <button className="w-full px-4 py-3 border-2 border-gray-900 text-gray-900 rounded-full font-medium hover:bg-gray-50 transition-colors">
                  Purchase
                </button>
              </div>
            </div>
          </section>

          {/* Billing FAQ */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Billing Questions</h2>
            <div className="space-y-4">
              <div className="border-2 border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Do credits expire?</h3>
                <p className="text-gray-600 text-sm">
                  Monthly credits from subscriptions renew each billing cycle and don't roll over. However,
                  credits purchased as one-time packs never expire.
                </p>
              </div>

              <div className="border-2 border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h3>
                <p className="text-gray-600 text-sm">
                  Yes! You can cancel your subscription at any time. You'll continue to have access until
                  the end of your current billing period.
                </p>
              </div>

              <div className="border-2 border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-600 text-sm">
                  We accept all major credit cards (Visa, Mastercard, American Express) through Stripe.
                  Enterprise customers can request invoice billing.
                </p>
              </div>

              <div className="border-2 border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Can I upgrade or downgrade my plan?</h3>
                <p className="text-gray-600 text-sm">
                  Yes! You can change your plan at any time. Upgrades take effect immediately and you're
                  only charged the prorated difference. Downgrades take effect at the next billing cycle.
                </p>
              </div>

              <div className="border-2 border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Do you offer refunds?</h3>
                <p className="text-gray-600 text-sm">
                  We offer a 7-day money-back guarantee on your first subscription payment. One-time credit
                  packs are non-refundable once purchased.
                </p>
              </div>

              <div className="border-2 border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h3>
                <p className="text-gray-600 text-sm">
                  Yes! Every new account receives 10 free credits to try VideoAI. No credit card required
                  to sign up.
                </p>
              </div>

              <div className="border-2 border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Do you offer enterprise pricing?</h3>
                <p className="text-gray-600 text-sm">
                  Yes! We offer custom enterprise plans for teams and agencies. Contact our sales team
                  at enterprise@videoai.com for a custom quote.
                </p>
              </div>

              <div className="border-2 border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">What happens if I run out of credits?</h3>
                <p className="text-gray-600 text-sm">
                  If you run out of monthly credits, you can purchase additional credit packs or upgrade
                  to a higher tier plan. Your account remains active and you keep access to all previously
                  generated videos.
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="border-t border-gray-200 pt-8">
            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Ready to Get Started?
              </h2>
              <p className="text-gray-600 mb-6">
                Choose a plan that works for you and start creating AI-powered videos today.
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  href="/billing"
                  className="px-8 py-4 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
                >
                  View Pricing
                </Link>
                <Link
                  href="/register"
                  className="px-8 py-4 border-2 border-gray-900 text-gray-900 rounded-full font-medium hover:bg-gray-50 transition-colors"
                >
                  Start Free
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </DocsLayout>
  )
}
