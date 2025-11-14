/**
 * Video Template Types
 * Defines all supported video generation templates
 */

export interface VideoTemplate {
  id: string;
  name: string;
  category: 'ugc' | 'ad' | 'product' | 'shorts' | 'affiliate' | 'general';
  description: string;
  platform?: 'facebook' | 'tiktok' | 'instagram' | 'youtube' | 'all';
  aspectRatio: '16:9' | '9:16' | '1:1' | '4:5';
  duration: number; // in seconds
  features: string[];
  scriptTemplate?: string;
  hooks: string[]; // Opening hooks
  ctas: string[]; // Call-to-action templates
  price?: number; // Credits cost
}

/**
 * All available video templates
 */
export const VIDEO_TEMPLATES: VideoTemplate[] = [
  // ==================== UGC TEMPLATES ====================
  {
    id: 'ugc-testimonial',
    name: 'UGC Testimonial',
    category: 'ugc',
    description: 'User-generated style testimonial video',
    aspectRatio: '9:16',
    duration: 30,
    features: ['Natural lighting', 'Casual setting', 'Authentic delivery', 'Product showcase'],
    hooks: [
      "I can't believe I waited so long to try this...",
      "Okay, I need to tell you about this...",
      "This literally changed my life...",
      "I was skeptical at first, but...",
    ],
    ctas: [
      "Link in bio to try it yourself!",
      "Use code SAVE20 for 20% off!",
      "Click the link below!",
      "DM me for the link!",
    ],
    price: 2,
  },
  {
    id: 'ugc-unboxing',
    name: 'UGC Unboxing',
    category: 'ugc',
    description: 'Authentic unboxing experience',
    aspectRatio: '9:16',
    duration: 45,
    features: ['First impressions', 'Product reveal', 'Feature walkthrough'],
    hooks: [
      "Just got this in the mail and...",
      "Unboxing time! Let's see what we got...",
      "This packaging though...",
    ],
    price: 2,
  },

  // ==================== FACEBOOK AD TEMPLATES ====================
  {
    id: 'facebook-product-ad',
    name: 'Facebook Product Ad',
    category: 'ad',
    platform: 'facebook',
    description: 'High-converting Facebook product advertisement',
    aspectRatio: '1:1',
    duration: 30,
    features: ['Attention-grabbing hook', 'Problem-solution flow', 'Clear CTA', 'Mobile-optimized'],
    hooks: [
      "Stop scrolling! Here's why...",
      "Attention! Are you tired of...",
      "Warning: This will change how you...",
    ],
    ctas: [
      "Shop Now - Limited Stock!",
      "Get 50% Off Today Only!",
      "Learn More",
      "Sign Up Free",
    ],
    scriptTemplate: `[Hook] {hook}

[Problem] Are you struggling with {problem}?

[Solution] Introducing {product_name} - the {benefit}.

[Features]
✓ {feature_1}
✓ {feature_2}
✓ {feature_3}

[CTA] {cta}`,
    price: 3,
  },
  {
    id: 'facebook-carousel-ad',
    name: 'Facebook Carousel Ad',
    category: 'ad',
    platform: 'facebook',
    description: 'Multi-product carousel advertisement',
    aspectRatio: '1:1',
    duration: 60,
    features: ['Multiple products', 'Swipeable format', 'Product comparison'],
    price: 4,
  },

  // ==================== TIKTOK AD TEMPLATES ====================
  {
    id: 'tiktok-native-ad',
    name: 'TikTok Native Ad',
    category: 'ad',
    platform: 'tiktok',
    description: 'Viral-style TikTok advertisement',
    aspectRatio: '9:16',
    duration: 15,
    features: ['Trend integration', 'Native feel', 'Fast-paced', 'Music sync'],
    hooks: [
      "POV: You just discovered...",
      "Nobody talks about this...",
      "This is your sign to...",
      "Wait for it...",
    ],
    scriptTemplate: `[Hook - First 3 seconds] {hook}

[Quick Demo] Show {product} in action

[Social Proof] {testimonial}

[CTA] {cta}`,
    price: 2,
  },
  {
    id: 'tiktok-trend-ad',
    name: 'TikTok Trend Ad',
    category: 'ad',
    platform: 'tiktok',
    description: 'Leverages current TikTok trends',
    aspectRatio: '9:16',
    duration: 20,
    features: ['Trending audio', 'Viral format', 'Hashtag integration'],
    price: 3,
  },

  // ==================== PRODUCT VIDEO TEMPLATES ====================
  {
    id: 'product-showcase',
    name: 'Product Showcase',
    category: 'product',
    description: 'Professional product demonstration',
    aspectRatio: '16:9',
    duration: 60,
    features: ['360° view', 'Feature highlights', 'Use cases', 'Specifications'],
    scriptTemplate: `Introducing {product_name}

[Overview] {product_description}

[Key Features]
• {feature_1}
• {feature_2}
• {feature_3}

[How It Works] {explanation}

[Benefits] {benefits}

Available now at {website}`,
    price: 3,
  },
  {
    id: 'product-comparison',
    name: 'Product Comparison',
    category: 'product',
    description: 'Compare products side-by-side',
    aspectRatio: '16:9',
    duration: 45,
    features: ['Side-by-side comparison', 'Pros/cons', 'Winner reveal'],
    price: 3,
  },
  {
    id: 'product-tutorial',
    name: 'Product Tutorial',
    category: 'product',
    description: 'Step-by-step product usage guide',
    aspectRatio: '16:9',
    duration: 90,
    features: ['Step-by-step guide', 'Tips and tricks', 'Common mistakes'],
    price: 4,
  },

  // ==================== SHORTS TEMPLATES ====================
  {
    id: 'shorts-viral',
    name: 'Viral Shorts',
    category: 'shorts',
    description: 'High-engagement short-form content',
    aspectRatio: '9:16',
    duration: 30,
    features: ['Hook in 1 second', 'Fast cuts', 'Pattern interrupt', 'Scroll-stopping'],
    hooks: [
      "Watch till the end...",
      "This is crazy...",
      "You won't believe this...",
      "Quick tip:",
    ],
    price: 2,
  },
  {
    id: 'shorts-educational',
    name: 'Educational Shorts',
    category: 'shorts',
    description: 'Quick educational content',
    aspectRatio: '9:16',
    duration: 45,
    features: ['Clear teaching', 'Step-by-step', 'Actionable tips'],
    price: 2,
  },
  {
    id: 'shorts-behind-scenes',
    name: 'Behind The Scenes',
    category: 'shorts',
    description: 'BTS content for engagement',
    aspectRatio: '9:16',
    duration: 30,
    features: ['Authenticity', 'Process reveal', 'Personal touch'],
    price: 2,
  },

  // ==================== AFFILIATE TEMPLATES ====================
  {
    id: 'affiliate-review',
    name: 'Affiliate Product Review',
    category: 'affiliate',
    description: 'Honest product review with affiliate link',
    aspectRatio: '16:9',
    duration: 120,
    features: ['Honest review', 'Pros and cons', 'Comparison', 'Affiliate disclosure'],
    scriptTemplate: `[Intro] Hey everyone! Today I'm reviewing {product_name}

[Disclaimer] This video contains affiliate links

[First Impressions] {first_impressions}

[Pros]
✓ {pro_1}
✓ {pro_2}
✓ {pro_3}

[Cons]
✗ {con_1}
✗ {con_2}

[Verdict] {verdict}

[CTA] Link in description - use code {code} for {discount}!`,
    price: 3,
  },
  {
    id: 'affiliate-comparison',
    name: 'Affiliate Comparison',
    category: 'affiliate',
    description: 'Compare multiple affiliate products',
    aspectRatio: '16:9',
    duration: 180,
    features: ['Multi-product comparison', 'Rankings', 'Best for scenarios'],
    price: 4,
  },

  // ==================== GENERAL TEMPLATES ====================
  {
    id: 'explainer-video',
    name: 'Explainer Video',
    category: 'general',
    description: 'Explain concepts clearly',
    aspectRatio: '16:9',
    duration: 90,
    features: ['Clear explanations', 'Visual aids', 'Examples'],
    price: 3,
  },
  {
    id: 'announcement-video',
    name: 'Announcement Video',
    category: 'general',
    description: 'Company/product announcements',
    aspectRatio: '16:9',
    duration: 45,
    features: ['Professional tone', 'Key highlights', 'Next steps'],
    price: 2,
  },
  {
    id: 'testimonial-compilation',
    name: 'Testimonial Compilation',
    category: 'general',
    description: 'Multiple customer testimonials',
    aspectRatio: '16:9',
    duration: 60,
    features: ['Multiple voices', 'Social proof', 'Credibility'],
    price: 4,
  },
];

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: VideoTemplate['category']): VideoTemplate[] {
  return VIDEO_TEMPLATES.filter((t) => t.category === category);
}

/**
 * Get templates by platform
 */
export function getTemplatesByPlatform(platform: string): VideoTemplate[] {
  return VIDEO_TEMPLATES.filter((t) => t.platform === platform || t.platform === 'all');
}

/**
 * Get template by ID
 */
export function getTemplateById(id: string): VideoTemplate | undefined {
  return VIDEO_TEMPLATES.find((t) => t.id === id);
}

/**
 * Parse script template with variables
 */
export function parseScriptTemplate(
  template: string,
  variables: Record<string, string>
): string {
  let result = template;

  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`\\{${key}\\}`, 'g');
    result = result.replace(regex, value);
  });

  return result;
}
