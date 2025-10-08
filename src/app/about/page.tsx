'use client';

import React from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

export default function AboutPage() {
  return (
    <div className="flex flex-col bg-slate-50 min-h-screen">
      <Navigation />
      
      <main className="flex-grow container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="mb-20 text-center">
          <h1 className="text-[2.5em] font-normal text-holistic-deepblue font-roobert tracking-tight leading-tight">
            Select the right LLM for your enterprise
          </h1>
        </div>

        {/* Content Sections */}
        <div className="space-y-16">
          {/* What Is This Section */}
          <section>
                        <h2 className="text-[2em] font-normal mb-6 text-holistic-deepblue font-roobert relative pb-3">
              What Is This
              <div className="absolute bottom-0 left-0 w-16 h-0.5 bg-gradient-to-r from-holistic-blurple to-holistic-cerulean rounded-full"></div>
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              The LLM Decision Hub is your independent resource for evaluating and selecting large language models (LLMs). We compare leading models across performance, safety, coding, mathematical reasoning, jailbreak resistance, and cost, while also surfacing key differences across providers. You&apos;ll find both standardized benchmarks and proprietary red teaming conducted by Holistic AI&apos;s world class testing lab. And if you&apos;d like to test your own model or your own enhancements to one of these base models, you can reach out to run it through the same rigorous evaluation process.
            </p>
          </section>

          {/* Why We Built This Section */}
          <section>
            <h2 className="text-[2em] font-normal mb-6 text-holistic-deepblue font-roobert relative pb-3">
              Why We Built This
              <div className="absolute bottom-0 left-0 w-16 h-0.5 bg-gradient-to-r from-holistic-amethyst to-holistic-blurple rounded-full"></div>
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Enterprises today face a critical challenge: choosing the right LLM for the right use case. Each model has different strengths, trade-offs, and risks, and the pace of change makes it hard to keep up. The Decision Hub helps business and technology leaders make informed choices grounded in evidence, not hype.
            </p>
          </section>

          {/* Who Should Use This Section */}
          <section>
            <h2 className="text-[2em] font-normal mb-6 text-holistic-deepblue font-roobert relative pb-3">
              Who Should Use This
              <div className="absolute bottom-0 left-0 w-16 h-0.5 bg-gradient-to-r from-holistic-cerulean to-holistic-amethyst rounded-full"></div>
            </h2>
                        <div className="space-y-4">
              <div className="border-l-4 border-holistic-blurple bg-holistic-blurple/5 hover:bg-holistic-blurple/10 pl-6 py-4 rounded-r-lg transition-colors duration-75">
                <p className="text-lg text-gray-700">Technical leaders and solution architects deciding which LLM to deploy</p>
              </div>
              <div className="border-l-4 border-holistic-amethyst bg-holistic-amethyst/5 hover:bg-holistic-amethyst/10 pl-6 py-4 rounded-r-lg transition-colors duration-75">
                <p className="text-lg text-gray-700">Governance and risk teams tasked with ensuring safe and reliable adoption</p>
              </div>
              <div className="border-l-4 border-holistic-cerulean bg-holistic-cerulean/5 hover:bg-holistic-cerulean/10 pl-6 py-4 rounded-r-lg transition-colors duration-75">
                <p className="text-lg text-gray-700">Product and innovation leads looking to match LLM capabilities to customer-facing applications</p>
              </div>
            </div>
          </section>

          {/* When Model Choice Matters Section */}
          <section>
            <h2 className="text-[2em] font-normal mb-6 text-holistic-deepblue font-roobert relative pb-3">
              When Model Choice Matters
              <div className="absolute bottom-0 left-0 w-16 h-0.5 bg-gradient-to-r from-holistic-deepblue to-holistic-cerulean rounded-full"></div>
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Different LLMs are suited to different use cases. The Decision Hub makes those distinctions clear. For example:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-holistic-blurple/5 hover:bg-holistic-blurple/10 p-6 rounded-lg transition-colors duration-75">
                <h3 className="text-[1.5em] font-normal text-holistic-deepblue font-roobert mb-3">Customer Chatbots</h3>
                <p className="text-gray-700">Some models excel at conversational tone and responsiveness, making them better fits for customer engagement</p>
              </div>
              <div className="bg-holistic-amethyst/5 hover:bg-holistic-amethyst/10 p-6 rounded-lg transition-colors duration-75">
                <h3 className="text-[1.5em] font-normal text-holistic-deepblue font-roobert mb-3">Code Generation</h3>
                <p className="text-gray-700">Specialized models outperform others when it comes to producing, reviewing, or debugging code</p>
              </div>
              <div className="bg-holistic-cerulean/5 hover:bg-holistic-cerulean/10 p-6 rounded-lg transition-colors duration-75">
                <h3 className="text-[1.5em] font-normal text-holistic-deepblue font-roobert mb-3">Mathematical and Analytical Tasks</h3>
                <p className="text-gray-700">Certain models lead in reasoning accuracy, making them stronger for research, finance, or scientific use cases</p>
              </div>
              <div className="bg-holistic-deepblue/5 hover:bg-holistic-deepblue/10 p-6 rounded-lg transition-colors duration-75">
                <h3 className="text-[1.5em] font-normal text-holistic-deepblue font-roobert mb-3">Sensitive Environments</h3>
                <p className="text-gray-700">Models with stronger jailbreak resistance and safety scores are better suited for regulated industries or high-stakes contexts</p>
              </div>
            </div>
          </section>

          {/* What You'll Find Here Section */}
          <section>
            <h2 className="text-[2em] font-normal mb-6 text-holistic-deepblue font-roobert relative pb-3">
              What You&apos;ll Find Here
              <div className="absolute bottom-0 left-0 w-16 h-0.5 bg-gradient-to-r from-holistic-blurple to-holistic-amethyst rounded-full"></div>
            </h2>
            
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-holistic-blurple/5 hover:bg-holistic-blurple/10 p-6 rounded-lg transition-colors duration-75">
                <h3 className="text-[1.5em] font-normal text-holistic-deepblue font-roobert mb-2">LLM Rankings</h3>
                <p className="text-gray-700">A master list comparing 20+ models across all major dimensions</p>
              </div>
              <div className="bg-holistic-amethyst/5 hover:bg-holistic-amethyst/10 p-6 rounded-lg transition-colors duration-75">
                <h3 className="text-[1.5em] font-normal text-holistic-deepblue font-roobert mb-2">Rankings by Key Priorities</h3>
                <p className="text-gray-700">Tailored views by safety, cost, coding, and mathematical reasoning</p>
              </div>
              <div className="bg-holistic-cerulean/5 hover:bg-holistic-cerulean/10 p-6 rounded-lg transition-colors duration-75">
                <h3 className="text-[1.5em] font-normal text-holistic-deepblue font-roobert mb-2">Compare LLMs</h3>
                <p className="text-gray-700">Side-by-side model comparisons</p>
              </div>
              <div className="bg-holistic-deepblue/5 hover:bg-holistic-deepblue/10 p-6 rounded-lg transition-colors duration-75">
                <h3 className="text-[1.5em] font-normal text-holistic-deepblue font-roobert mb-2">Providers</h3>
                <p className="text-gray-700">Content TBD</p>
              </div>
              <div className="bg-holistic-blurple/5 hover:bg-holistic-blurple/10 p-6 rounded-lg transition-colors duration-75">
                <h3 className="text-[1.5em] font-normal text-holistic-deepblue font-roobert mb-2">Red Teaming</h3>
                <p className="text-gray-700">Proprietary jailbreak and unsafe-response testing by Holistic AI</p>
              </div>
              <div className="bg-holistic-amethyst/5 hover:bg-holistic-amethyst/10 p-6 rounded-lg transition-colors duration-75">
                <h3 className="text-[1.5em] font-normal text-holistic-deepblue font-roobert mb-2">Test Your LLM</h3>
                <p className="text-gray-700">Submit your model for evaluation using the same benchmarks and safety tests</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* CTA Section with Gray Background to match home page */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-[2em] font-normal mb-8 text-holistic-deepblue font-roobert relative pb-3">
              Ready to find the right LLM for your needs?
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-0.5 bg-gradient-to-r from-holistic-cerulean to-holistic-blurple rounded-full"></div>
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/leaderboard" className="inline-flex items-center justify-center px-8 py-3 bg-holistic-blurple hover:bg-holistic-deepblue text-white font-semibold rounded-lg font-roobert transition-colors duration-75">
                View Leaderboard
              </Link>
              <Link href="/compare" className="inline-flex items-center justify-center px-8 py-3 bg-white hover:bg-gray-50 text-holistic-blurple border-2 border-holistic-blurple hover:border-holistic-deepblue font-semibold rounded-lg font-roobert transition-colors duration-75">
                Compare Models
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 