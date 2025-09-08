'use client';

import React from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { Mail, Clock, ArrowLeft } from 'lucide-react';
import Navigation from '@/components/Navigation';

export default function ContactPage() {
  return (
    <>
      <Script 
        src="https://js-eu1.hsforms.net/forms/embed/25785988.js" 
        strategy="lazyOnload"
      />
      <div className="flex flex-col bg-white min-h-screen">
        <Navigation />
        
        <main className="flex-grow px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <div className="mb-8">
            <Link 
              href="/" 
              className="inline-flex items-center text-holistic-blurple hover:text-holistic-deepblue transition-colors duration-75 font-roobert"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-16">
            <div className="space-y-4">
              <div className="text-sm font-semibold text-holistic-blurple/70 uppercase tracking-wide font-roobert">Get in Touch</div>
              <h1 className="text-[2.5em] font-bold text-holistic-deepblue font-roobert leading-tight">
                Contact Us
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-holistic-blurple to-holistic-cerulean rounded-full mx-auto"></div>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                Have questions about our LLM rankings or want to test your model? We&apos;d love to hear from you.
              </p>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            
            {/* Left Side - Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-[2em] font-bold text-holistic-deepblue font-roobert">
                  Let&apos;s Talk About Your LLM Needs
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Whether you&apos;re looking to understand our evaluation methodology, want to submit your model for testing, 
                  or need guidance on selecting the right LLM for your enterprise, our team is here to help.
                </p>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-holistic-deepblue font-roobert">Contact Information</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-holistic-blurple/5 to-holistic-cerulean/5 rounded-lg border-l-4 border-holistic-blurple">
                    <div className="w-6 h-6 bg-holistic-blurple rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Mail className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-holistic-deepblue font-roobert">Email</h4>
                      <a href="mailto:Marketing@holisticai.com" className="text-holistic-blurple hover:text-holistic-deepblue transition-colors duration-75">
                        Marketing@holisticai.com
                      </a>
                      <p className="text-sm text-gray-600 mt-1">For general inquiries and partnerships</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-holistic-amethyst/5 to-holistic-blurple/5 rounded-lg border-l-4 border-holistic-amethyst">
                    <div className="w-6 h-6 bg-holistic-amethyst rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Clock className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-holistic-deepblue font-roobert">Response Time</h4>
                      <p className="text-gray-700">We typically respond within 24-48 hours</p>
                      <p className="text-sm text-gray-600 mt-1">Monday - Friday, 9 AM - 6 PM GMT</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* What We Can Help With */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-holistic-deepblue font-roobert">How We Can Help</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { title: "Model Evaluation", desc: "Submit your LLM for testing" },
                    { title: "Enterprise Guidance", desc: "Choose the right model for your use case" },
                    { title: "Methodology Questions", desc: "Learn about our testing process" },
                    { title: "Partnerships", desc: "Explore collaboration opportunities" }
                  ].map((item, index) => (
                    <div key={index} className="bg-white border border-gray-200 hover:border-holistic-blurple/30 p-4 rounded-lg transition-colors duration-75">
                      <h4 className="font-semibold text-holistic-deepblue font-roobert text-sm">{item.title}</h4>
                      <p className="text-xs text-gray-600 mt-1">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="bg-gray-50/50 rounded-2xl p-8 border border-gray-200">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-holistic-deepblue font-roobert mb-2">Send us a Message</h3>
                <p className="text-gray-600">Fill out the form below and we&apos;ll get back to you soon.</p>
              </div>
              
              {/* HubSpot Form Container */}
              <div className="hs-form-frame" data-region="eu1" data-form-id="c1d78116-0b0c-476a-a577-38ae6495ef37" data-portal-id="25785988"></div>
            </div>
          </div>

          {/* Additional CTA Section */}
          <div className="mt-20 text-center">
            <div className="bg-gradient-to-r from-holistic-blurple/5 to-holistic-cerulean/5 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-holistic-deepblue font-roobert mb-4">
                Looking for Something Specific?
              </h2>
              <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                Explore our other resources or check out our comprehensive LLM rankings and evaluations.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/leaderboard"
                  className="inline-flex items-center justify-center px-6 py-3 bg-holistic-blurple hover:bg-holistic-deepblue text-white font-semibold rounded-lg transition-colors duration-75 font-roobert"
                >
                  View LLM Rankings
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white hover:bg-gray-50 text-holistic-blurple border-2 border-holistic-blurple/30 hover:border-holistic-blurple font-semibold rounded-lg transition-colors duration-75 font-roobert"
                >
                  Learn About Our Platform
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      </div>
    </>
  );
}

