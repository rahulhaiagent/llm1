'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  BarChart3, 
  LineChart, 
  Calculator, 
  Building2, 
  Code, 
  FileText, 
  Database, 
  ArrowRight,
  CheckCircle2,
  Target
} from 'lucide-react';
import Navigation from '@/components/Navigation';

export default function AboutPage() {
  return (
    <div className="flex flex-col bg-slate-50 min-h-screen">
      <Navigation />
      
      <main className="flex-grow container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 tracking-tight">
            The Holistic AI LLM Leaderboard
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Helping senior leaders make confident, well-informed decisions about their LLM environment.
          </p>
        </div>

        {/* High Stakes Decision Section */}
        <div className="mb-20">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-8 md:p-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
                Choosing the Right LLM Is a High-Stakes Decision
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-4xl">
                Selecting a large language model for your organization is more than just a technical choice, it&apos;s a strategic one. 
                The model you choose will shape your AI capabilities, security posture, cost structure, and user experience. 
                And once integrated, it&apos;s not easily or cheaply replaced. That&apos;s why this decision demands rigor, foresight, and the right data.
              </p>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100">
                <h3 className="text-xl font-semibold mb-4 text-blue-800">
                  Compare LLMs with Confidence
                </h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Holistic AI provides trusted, independent rankings of large language models across performance, red teaming, jailbreaking safety, and real-world usability. 
                  Our insights are grounded in rigorous internal red teaming and jailbreaking tests, alongside publicly available benchmarks. 
                  This enables CIOs, CTOs, developers, researchers, and organizations to choose the right model faster and with greater confidence.
                </p>
                
                <h4 className="font-semibold text-blue-700 mb-4">With this tool, you can:</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {[
                    { text: "Compare models on safety, cost, and performance", icon: <BarChart3 className="h-5 w-5 text-blue-600" /> },
                    { text: "Identify the best LLMs for your specific use cases", icon: <Target className="h-5 w-5 text-green-600" /> },
                    { text: "Validate whether your current model is the right fit", icon: <CheckCircle2 className="h-5 w-5 text-purple-600" /> },
                    { text: "Discover the safest and most secure options", icon: <ShieldCheck className="h-5 w-5 text-red-600" /> },
                    { text: "Calculate estimated costs for each model", icon: <Calculator className="h-5 w-5 text-orange-600" /> }
                  ].map((item, index) => (
                    <li key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-white border border-blue-100 hover:shadow-md transition-all duration-200">
                      <div className="flex-shrink-0 mt-0.5">
                        {item.icon}
                      </div>
                      <span className="text-gray-700 font-medium">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Toolkit Section */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">
              LLM Evaluation Toolkit
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A practical toolkit for comparing models, costs, and capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature Cards */}
            {[
              {
                title: "Comprehensive Model Directory",
                description: "Browse leading LLMs from OpenAI, Anthropic, Google, Meta, and more.",
                icon: <Database className="h-6 w-6 text-blue-600" />
              },
              {
                title: "Detailed Model Pages",
                description: "Access specs like developer, release date, license, and architecture.",
                icon: <FileText className="h-6 w-6 text-blue-600" />
              },
              {
                title: "Performance Benchmarks",
                description: "Compare models on logic, math, and coding using standardized tests.",
                icon: <BarChart3 className="h-6 w-6 text-blue-600" />
              },
              {
                title: "Safety & Red Teaming Insights",
                description: "View jailbreaking resistance, safety scores, and response risk levels.",
                icon: <ShieldCheck className="h-6 w-6 text-blue-600" />
              },
              {
                title: "Pricing Calculator",
                description: "Estimate token costs and compare pricing across models.",
                icon: <Calculator className="h-6 w-6 text-blue-600" />
              },
              {
                title: "Provider Comparison",
                description: "See which providers offer each model and how they stack up.",
                icon: <Building2 className="h-6 w-6 text-blue-600" />
              },
              {
                title: "Interactive Tools",
                description: "Leverage comparison charts, recommendation engines, and cost optimizers.",
                icon: <LineChart className="h-6 w-6 text-blue-600" />
              },
              {
                title: "Business Decision Guide",
                description: "Get tailored recommendations based on your business goals.",
                icon: <ArrowRight className="h-6 w-6 text-blue-600" />
              },
              {
                title: "Real-World Use Cases",
                description: "Explore model applications across industries and tasks.",
                icon: <Code className="h-6 w-6 text-blue-600" />
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="p-2 bg-blue-50 rounded-lg inline-block mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Data Source Section */}
        <div className="mb-10">
          <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-4 text-blue-800">Data Source</h3>
            <p className="text-gray-700 leading-relaxed">
              Comparative insights are based on a combination of rigorous red teaming and jailbreaking testing performed by Holistic AI, 
              as well as publicly available benchmark data. External benchmarks include CodeLMArena, MathLiveBench, CodeLiveBench, and GPQA. 
              These were sourced from official model provider websites, public leaderboards, benchmark sites, and other accessible resources 
              to ensure transparency, accuracy, and reliability.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Ready to find the right LLM for your needs?</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              View Leaderboard
            </Link>
            <Link href="/compare" className="bg-white hover:bg-gray-50 text-blue-600 border border-blue-200 px-6 py-3 rounded-lg font-medium transition-colors">
              Compare Models
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
} 