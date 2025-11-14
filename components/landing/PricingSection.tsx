import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Check, Sparkles } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: 0,
    credits: 5,
    description: 'Perfect for trying out VideoAI',
    features: [
      '5 free credits',
      'Access to all avatars',
      'Basic voice options',
      'All video formats',
      'Watermarked videos',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Starter',
    price: 29,
    credits: 50,
    description: 'For small businesses and creators',
    features: [
      '50 credits per month',
      '300+ AI avatars',
      'ElevenLabs voices',
      'No watermark',
      'All formats (9:16, 16:9, 1:1)',
      'Priority support',
    ],
    cta: 'Start Creating',
    popular: false,
  },
  {
    name: 'Creator',
    price: 79,
    credits: 150,
    description: 'For agencies and marketers',
    features: [
      '150 credits per month',
      'Everything in Starter',
      'Voice cloning (5 voices)',
      'Custom avatars',
      'Bulk generation',
      'API access',
      'Team collaboration',
      'Priority support',
    ],
    cta: 'Get Creator',
    popular: true,
  },
  {
    name: 'Pro',
    price: 199,
    credits: -1,
    description: 'For enterprises and agencies',
    features: [
      'Unlimited credits',
      'Everything in Creator',
      'Unlimited voice cloning',
      'Unlimited custom avatars',
      'White-label option',
      'Dedicated account manager',
      'SLA guarantee',
      'Custom integrations',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include access to our full avatar library.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-[32px] p-8 border transition-all duration-200 ${
                plan.popular
                  ? 'border-gray-900 shadow-xl scale-105'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="inline-flex items-center gap-1 px-4 py-1.5 bg-gray-900 rounded-full shadow-lg">
                    <Sparkles className="h-3 w-3 text-white" />
                    <span className="text-sm font-bold text-white">Most Popular</span>
                  </div>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <p className="mt-2 text-sm text-gray-600">{plan.description}</p>
                <div className="mt-6">
                  <span className="text-5xl font-bold text-gray-900">${plan.price}</span>
                  {plan.price > 0 && (
                    <span className="text-gray-600 font-medium">/month</span>
                  )}
                </div>
                {plan.credits !== -1 ? (
                  <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 bg-green-50 rounded-full border border-green-200">
                    <span className="text-sm font-bold text-gray-900">{plan.credits} credits/month</span>
                  </div>
                ) : (
                  <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 bg-green-50 rounded-full border border-green-200">
                    <span className="text-sm font-bold text-gray-900">Unlimited credits</span>
                  </div>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-sm text-gray-600 leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href={plan.name === 'Pro' ? '/contact' : '/register'}>
                <button
                  className={`w-full px-6 py-3 rounded-2xl font-semibold transition-all ${
                    plan.popular
                      ? 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg shadow-gray-900/20'
                      : 'bg-white border-2 border-gray-200 text-gray-900 hover:border-gray-300 hover:shadow-lg'
                  }`}
                >
                  {plan.cta}
                </button>
              </Link>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <span className="text-sm text-gray-600">
              All plans include: <span className="font-semibold text-gray-900">HD video quality • Lip-sync technology • Multiple formats • Regular avatar updates</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
