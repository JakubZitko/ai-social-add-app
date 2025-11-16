'use client'

import DocsLayout from '@/components/layout/DocsLayout'
import { useState } from 'react'
import { Mail, MapPin, Phone } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send to an API
    console.log('Form submitted:', formData)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 5000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <DocsLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600">
            Get in touch with our team
          </p>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="border-2 border-gray-200 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>

                {submitted && (
                  <div className="mb-6 p-4 bg-gray-900 text-white rounded-xl">
                    <p className="font-medium">Thank you for your message!</p>
                    <p className="text-sm mt-1">We'll get back to you within 24 hours.</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:outline-none transition-colors"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:outline-none transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-900 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:outline-none transition-colors"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="billing">Billing Question</option>
                      <option value="feature">Feature Request</option>
                      <option value="partnership">Partnership Opportunity</option>
                      <option value="press">Press & Media</option>
                      <option value="enterprise">Enterprise Sales</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:outline-none transition-colors resize-none"
                      placeholder="Tell us how we can help..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full px-6 py-4 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="border-2 border-gray-200 rounded-2xl p-6">
                <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Our team typically responds within 24 hours
                </p>
                <a href="mailto:support@videoai.com" className="text-sm text-gray-900 font-medium hover:underline">
                  support@videoai.com
                </a>
              </div>

              <div className="border-2 border-gray-200 rounded-2xl p-6">
                <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Office</h3>
                <p className="text-sm text-gray-600">
                  123 AI Street<br />
                  San Francisco, CA 94102<br />
                  United States
                </p>
              </div>

              <div className="border-2 border-gray-200 rounded-2xl p-6">
                <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mb-4">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Enterprise customers only
                </p>
                <a href="tel:+14155551234" className="text-sm text-gray-900 font-medium hover:underline">
                  +1 (415) 555-1234
                </a>
              </div>

              {/* Quick Links */}
              <div className="border-2 border-gray-200 rounded-2xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
                <div className="space-y-3">
                  <a href="/docs/support" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    → Support Center
                  </a>
                  <a href="/docs/faq" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    → FAQ
                  </a>
                  <a href="/docs/getting-started" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    → Getting Started
                  </a>
                  <a href="/docs/api" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    → API Documentation
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Department Contacts */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Department Contacts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="border-2 border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Sales</h3>
                <p className="text-sm text-gray-600 mb-2">Enterprise & partnerships</p>
                <a href="mailto:sales@videoai.com" className="text-sm text-gray-900 hover:underline">
                  sales@videoai.com
                </a>
              </div>

              <div className="border-2 border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Support</h3>
                <p className="text-sm text-gray-600 mb-2">Technical assistance</p>
                <a href="mailto:support@videoai.com" className="text-sm text-gray-900 hover:underline">
                  support@videoai.com
                </a>
              </div>

              <div className="border-2 border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Press</h3>
                <p className="text-sm text-gray-600 mb-2">Media inquiries</p>
                <a href="mailto:press@videoai.com" className="text-sm text-gray-900 hover:underline">
                  press@videoai.com
                </a>
              </div>

              <div className="border-2 border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Legal</h3>
                <p className="text-sm text-gray-600 mb-2">Legal & compliance</p>
                <a href="mailto:legal@videoai.com" className="text-sm text-gray-900 hover:underline">
                  legal@videoai.com
                </a>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Follow Us</h2>
            <div className="flex gap-4">
              <a
                href="https://twitter.com/videoai"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border-2 border-gray-900 text-gray-900 rounded-full font-medium hover:bg-gray-50 transition-colors"
              >
                Twitter
              </a>
              <a
                href="https://linkedin.com/company/videoai"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border-2 border-gray-900 text-gray-900 rounded-full font-medium hover:bg-gray-50 transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="https://youtube.com/@videoai"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border-2 border-gray-900 text-gray-900 rounded-full font-medium hover:bg-gray-50 transition-colors"
              >
                YouTube
              </a>
              <a
                href="https://github.com/videoai"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border-2 border-gray-900 text-gray-900 rounded-full font-medium hover:bg-gray-50 transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </DocsLayout>
  )
}
