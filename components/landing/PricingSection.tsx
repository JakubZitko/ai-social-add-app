import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Check } from 'lucide-react';

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
    <section id="pricing" className="py-20 sm:py-28 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include access to our full avatar library.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl ${
                plan.popular
                  ? 'border-2 border-blue-600 shadow-xl'
                  : 'border border-gray-200'
              } bg-white p-8`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex rounded-full bg-blue-600 px-4 py-1 text-sm font-semibold text-white">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <p className="mt-2 text-sm text-gray-600">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-5xl font-bold text-gray-900">${plan.price}</span>
                  {plan.price > 0 && (
                    <span className="text-gray-600">/month</span>
                  )}
                </div>
                {plan.credits !== -1 ? (
                  <p className="mt-2 text-sm font-semibold text-blue-600">
                    {plan.credits} credits/month
                  </p>
                ) : (
                  <p className="mt-2 text-sm font-semibold text-blue-600">
                    Unlimited credits
                  </p>
                )}
              </div>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Link href={plan.name === 'Pro' ? '/contact' : '/register'}>
                  <Button
                    variant={plan.popular ? 'primary' : 'outline'}
                    className="w-full"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600">
            All plans include: HD video quality • Lip-sync technology • Multiple formats • Regular avatar updates
          </p>
        </div>
      </div>
    </section>
  );
}
