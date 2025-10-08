'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail } from 'lucide-react';
import Navigation from '@/components/Navigation';

export default function ContactPage() {
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
                Back to Home
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column - Content */}
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl font-normal mb-6 text-gray-900 tracking-tight leading-tight">Contact Us</h1>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    If you want to contact us for any inquiry or any issue, just fill the form and we&apos;ll get back to you as soon as possible.
                  </p>
                </div>

                {/* Contact Information */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-normal text-gray-900 mb-4">Get in Touch</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Mail className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Email Us</h3>
                        <a href="mailto:Marketing@holisticai.com" className="text-blue-600 hover:text-blue-800 transition-colors">
                          Marketing@holisticai.com
                        </a>
                        <p className="text-sm text-gray-600 mt-1">For general inquiries and support</p>
                      </div>
                    </div>

                  
                  </div>
                </div>

                {/* What We Can Help With */}
                <div className="space-y-4">
                  <h2 className="text-2xl font-normal text-gray-900">How We Can Help</h2>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 text-sm">LLM Evaluation & Testing</h3>
                      <p className="text-xs text-gray-600 mt-1">Submit your model for comprehensive assessment</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 text-sm">Enterprise Guidance</h3>
                      <p className="text-xs text-gray-600 mt-1">Choose the right LLM for your business needs</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 text-sm">Safety & Compliance</h3>
                      <p className="text-xs text-gray-600 mt-1">Understand our methodology and safety measures</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 text-sm">Partnership Opportunities</h3>
                      <p className="text-xs text-gray-600 mt-1">Explore collaboration and integration options</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - HubSpot Form */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-normal text-gray-900 mb-2">Send us a Message</h2>
                  <p className="text-gray-600 text-s">
                    Fill out the form below and we&apos;ll get back to you soon.
                  </p>
                </div>

                {/* HubSpot Form Container */}
                <div className="hs-form-html" data-region="eu1" data-form-id="c1d78116-0b0c-476a-a577-38ae6495ef37" data-portal-id="25785988"></div>

              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
