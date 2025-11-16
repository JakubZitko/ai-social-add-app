import DocsLayout from '@/components/layout/DocsLayout'
import Link from 'next/link'

export default function VoicesPage() {
  const languages = [
    { name: 'English', variants: ['US', 'UK', 'Australian', 'Canadian', 'Indian'], voices: 25 },
    { name: 'Spanish', variants: ['Spain', 'Latin American', 'Mexican'], voices: 15 },
    { name: 'French', variants: ['France', 'Canadian'], voices: 10 },
    { name: 'German', variants: ['Standard'], voices: 8 },
    { name: 'Italian', variants: ['Standard'], voices: 8 },
    { name: 'Portuguese', variants: ['Brazil', 'Portugal'], voices: 10 },
    { name: 'Chinese', variants: ['Mandarin', 'Cantonese'], voices: 12 },
    { name: 'Japanese', variants: ['Standard'], voices: 8 },
    { name: 'Korean', variants: ['Standard'], voices: 8 },
    { name: 'Arabic', variants: ['Standard', 'Egyptian', 'Gulf'], voices: 10 },
    { name: 'Hindi', variants: ['Standard'], voices: 8 },
    { name: 'Russian', variants: ['Standard'], voices: 6 },
  ]

  return (
    <DocsLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Voice Library
          </h1>
          <p className="text-xl text-gray-600">
            Choose from realistic AI voices in 35+ languages
          </p>
        </div>

        <div className="border-t border-gray-200 pt-8 space-y-8">
          {/* Overview */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
            <p className="text-gray-600 mb-6">
              Our voice library features ultra-realistic AI-generated voices powered by advanced text-to-speech
              technology. Each voice is carefully crafted to sound natural, with proper intonation, pacing,
              and emotion.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">150+</div>
                <div className="text-sm text-gray-600">Unique Voices</div>
              </div>
              <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">35+</div>
                <div className="text-sm text-gray-600">Languages</div>
              </div>
              <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">100+</div>
                <div className="text-sm text-gray-600">Accents</div>
              </div>
            </div>
          </section>

          {/* Available Languages */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Languages</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {languages.map((lang) => (
                <div key={lang.name} className="border-2 border-gray-200 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{lang.name}</h3>
                    <span className="text-sm text-gray-600">{lang.voices} voices</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {lang.variants.map((variant) => (
                      <span key={variant} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                        {variant}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Voice Customization */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Voice Customization</h2>
            <p className="text-gray-600 mb-6">
              Fine-tune every voice to match your exact needs with our advanced customization controls:
            </p>

            <div className="space-y-6">
              <div className="border-2 border-gray-200 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">Speed</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Adjust the speaking rate from 0.5x (slow) to 2x (fast). Default is 1x normal speed.
                    </p>
                    <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>0.5x (Slow)</span>
                        <span>1.0x (Normal)</span>
                        <span>2.0x (Fast)</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div className="h-2 bg-gray-900 rounded-full" style={{width: '50%'}} />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      <strong>Use case:</strong> Slower for educational content, faster for energetic ads
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-2 border-gray-200 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">Stability (0-100%)</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Controls voice consistency. Higher values = more stable and monotone. Lower values = more expressive variation.
                    </p>
                    <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>0% (Variable)</span>
                        <span>50%</span>
                        <span>100% (Stable)</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div className="h-2 bg-gray-900 rounded-full" style={{width: '50%'}} />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      <strong>Recommendation:</strong> 40-60% for most content, 70-80% for professional/corporate
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-2 border-gray-200 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">Similarity Boost (0-100%)</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Enhances similarity to the original voice sample. Higher values make it sound more like the base voice.
                    </p>
                    <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>0%</span>
                        <span>75% (Recommended)</span>
                        <span>100%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div className="h-2 bg-gray-900 rounded-full" style={{width: '75%'}} />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      <strong>Tip:</strong> Keep at 70-80% for best quality and consistency
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-2 border-gray-200 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">Style Exaggeration (0-100%)</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Amplifies the voice's natural style and character. 0% = neutral, 100% = maximum character.
                    </p>
                    <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>0% (Neutral)</span>
                        <span>50%</span>
                        <span>100% (Expressive)</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div className="h-2 bg-gray-900 rounded-full" style={{width: '0%'}} />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      <strong>Use case:</strong> Higher for character voices, lower for professional narration
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Voice Selection Guide */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Voice Selection Guide</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-2 border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">For Product Ads</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-2 flex-shrink-0" />
                    <span>Choose energetic, enthusiastic voices</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-2 flex-shrink-0" />
                    <span>Match voice age to target demographic</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-2 flex-shrink-0" />
                    <span>Use slightly faster speed (1.1-1.2x)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-2 flex-shrink-0" />
                    <span>Lower stability for more emotion (30-40%)</span>
                  </li>
                </ul>
              </div>

              <div className="border-2 border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">For Educational Content</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-2 flex-shrink-0" />
                    <span>Clear, articulate voices</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-2 flex-shrink-0" />
                    <span>Moderate pace (0.9-1x speed)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-2 flex-shrink-0" />
                    <span>Higher stability for consistency (60-70%)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-2 flex-shrink-0" />
                    <span>Professional, trustworthy tone</span>
                  </li>
                </ul>
              </div>

              <div className="border-2 border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">For UGC / Testimonials</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-2 flex-shrink-0" />
                    <span>Authentic, conversational voices</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-2 flex-shrink-0" />
                    <span>Match voice to avatar's appearance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-2 flex-shrink-0" />
                    <span>Natural speaking pace (1x)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-2 flex-shrink-0" />
                    <span>Lower stability for authenticity (30-50%)</span>
                  </li>
                </ul>
              </div>

              <div className="border-2 border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">For Corporate / B2B</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-2 flex-shrink-0" />
                    <span>Professional, authoritative voices</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-2 flex-shrink-0" />
                    <span>Mature age range (35-50+)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-2 flex-shrink-0" />
                    <span>Standard pace (1x)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-2 flex-shrink-0" />
                    <span>High stability (70-80%)</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Audio Upload Option */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Custom Audio Upload</h2>
            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
              <p className="text-gray-600 mb-4">
                Prefer to use your own voice or pre-recorded audio? You can upload custom audio files instead
                of using our AI voices.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">Supported Formats</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• MP3</li>
                    <li>• WAV</li>
                    <li>• M4A</li>
                    <li>• OGG</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">Requirements</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Max file size: 25 MB</li>
                    <li>• Max duration: 5 minutes</li>
                    <li>• Recommended: 44.1kHz, 16-bit</li>
                    <li>• Clear audio, minimal background noise</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Voice Preview */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Voice Preview</h2>
            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
              <p className="text-gray-600 mb-4">
                Every voice in our library includes a preview sample so you can hear it before using it in
                your project. Preview samples are 5-10 seconds long and showcase the voice's natural tone,
                pacing, and character.
              </p>
              <p className="text-sm text-gray-600">
                <strong className="text-gray-900">Pro Tip:</strong> Listen to multiple voices and note your
                top 3 choices. Test each in a short video to see which performs best with your content style.
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="border-t border-gray-200 pt-8">
            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Ready to Find Your Voice?
              </h2>
              <p className="text-gray-600 mb-6">
                Explore our full voice library and create your first AI-powered video.
              </p>
              <Link
                href="/voices"
                className="inline-block px-8 py-4 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
              >
                Browse Voice Library
              </Link>
            </div>
          </section>
        </div>
      </div>
    </DocsLayout>
  )
}
