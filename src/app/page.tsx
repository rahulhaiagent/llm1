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
          <div className="grid lg:grid-cols-2 gap-12 items-center justify-center mb-20 mt-12">
            {/* Left Side - Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-[2.5em] font-bold text-holistic-deepblue tracking-tight leading-tight font-roobert">
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
              {/* <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
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
              </div> */}
            </div>

            {/* Right Side - Visual */}
            <div className="relative">
              <div className="bg-gradient-to-br from-holistic-cerulean/10 to-holistic-amethyst/10 rounded-2xl p-8 shadow-xl">
                {/* Mock Dashboard Preview */}
                <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[1.5em] font-semibold text-holistic-deepblue font-roobert">Most Secure Models</h3>
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

      {/* About Us Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-holistic-cerulean/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Background decorative elements */}
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-holistic-blurple/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-holistic-amethyst/10 rounded-full blur-2xl"></div>
            
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
              {/* Gradient border effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-holistic-blurple via-holistic-cerulean to-holistic-amethyst opacity-20 blur-sm"></div>
              
              <div className="relative p-8 md:p-12">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  {/* Left side - Content */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-holistic-blurple to-holistic-amethyst rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white text-xl">🎯</span>
                      </div>
                      <h2 className="text-[2em] font-normal text-holistic-deepblue font-roobert">
                        About Us
                      </h2>
                    </div>
                    
                    <div className="w-20 h-0.5 bg-gradient-to-r from-holistic-blurple to-holistic-cerulean rounded-full"></div>
                    
                    <p className="text-lg text-gray-700 leading-relaxed">
                      The LLM Decision Hub is your independent resource for evaluating and selecting large language models, 
                      helping enterprises make informed choices grounded in evidence, not hype.
                    </p>
                    
                    <Link
                      href="/about"
                      className="inline-flex items-center space-x-2 text-holistic-blurple hover:text-holistic-deepblue font-medium transition-colors duration-200 group"
                    >
                      <span>Want to know more?</span>
                      <svg 
                        className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                  
                  {/* Right side - Visual */}
                  <div className="relative">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Feature cards */}
                      <div className="space-y-4">
                        <div className="bg-gradient-to-br from-holistic-blurple/10 to-holistic-blurple/5 p-4 rounded-xl border border-holistic-blurple/20">
                          <div className="w-8 h-8 bg-holistic-blurple rounded-lg flex items-center justify-center mb-3">
                            <span className="text-white text-sm">🛡️</span>
                          </div>
                          <h3 className="font-medium text-holistic-deepblue font-roobert text-sm">Safety Testing</h3>
                          <p className="text-xs text-gray-600 mt-1">Red team evaluations</p>
                        </div>
                        
                        <div className="bg-gradient-to-br from-holistic-cerulean/10 to-holistic-cerulean/5 p-4 rounded-xl border border-holistic-cerulean/20">
                          <div className="w-8 h-8 bg-holistic-cerulean rounded-lg flex items-center justify-center mb-3">
                            <span className="text-white text-sm">📊</span>
                          </div>
                          <h3 className="font-medium text-holistic-deepblue font-roobert text-sm">Benchmarks</h3>
                          <p className="text-xs text-gray-600 mt-1">Performance metrics</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4 pt-8">
                        <div className="bg-gradient-to-br from-holistic-amethyst/10 to-holistic-amethyst/5 p-4 rounded-xl border border-holistic-amethyst/20">
                          <div className="w-8 h-8 bg-holistic-amethyst rounded-lg flex items-center justify-center mb-3">
                            <span className="text-white text-sm">⚖️</span>
                          </div>
                          <h3 className="font-medium text-holistic-deepblue font-roobert text-sm">Independent</h3>
                          <p className="text-xs text-gray-600 mt-1">Unbiased analysis</p>
                        </div>
                        
                        <div className="bg-gradient-to-br from-holistic-deepblue/10 to-holistic-deepblue/5 p-4 rounded-xl border border-holistic-deepblue/20">
                          <div className="w-8 h-8 bg-holistic-deepblue rounded-lg flex items-center justify-center mb-3">
                            <span className="text-white text-sm">🎯</span>
                          </div>
                          <h3 className="font-medium text-holistic-deepblue font-roobert text-sm">Enterprise</h3>
                          <p className="text-xs text-gray-600 mt-1">Business focused</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Floating animation elements */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-holistic-blurple rounded-full opacity-60 animate-bounce"></div>
                    <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-holistic-amethyst rounded-full opacity-40 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}