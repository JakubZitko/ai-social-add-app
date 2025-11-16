/**
 * AI Script Enhancement
 * Uses GPT-4/Claude to improve marketing scripts
 */

export interface ScriptEnhanceConfig {
  script: string;
  contentType: 'ugc' | 'ad' | 'educational' | 'testimonial' | 'product-demo';
  platform?: 'tiktok' | 'instagram' | 'youtube' | 'facebook';
  tone?: 'casual' | 'professional' | 'enthusiastic' | 'friendly';
  targetLength?: number; // in words
  includeHook?: boolean;
  includeCTA?: boolean;
}

export interface EnhancedScript {
  originalScript: string;
  enhancedScript: string;
  improvements: string[];
  hook?: string;
  cta?: string;
  estimatedDuration: number; // in seconds
}

/**
 * Enhance script using AI
 */
export async function enhanceScript(config: ScriptEnhanceConfig): Promise<EnhancedScript> {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

  // Prefer Claude for creative writing, fallback to GPT-4
  if (ANTHROPIC_API_KEY) {
    return enhanceWithClaude(config);
  } else if (OPENAI_API_KEY) {
    return enhanceWithGPT4(config);
  } else {
    // Return mock enhancement for development
    return mockEnhancement(config);
  }
}

/**
 * Enhance with Claude (Anthropic)
 */
async function enhanceWithClaude(config: ScriptEnhanceConfig): Promise<EnhancedScript> {
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY!;

  const systemPrompt = buildSystemPrompt(config);
  const userPrompt = buildUserPrompt(config);

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`Claude API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const result = parseAIResponse(data.content[0].text, config.script);

    return result;
  } catch (error: any) {
    console.error('Claude enhancement error:', error);
    throw error;
  }
}

/**
 * Enhance with GPT-4 (OpenAI)
 */
async function enhanceWithGPT4(config: ScriptEnhanceConfig): Promise<EnhancedScript> {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

  const systemPrompt = buildSystemPrompt(config);
  const userPrompt = buildUserPrompt(config);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const result = parseAIResponse(data.choices[0].message.content, config.script);

    return result;
  } catch (error: any) {
    console.error('GPT-4 enhancement error:', error);
    throw error;
  }
}

/**
 * Build system prompt based on config
 */
function buildSystemPrompt(config: ScriptEnhanceConfig): string {
  return `You are an expert copywriter specializing in ${config.contentType} video scripts for ${config.platform || 'social media'}.

Your goal is to enhance video scripts to maximize engagement, retention, and conversions.

Key principles:
- Hook viewers in the first 3 seconds
- Use conversational, authentic language
- Include pattern interrupts to maintain attention
- Create emotional connection
- End with clear, compelling CTA
- Keep sentences short and punchy
- Use power words and curiosity gaps
- Match ${config.tone || 'casual'} tone

Format your response as JSON with this structure:
{
  "enhancedScript": "the improved script",
  "improvements": ["list of specific improvements made"],
  "hook": "the attention-grabbing opening line",
  "cta": "the call-to-action"
}`;
}

/**
 * Build user prompt
 */
function buildUserPrompt(config: ScriptEnhanceConfig): string {
  let prompt = `Please enhance this ${config.contentType} video script:\n\n"${config.script}"\n\n`;

  if (config.targetLength) {
    prompt += `Target length: ${config.targetLength} words\n`;
  }

  if (config.includeHook) {
    prompt += `Include a powerful hook for the first 3 seconds.\n`;
  }

  if (config.includeCTA) {
    prompt += `Include a clear call-to-action.\n`;
  }

  prompt += `\nOptimize for ${config.platform || 'social media'} with a ${config.tone || 'casual'} tone.`;

  return prompt;
}

/**
 * Parse AI response
 */
function parseAIResponse(response: string, originalScript: string): EnhancedScript {
  try {
    // Try to extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);

      const wordCount = parsed.enhancedScript.split(/\s+/).length;
      const estimatedDuration = Math.ceil((wordCount / 150) * 60); // 150 words per minute

      return {
        originalScript,
        enhancedScript: parsed.enhancedScript,
        improvements: parsed.improvements || [],
        hook: parsed.hook,
        cta: parsed.cta,
        estimatedDuration,
      };
    }
  } catch (error) {
    console.error('Failed to parse AI response:', error);
  }

  // Fallback: treat entire response as enhanced script
  const wordCount = response.split(/\s+/).length;
  return {
    originalScript,
    enhancedScript: response,
    improvements: ['Script enhanced with AI'],
    estimatedDuration: Math.ceil((wordCount / 150) * 60),
  };
}

/**
 * Mock enhancement for development
 */
function mockEnhancement(config: ScriptEnhanceConfig): EnhancedScript {
  console.warn('⚠️ Using mock script enhancement (no API key configured)');

  const hook = config.includeHook
    ? '🚨 WAIT! Before you scroll, you NEED to see this...'
    : undefined;

  const cta = config.includeCTA
    ? 'Click the link in bio to get started TODAY!'
    : undefined;

  const enhanced = [
    hook,
    config.script,
    cta,
  ]
    .filter(Boolean)
    .join(' ');

  const wordCount = enhanced.split(/\s+/).length;

  return {
    originalScript: config.script,
    enhancedScript: enhanced,
    improvements: [
      'Added attention-grabbing hook',
      'Improved sentence flow',
      'Added compelling CTA',
    ],
    hook,
    cta,
    estimatedDuration: Math.ceil((wordCount / 150) * 60),
  };
}

/**
 * Generate hooks for different platforms
 */
export async function generateHooks(topic: string, count: number = 5): Promise<string[]> {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  if (!OPENAI_API_KEY) {
    // Return mock hooks
    return [
      `🚨 STOP SCROLLING! This ${topic} hack is insane...`,
      `Nobody talks about this ${topic} secret...`,
      `I wish I knew this ${topic} trick sooner...`,
      `The truth about ${topic} that nobody tells you...`,
      `This ${topic} method changed everything for me...`,
    ];
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'user',
            content: `Generate ${count} attention-grabbing hooks for a video about "${topic}". Each hook should be under 10 words and create curiosity. Return as a JSON array of strings.`,
          },
        ],
        temperature: 0.9,
      }),
    });

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Extract JSON array
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return content.split('\n').filter((line: string) => line.trim());
  } catch (error) {
    console.error('Hook generation error:', error);
    return [];
  }
}

/**
 * Generate CTAs for different purposes
 */
export async function generateCTAs(purpose: 'sales' | 'signup' | 'engagement' | 'download', count: number = 5): Promise<string[]> {
  const mockCTAs = {
    sales: [
      'Click the link in bio to buy now!',
      'Limited time offer - Get yours today!',
      'Don\'t miss out - Shop now!',
    ],
    signup: [
      'Sign up for free at the link in bio!',
      'Create your account today - it\'s free!',
      'Join thousands of users - sign up now!',
    ],
    engagement: [
      'Comment below if you agree!',
      'Follow for more tips like this!',
      'Share this with someone who needs to see it!',
    ],
    download: [
      'Download the app using the link below!',
      'Get the free guide in my bio!',
      'Tap the link to download now!',
    ],
  };

  return mockCTAs[purpose] || [];
}
