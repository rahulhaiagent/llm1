import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ModelProviders from '../../components/ModelProviders';
import Navigation from '../../components/Navigation';

export default function ProvidersPage() {
  return (
    <div className="flex flex-col bg-gray-100">
      <Navigation />

      <main className="flex-grow">
        <div className="pt-8 pb-16">
          <div className="mx-auto w-full max-w-[1400px] px-2 sm:px-3 lg:px-4">
            {/* Breadcrumb */}
            <div className="mb-6">
              <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Leaderboard
              </Link>
            </div>

            {/* Page Header */}
            <div className="mb-12 text-center max-w-4xl mx-auto">
              <h1 className="text-4xl font-normal mb-6 text-gray-900 tracking-tight leading-tight font-roobert">Provider Performance & Pricing</h1>
              <p className="text-xl text-gray-700 leading-relaxed">
                See which providers support your model, how they perform, and what they cost—so you can choose the right fit for your use case.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 rounded-lg p-2">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-normal text-gray-900 ml-3">Real-time Pricing</h3>
                </div>
                <p className="text-gray-600">
                  Get up-to-date pricing information per million tokens for both input and output across all providers.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 rounded-lg p-2">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-normal text-gray-900 ml-3">Performance Metrics</h3>
                </div>
                <p className="text-gray-600">
                  Compare latency and throughput to find the fastest providers for your specific use case.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-100 rounded-lg p-2">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-normal text-gray-900 ml-3">Easy Comparison</h3>
                </div>
                <p className="text-gray-600">
                  Sort and filter providers by any metric to quickly identify the best options for your needs.
                </p>
              </div>
            </div>

            {/* Main Component */}
            <div className="bg-white rounded-xl shadow-lg">
              <ModelProviders />
            </div>

            {/* Additional Info */}
            <div className="mt-12 bg-white rounded-lg p-8 shadow-sm border">
              <h2 className="text-2xl font-normal text-gray-900 mb-4">How to Use</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-normal text-gray-900 mb-3">Select a Model</h3>
                  <p className="text-gray-600 mb-4">
                    Choose from over 80 different AI models including GPT-4, Claude, Gemini, Llama, and more.
                    Each model shows all available providers with their specific pricing and performance metrics.
                  </p>

                  <h3 className="text-lg font-normal text-gray-900 mb-3">Compare Providers</h3>
                  <p className="text-gray-600">
                    View detailed comparisons including input/output pricing per million tokens,
                    latency in milliseconds, and throughput in tokens per second.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-normal text-gray-900 mb-3">Sort & Filter</h3>
                  <p className="text-gray-600 mb-4">
                    Click on any column header to sort providers by that metric.
                    Find the most cost-effective option, fastest response times, or highest throughput.
                  </p>

                  <h3 className="text-lg font-normal text-gray-900 mb-3">Key Insights</h3>
                  <p className="text-gray-600">
                    The summary cards at the bottom show quick insights including total providers,
                    lowest pricing, best latency, and highest throughput for the selected model.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 