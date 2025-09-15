'use client'

import React from 'react';
import Navigation from '../../components/Navigation';
import ApiKeyManager from '../../components/ApiKeyManager';

export default function PlaygroundPage() {
  return (
    <div className="flex flex-col bg-white">
      <Navigation />
      
      <main className="flex-grow mx-auto w-full max-w-[1400px] px-2 sm:px-3 lg:px-4 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-normal mb-6 text-gray-900 tracking-tight leading-tight">
            AI Playground
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Test and compare multiple AI models simultaneously with your own API keys.
          </p>
        </div>

        {/* API Key Management Section */}
        <div className="mb-8">
          <ApiKeyManager />
        </div>

        {/* Coming Soon - Chat Interface */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6">
          <div className="text-center py-12">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-holistic-blurple to-holistic-cerulean rounded-2xl flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-normal text-gray-900 mb-2">
                Multi-Model Chat Interface
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed max-w-md mx-auto">
                Once you&apos;ve added your API keys above, you&apos;ll be able to test and compare responses from multiple AI models in real-time.
              </p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left max-w-2xl mx-auto">
              <h4 className="text-sm font-medium text-blue-900 mb-2">🚧 Next Phase: Chat Interface</h4>
              <p className="text-sm text-blue-700 leading-relaxed">
                Coming next in the playground development:
              </p>
              <ul className="text-sm text-blue-700 mt-2 space-y-1 ml-4">
                <li>• Multi-column chat interface</li>
                <li>• Real-time streaming responses</li>
                <li>• Side-by-side model comparison</li>
                <li>• Response metrics and analysis</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
