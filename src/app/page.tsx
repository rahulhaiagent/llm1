'use client'

import React from 'react';
import Link from 'next/link';
import Navigation from '../components/Navigation';
import LLMRankings from '../components/LLMRankings';

export default function HomePage() {
  return (
    <div className="flex flex-col bg-white min-h-screen">
      <Navigation />
      
      <main className="flex-grow flex items-center justify-center px-2 sm:px-3 lg:px-4 py-12">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-normal mb-8 text-gray-900 tracking-tight leading-tight">
            Holistic AI LLM Decision Hub
          </h1>
          <p className="text-xl text-gray-700 mb-6 font-medium">
            Helping senior leaders make confident, well-informed decisions about their LLM environment.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed mb-12 max-w-3xl mx-auto">
            Holistic AI provides trusted, independent rankings of large language models across performance, red teaming, jailbreaking safety, and real-world usability. Our insights are grounded in rigorous internal red teaming and jailbreaking tests, alongside publicly available benchmarks. This enables CIOs, CTOs, developers, researchers, and organizations to choose the right model faster and with greater confidence.
          </p>

          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/leaderboard"
              className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <span>View LLM Leaderboard</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            
            <Link
              href="/recommendations"
              className="inline-flex items-center px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Get Recommendations
            </Link>
          </div>

        </div>
      </main>
      
      {/* LLM Rankings Section */}
      <LLMRankings />
    </div>
  );
}