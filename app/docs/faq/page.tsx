import DocsLayout from '@/components/layout/DocsLayout'

export default function FAQPage() {
  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        {
          q: 'How do I create my first video?',
          a: 'Sign up for a free account, complete the onboarding, choose an avatar, write your script, select a voice, and click generate. Your video will be ready in 2-5 minutes.'
        },
        {
          q: 'Do I need a credit card to try VideoAI?',
          a: 'No! Every new account gets 10 free credits with no credit card required. You can create multiple videos to test the platform before upgrading.'
        },
        {
          q: 'How long does it take to generate a video?',
          a: 'Most videos are ready in 2-5 minutes depending on length and complexity. You\'ll receive a notification when your video is complete.'
        },
        {
          q: 'Can I edit my video after generation?',
          a: 'Currently, videos cannot be edited after generation. However, you can regenerate with different settings or script changes using additional credits.'
        }
      ]
    },
    {
      category: 'Avatars & Voices',
      questions: [
        {
          q: 'How many avatars are available?',
          a: 'We have 300+ photorealistic AI avatars representing diverse ages, genders, ethnicities, and styles. New avatars are added regularly.'
        },
        {
          q: 'Can I create a custom avatar from my photo?',
          a: 'Custom avatar creation is coming soon. Currently, you can choose from our library of 300+ pre-made avatars.'
        },
        {
          q: 'How many languages do you support?',
          a: 'We support 35+ languages including English (multiple accents), Spanish, French, German, Italian, Portuguese, Chinese, Japanese, Korean, Arabic, Hindi, and many more.'
        },
        {
          q: 'Can I use my own voice recording?',
          a: 'Yes! You can upload custom audio files in MP3, WAV, M4A, or OGG format. Max file size is 25MB and max duration is 5 minutes.'
        },
        {
          q: 'Can I clone my voice?',
          a: 'Voice cloning technology is coming soon. You\'ll be able to create a custom AI voice from voice samples.'
        }
      ]
    },
    {
      category: 'Credits & Billing',
      questions: [
        {
          q: 'How does the credit system work?',
          a: 'Each video costs credits based on length: 3-5 credits for 15-30 seconds, 5-8 credits for 30-60 seconds, and 8-15 credits for 60-120 seconds.'
        },
        {
          q: 'Do my credits expire?',
          a: 'Monthly subscription credits renew each billing cycle and don\'t roll over. However, one-time credit packs never expire.'
        },
        {
          q: 'Can I get a refund?',
          a: 'We offer a 7-day money-back guarantee on your first subscription payment. One-time credit packs are non-refundable once purchased.'
        },
        {
          q: 'What happens if I cancel my subscription?',
          a: 'You\'ll continue to have access until the end of your current billing period. Previously generated videos remain accessible in your account.'
        },
        {
          q: 'Can I upgrade or downgrade my plan?',
          a: 'Yes! Upgrades take effect immediately with prorated billing. Downgrades take effect at the next billing cycle.'
        }
      ]
    },
    {
      category: 'Video Creation',
      questions: [
        {
          q: 'What video formats can I export?',
          a: 'All videos are exported as MP4 files in 1080p HD quality. You can choose between 9:16 (vertical), 16:9 (horizontal), or 1:1 (square) aspect ratios.'
        },
        {
          q: 'What\'s the maximum video length?',
          a: 'You can create videos up to 2 minutes (120 seconds) long, with scripts up to 1,500 characters.'
        },
        {
          q: 'Can I add background music?',
          a: 'Background music and sound effects are coming soon. Currently, videos include only the avatar speech and ambient sound.'
        },
        {
          q: 'Can I add text or subtitles?',
          a: 'Auto-generated subtitles are coming soon. For now, you can add text and subtitles using external video editing software.'
        },
        {
          q: 'What platforms are the videos optimized for?',
          a: 'Our videos work on all platforms: TikTok, Instagram (Reels & Feed), Facebook, YouTube (regular & Shorts), LinkedIn, Twitter, and more.'
        }
      ]
    },
    {
      category: 'Quality & Performance',
      questions: [
        {
          q: 'How realistic are the AI avatars?',
          a: 'Our avatars use advanced AI technology for photorealistic appearance, natural movements, precise lip-sync, and authentic facial expressions.'
        },
        {
          q: 'Is the lip-sync accurate?',
          a: 'Yes! We use industry-leading lip-sync technology that automatically syncs the avatar\'s mouth movements with the audio in all supported languages.'
        },
        {
          q: 'Why did my video generation fail?',
          a: 'Common reasons: script contains prohibited content, audio file is corrupted, server capacity issues. Check your email for specific error details or contact support.'
        },
        {
          q: 'Can I regenerate a failed video?',
          a: 'Yes! Failed generations don\'t consume credits. You can modify your settings and regenerate at no additional cost.'
        }
      ]
    },
    {
      category: 'Features & Tools',
      questions: [
        {
          q: 'What is batch generation?',
          a: 'Available on Creator and Pro plans, batch generation lets you create multiple videos at once using CSV upload or templates for efficiency.'
        },
        {
          q: 'Can I schedule posts to social media?',
          a: 'Yes! Creator and Pro plans include social media scheduling. Connect your accounts and schedule posts directly from VideoAI.'
        },
        {
          q: 'Do you have an API?',
          a: 'Yes! Starter plans and above include API access. View our API documentation for integration details.'
        },
        {
          q: 'Can multiple team members use one account?',
          a: 'Team collaboration is available on Pro plans. You can add team members, share projects, and manage permissions.'
        },
        {
          q: 'Do you offer white-label options?',
          a: 'Custom branding and white-label options are available on Pro plans. Contact enterprise@videoai.com for details.'
        }
      ]
    },
    {
      category: 'Technical',
      questions: [
        {
          q: 'What browsers are supported?',
          a: 'VideoAI works on all modern browsers: Chrome, Firefox, Safari, Edge, and Brave. We recommend using the latest version for best performance.'
        },
        {
          q: 'Can I use VideoAI on mobile?',
          a: 'Yes! Our web app is fully responsive and works on mobile devices. Native iOS and Android apps are coming soon.'
        },
        {
          q: 'Do you store my videos?',
          a: 'Yes, all generated videos are stored securely in your account. You can download or delete them at any time.'
        },
        {
          q: 'Is my data secure?',
          a: 'Absolutely. We use enterprise-grade encryption, secure cloud storage, and comply with GDPR and other privacy regulations.'
        },
        {
          q: 'Can I download my videos?',
          a: 'Yes! You can download any completed video in MP4 format. Downloads are unlimited for all plans.'
        }
      ]
    },
    {
      category: 'Business & Enterprise',
      questions: [
        {
          q: 'Do you offer enterprise plans?',
          a: 'Yes! We offer custom enterprise solutions with dedicated support, SLAs, custom integrations, and volume discounts. Contact enterprise@videoai.com.'
        },
        {
          q: 'Can I get invoicing instead of credit card billing?',
          a: 'Yes, enterprise customers can request invoice billing. Contact our sales team to set this up.'
        },
        {
          q: 'Do you offer training for teams?',
          a: 'Yes! Enterprise plans include onboarding sessions and training for your team. We also have video tutorials and documentation.'
        },
        {
          q: 'What SLAs do you provide?',
          a: 'Enterprise plans include 99.9% uptime SLA, dedicated support channels, and guaranteed response times. Contact sales for details.'
        }
      ]
    }
  ]

  return (
    <DocsLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600">
            Find answers to common questions about VideoAI
          </p>
        </div>

        <div className="border-t border-gray-200 pt-8 space-y-12">
          {faqs.map((category, idx) => (
            <section key={idx}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {category.category}
              </h2>
              <div className="space-y-4">
                {category.questions.map((faq, qIdx) => (
                  <div key={qIdx} className="border-2 border-gray-200 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-3 text-lg">
                      {faq.q}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Still Have Questions */}
        <div className="border-t border-gray-200 pt-8">
          <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Still Have Questions?
            </h2>
            <p className="text-gray-600 mb-6">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="/docs/support"
                className="px-8 py-4 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
              >
                Contact Support
              </a>
              <a
                href="/docs/contact"
                className="px-8 py-4 border-2 border-gray-900 text-gray-900 rounded-full font-medium hover:bg-gray-50 transition-colors"
              >
                Send Message
              </a>
            </div>
          </div>
        </div>
      </div>
    </DocsLayout>
  )
}
