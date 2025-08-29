'use client'

import React from 'react';
import Link from 'next/link';
import Navigation from '../components/Navigation';
import LLMRankings from '../components/LLMRankings';

export default function HomePage() {
  return (
    <div className="flex flex-col bg-white min-h-screen">
      <Navigation />
      
      <main className="flex-grow px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section with Left-Right Layout */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Left Side - Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold text-holistic-deepblue tracking-tight leading-tight font-roobert">
                  Holistic AI
                  <span className="block text-holistic-blurple">LLM Decision Hub</span>
          </h1>
                <p className="text-xl text-gray-700 font-medium leading-relaxed">
            Helping senior leaders make confident, well-informed decisions about their LLM environment.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
                  Trusted, independent rankings of large language models across performance, red teaming, jailbreaking safety, and real-world usability.
          </p>
        </div>

              {/* Call to Action */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/leaderboard"
                  className="inline-flex items-center justify-center px-8 py-4 bg-holistic-blurple hover:bg-holistic-deepblue text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 font-roobert"
                >
                  <span>View LLM Leaderboard</span>
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                
                <Link
                  href="/recommendations"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-gray-50 text-holistic-deepblue font-semibold rounded-lg border-2 border-holistic-cerulean hover:border-holistic-blurple transition-colors duration-200 shadow-md hover:shadow-lg font-roobert"
                >
                  Get Recommendations
                </Link>
          </div>

              {/* Key Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-3xl font-bold text-holistic-cerulean font-roobert">20+</div>
                  <div className="text-sm text-gray-600 font-medium font-roboto-condensed">AI Models</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 font-roobert">99.7%</div>
                  <div className="text-sm text-gray-600 font-medium font-roboto-condensed">Top Safety Score</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-holistic-amethyst font-roobert">1M+</div>
                  <div className="text-sm text-gray-600 font-medium font-roboto-condensed">Max Context</div>
                </div>
              </div>
            </div>

            {/* Right Side - Visual */}
            <div className="relative">
              <div className="bg-gradient-to-br from-holistic-cerulean/10 to-holistic-amethyst/10 rounded-2xl p-8 shadow-xl">
                {/* Mock Dashboard Preview */}
                <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-holistic-deepblue font-roobert">Most Secure Models</h3>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  
                  {/* Mock ranking items */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white text-sm font-bold font-roboto-condensed">1</div>
                        <span className="font-medium text-holistic-deepblue font-roobert">Claude 3.7 Sonnet</span>
                      </div>
                      <span className="text-green-600 font-bold font-roboto-condensed">99.7%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-400 rounded-lg flex items-center justify-center text-white text-sm font-bold font-roboto-condensed">2</div>
                        <span className="font-medium text-holistic-deepblue font-roobert">GPT-4.5</span>
                      </div>
                      <span className="text-gray-600 font-bold font-roboto-condensed">99.6%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-400 rounded-lg flex items-center justify-center text-white text-sm font-bold font-roboto-condensed">3</div>
                        <span className="font-medium text-holistic-deepblue font-roobert">Claude Opus 4.1</span>
                      </div>
                      <span className="text-gray-600 font-bold font-roboto-condensed">98.7%</span>
                    </div>
                  </div>
                </div>

                {/* Floating elements for visual interest */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-holistic-blurple rounded-full opacity-20 animate-bounce"></div>
                <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-holistic-amethyst rounded-full opacity-20 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* LLM Rankings Section */}
      <LLMRankings />
    </div>
  );
}