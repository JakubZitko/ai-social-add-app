import DocsLayout from '@/components/layout/DocsLayout'

export default function APIPage() {
  return (
    <DocsLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            API Documentation
          </h1>
          <p className="text-xl text-gray-600">
            Integrate VideoAI into your applications with our REST API
          </p>
        </div>

        <div className="border-t border-gray-200 pt-8 space-y-8">
          {/* Authentication */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication</h2>
            <p className="text-gray-600 mb-4">
              All API requests require authentication using an API key. Include your API key in the Authorization header:
            </p>
            <div className="bg-gray-900 text-white rounded-xl p-6 font-mono text-sm">
              <div className="text-gray-400 mb-2">// Request Headers</div>
              <div>Authorization: Bearer YOUR_API_KEY</div>
              <div>Content-Type: application/json</div>
            </div>
            <div className="mt-4 bg-gray-50 border-2 border-gray-200 rounded-xl p-4">
              <p className="text-sm text-gray-700">
                <strong>Note:</strong> You can generate API keys from your account settings page. Keep your API keys secure and never share them publicly.
              </p>
            </div>
          </section>

          {/* Base URL */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Base URL</h2>
            <div className="bg-gray-900 text-white rounded-xl p-6 font-mono text-sm">
              https://api.videoai.com/v1
            </div>
          </section>

          {/* Endpoints */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Endpoints</h2>

            {/* Generate Video */}
            <div className="border-2 border-gray-200 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-gray-900 text-white rounded-full text-sm font-mono">POST</span>
                <code className="text-gray-900 font-mono">/video/generate</code>
              </div>
              <p className="text-gray-600 mb-4">Generate a new AI video with specified parameters.</p>

              <h4 className="font-semibold text-gray-900 mb-2">Request Body</h4>
              <div className="bg-gray-900 text-white rounded-xl p-6 font-mono text-sm mb-4 overflow-x-auto">
                <pre>{`{
  "avatarId": "avatar_123",
  "voiceId": "voice_456",
  "scriptText": "Your script content here",
  "projectType": "talking_actor",
  "aspectRatio": "9:16",
  "voiceSettings": {
    "speed": 1.0,
    "stability": 0.5,
    "similarity": 0.75,
    "style": 0.0
  }
}`}</pre>
              </div>

              <h4 className="font-semibold text-gray-900 mb-2">Response</h4>
              <div className="bg-gray-900 text-white rounded-xl p-6 font-mono text-sm overflow-x-auto">
                <pre>{`{
  "success": true,
  "projectId": "proj_789",
  "status": "processing",
  "estimatedTime": 180,
  "creditsUsed": 5
}`}</pre>
              </div>
            </div>

            {/* Get Video Status */}
            <div className="border-2 border-gray-200 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-gray-900 text-white rounded-full text-sm font-mono">GET</span>
                <code className="text-gray-900 font-mono">/video/status/:projectId</code>
              </div>
              <p className="text-gray-600 mb-4">Check the status of a video generation project.</p>

              <h4 className="font-semibold text-gray-900 mb-2">Response</h4>
              <div className="bg-gray-900 text-white rounded-xl p-6 font-mono text-sm overflow-x-auto">
                <pre>{`{
  "projectId": "proj_789",
  "status": "completed",
  "outputUrl": "https://cdn.videoai.com/videos/proj_789.mp4",
  "thumbnailUrl": "https://cdn.videoai.com/thumbs/proj_789.jpg",
  "duration": 30,
  "createdAt": "2024-01-15T10:30:00Z",
  "completedAt": "2024-01-15T10:33:00Z"
}`}</pre>
              </div>
            </div>

            {/* List Avatars */}
            <div className="border-2 border-gray-200 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-gray-900 text-white rounded-full text-sm font-mono">GET</span>
                <code className="text-gray-900 font-mono">/avatars</code>
              </div>
              <p className="text-gray-600 mb-4">Retrieve a list of available avatars with optional filters.</p>

              <h4 className="font-semibold text-gray-900 mb-2">Query Parameters</h4>
              <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 mb-4">
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><code className="text-gray-900">gender</code> - Filter by gender (male, female, non-binary)</li>
                  <li><code className="text-gray-900">age</code> - Filter by age range (18-25, 26-35, 36-50, 50+)</li>
                  <li><code className="text-gray-900">emotion</code> - Filter by emotion</li>
                  <li><code className="text-gray-900">limit</code> - Number of results (default: 50, max: 100)</li>
                  <li><code className="text-gray-900">offset</code> - Pagination offset</li>
                </ul>
              </div>

              <h4 className="font-semibold text-gray-900 mb-2">Response</h4>
              <div className="bg-gray-900 text-white rounded-xl p-6 font-mono text-sm overflow-x-auto">
                <pre>{`{
  "avatars": [
    {
      "id": "avatar_123",
      "name": "Sarah Williams",
      "gender": "female",
      "age": "26-35",
      "previewUrl": "https://cdn.videoai.com/avatars/123.jpg",
      "previewVideoUrl": "https://cdn.videoai.com/avatars/123.mp4"
    }
  ],
  "total": 300,
  "limit": 50,
  "offset": 0
}`}</pre>
              </div>
            </div>

            {/* List Voices */}
            <div className="border-2 border-gray-200 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-gray-900 text-white rounded-full text-sm font-mono">GET</span>
                <code className="text-gray-900 font-mono">/voices</code>
              </div>
              <p className="text-gray-600 mb-4">Get a list of available AI voices.</p>

              <h4 className="font-semibold text-gray-900 mb-2">Query Parameters</h4>
              <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 mb-4">
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><code className="text-gray-900">language</code> - Filter by language code (en, es, fr, etc.)</li>
                  <li><code className="text-gray-900">gender</code> - Filter by gender</li>
                  <li><code className="text-gray-900">accent</code> - Filter by accent</li>
                </ul>
              </div>

              <h4 className="font-semibold text-gray-900 mb-2">Response</h4>
              <div className="bg-gray-900 text-white rounded-xl p-6 font-mono text-sm overflow-x-auto">
                <pre>{`{
  "voices": [
    {
      "id": "voice_456",
      "name": "Emma - American Female",
      "language": "en-US",
      "gender": "female",
      "previewUrl": "https://cdn.videoai.com/voices/456.mp3"
    }
  ],
  "total": 150
}`}</pre>
              </div>
            </div>

            {/* Get User Credits */}
            <div className="border-2 border-gray-200 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-gray-900 text-white rounded-full text-sm font-mono">GET</span>
                <code className="text-gray-900 font-mono">/user/credits</code>
              </div>
              <p className="text-gray-600 mb-4">Get the current user's credit balance.</p>

              <h4 className="font-semibold text-gray-900 mb-2">Response</h4>
              <div className="bg-gray-900 text-white rounded-xl p-6 font-mono text-sm overflow-x-auto">
                <pre>{`{
  "credits": 125,
  "plan": "creator",
  "monthlyAllowance": 200,
  "renewalDate": "2024-02-01T00:00:00Z"
}`}</pre>
              </div>
            </div>
          </section>

          {/* Status Codes */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Status Codes</h2>
            <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Code</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 font-mono text-sm text-gray-900">200</td>
                    <td className="px-6 py-4 text-sm text-gray-600">Success</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-mono text-sm text-gray-900">201</td>
                    <td className="px-6 py-4 text-sm text-gray-600">Created</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-mono text-sm text-gray-900">400</td>
                    <td className="px-6 py-4 text-sm text-gray-600">Bad Request - Invalid parameters</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-mono text-sm text-gray-900">401</td>
                    <td className="px-6 py-4 text-sm text-gray-600">Unauthorized - Invalid API key</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-mono text-sm text-gray-900">402</td>
                    <td className="px-6 py-4 text-sm text-gray-600">Payment Required - Insufficient credits</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-mono text-sm text-gray-900">404</td>
                    <td className="px-6 py-4 text-sm text-gray-600">Not Found</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-mono text-sm text-gray-900">429</td>
                    <td className="px-6 py-4 text-sm text-gray-600">Rate Limit Exceeded</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-mono text-sm text-gray-900">500</td>
                    <td className="px-6 py-4 text-sm text-gray-600">Internal Server Error</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Rate Limits */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Rate Limits</h2>
            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-2 flex-shrink-0" />
                  <span><strong className="text-gray-900">Free Plan:</strong> 10 requests per minute, 100 requests per hour</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-2 flex-shrink-0" />
                  <span><strong className="text-gray-900">Starter Plan:</strong> 30 requests per minute, 500 requests per hour</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-2 flex-shrink-0" />
                  <span><strong className="text-gray-900">Creator Plan:</strong> 60 requests per minute, 1,000 requests per hour</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-2 flex-shrink-0" />
                  <span><strong className="text-gray-900">Pro Plan:</strong> 120 requests per minute, 2,000 requests per hour</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Error Handling */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Handling</h2>
            <p className="text-gray-600 mb-4">
              All errors return a consistent JSON structure:
            </p>
            <div className="bg-gray-900 text-white rounded-xl p-6 font-mono text-sm overflow-x-auto">
              <pre>{`{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_CREDITS",
    "message": "You don't have enough credits to generate this video",
    "details": {
      "required": 5,
      "available": 2
    }
  }
}`}</pre>
            </div>
          </section>

          {/* Example Code */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Example Code</h2>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">JavaScript / Node.js</h3>
            <div className="bg-gray-900 text-white rounded-xl p-6 font-mono text-sm mb-6 overflow-x-auto">
              <pre>{`const response = await fetch('https://api.videoai.com/v1/video/generate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    avatarId: 'avatar_123',
    voiceId: 'voice_456',
    scriptText: 'Hello! This is my first AI video.',
    projectType: 'talking_actor',
    aspectRatio: '9:16'
  })
});

const data = await response.json();
console.log('Project ID:', data.projectId);`}</pre>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">Python</h3>
            <div className="bg-gray-900 text-white rounded-xl p-6 font-mono text-sm overflow-x-auto">
              <pre>{`import requests

response = requests.post(
    'https://api.videoai.com/v1/video/generate',
    headers={
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
    },
    json={
        'avatarId': 'avatar_123',
        'voiceId': 'voice_456',
        'scriptText': 'Hello! This is my first AI video.',
        'projectType': 'talking_actor',
        'aspectRatio': '9:16'
    }
)

data = response.json()
print(f"Project ID: {data['projectId']}")`}</pre>
            </div>
          </section>
        </div>
      </div>
    </DocsLayout>
  )
}
