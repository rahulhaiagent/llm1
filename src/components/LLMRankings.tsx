'use client'

import React from 'react';

interface RankingItem {
  rank: number;
  name: string;
  score: string;
}

interface RankingSection {
  icon: string;
  iconColor: string;
  title: string;
  subtitle: string;
  items: RankingItem[];
}

export default function LLMRankings() {
  const rankingSections: RankingSection[] = [
    {
      icon: "🛡️",
      iconColor: "bg-green-500",
      title: "Best Model for Security",
      subtitle: "Safety ranking benchmark",
      items: [
        { rank: 1, name: "Claude 3.7 Sonnet", score: "99.7% safe" },
        { rank: 2, name: "GPT-4.5", score: "99.6% safe" },
        { rank: 3, name: "Claude 4 Sonnet", score: "98.7% safe" }
      ]
    },
    {
      icon: "💻",
      iconColor: "bg-blue-500",
      title: "Best Model for Coding",
      subtitle: "CodeLiveBench benchmark",
      items: [
        { rank: 1, name: "GPT-4o", score: "77.5%" },
        { rank: 2, name: "GPT-4.5", score: "76.1%" },
        { rank: 3, name: "GPT-5", score: "75.3%" }
      ]
    },
    {
      icon: "💰",
      iconColor: "bg-orange-500",
      title: "Best Model for Pricing - Cheapest",
      subtitle: "Input cost per 1M tokens",
      items: [
        { rank: 1, name: "Gemini 2.0 Flash", score: "$0.10 / 1M tokens" },
        { rank: 2, name: "Gemini 2.5 Flash Preview", score: "$0.15 / 1M tokens" },
        { rank: 3, name: "Llama 4 Maverick", score: "$0.20 / 1M tokens" }
      ]
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-normal text-gray-900 mb-4">
            LLM Rankings
          </h2>
          <p className="text-lg text-gray-600">
            Best models and API providers in each category
          </p>
        </div>

        {/* Rankings Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {rankingSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              {/* Section Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-8 h-8 ${section.iconColor} rounded-lg flex items-center justify-center text-white text-sm font-bold`}>
                  {section.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {section.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {section.subtitle}
                  </p>
                </div>
              </div>

              {/* Rankings List */}
              <div className="space-y-4">
                {section.items.map((item) => (
                  <div key={item.rank} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600">
                        {item.rank}
                      </span>
                      <span className="text-gray-900 font-medium text-sm">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-gray-900 font-bold text-sm">
                      {item.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
