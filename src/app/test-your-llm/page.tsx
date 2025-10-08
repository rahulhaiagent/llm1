'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import Navigation from '../../components/Navigation';

const TestYourLLMPage: React.FC = () => {
  useEffect(() => {
    // Load HubSpot script only on client side
    const script = document.createElement('script');
    script.src = 'https://js-eu1.hsforms.net/forms/embed/developer/25785988.js';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector('script[src="https://js-eu1.hsforms.net/forms/embed/developer/25785988.js"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return (
    <>
      <div className="flex flex-col bg-slate-50 min-h-screen">
        <Navigation />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Leaderboard
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Content */}
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl font-normal mb-6 text-gray-900 tracking-tight leading-tight">Test Your Enterprise LLM</h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                Comprehensive assessment and benchmarking of your AI language models for safety, performance, and compliance in the Holistic AI Lab.</p>
              </div>

              {/* Why Test Your Enterprise LLM Section */}
              <div>
                <h2 className="text-2xl font-normal text-gray-900 mb-4">Why Test Your LLM?</h2>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700 text-s">
                    Benchmark performance against industry standards for reasoning, mathematics, and coding
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700 text-s">
                    Identify weaknesses and optimization opportunities</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700 text-s">
                    Assess safety and risk exposure</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700 text-s">
                    Check compliance with legal frameworks like the EU AI Act, NIST AI RMF, and more
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature Cards */}
              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-5 border border-blue-100">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Safety First</h3>
                  </div>
                  <p className="text-gray-700 text-sm">
                    Comprehensive safety evaluation and red teaming assessment
                  </p>
                </div>

                <div className="bg-purple-50 rounded-lg p-5 border border-purple-100">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Performance</h3>
                  </div>
                  <p className="text-gray-700 text-sm">
                    Benchmark against industry standards for reasoning and capability
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Settings className="w-4 h-4 text-gray-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Customized Tests</h3>
                  </div>
                  <p className="text-gray-700 text-sm">
                    Tailored to your specific industry use cases and requirements
                  </p>
                </div>

                <div className="bg-yellow-50 rounded-lg p-5 border border-yellow-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-4 h-4 text-yellow-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Enterprise Ready</h3>
                  </div>
                  <p className="text-gray-700 text-sm">
                    Focused on real-world business deployment scenarios
                  </p>
                </div>
              </div> */}
            </div>

            {/* Right Column - HubSpot Form */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              {/* <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Request for Red Teaming Audit</h2>
                <p className="text-gray-600 text-s">
                Use this form to request a red teaming assessment of your AI model.
                </p>
              </div> */}

              {/* HubSpot Form Container */}
              <div className="hs-form-html" data-region="eu1" data-form-id="c1d78116-0b0c-476a-a577-38ae6495ef37" data-portal-id="25785988"></div>

              {/* <p className="text-xs text-gray-500 text-center mt-4 px-2">
                We&apos;d love to hear from you! Please fill out the form and we&apos;ll get back to you as soon as possible.
                </p> */}
            </div>
          </div>
        </div>
      </main>
      </div>
    </>
  );
};

export default TestYourLLMPage;
