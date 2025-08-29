'use client'

import React from 'react';
import MiniBarChart from './MiniBarChart';

export default function LLMRankings() {
  const chartData = [
    {
      title: "Best Model for Security",
      subtitle: "Safety ranking benchmark",
      icon: "🛡️",
      iconColor: "bg-green-500",
      data: [
        { rank: 1, name: "Claude 3.7 Sonnet", score: "99.7% safe", value: 99.7 },
        { rank: 2, name: "GPT-4.5", score: "99.6% safe", value: 99.6 },
        { rank: 3, name: "Claude Opus 4.1", score: "98.7% safe", value: 98.7 }
      ]
    },
    {
      title: "Best Model for Coding",
      subtitle: "CodeLiveBench benchmark",
      icon: "💻",
      iconColor: "bg-holistic-blurple",
      data: [
        { rank: 1, name: "GPT-4o", score: "77.5%", value: 77.5 },
        { rank: 2, name: "GPT-4.5", score: "76.1%", value: 76.1 },
        { rank: 3, name: "GPT-5", score: "75.31%", value: 75.31 }
      ]
    },
    {
      title: "Best for Code AGI",
      subtitle: "CodeRankedAGI benchmark",
      icon: "🤖",
      iconColor: "bg-holistic-cerulean",
      data: [
        { rank: 1, name: "Claude 4 Sonnet", score: "78.3%", value: 78.3 },
        { rank: 2, name: "Claude Opus 4.1", score: "74.5%", value: 74.5 },
        { rank: 3, name: "Claude 3.7 Sonnet", score: "60.4%", value: 60.4 }
      ]
    },
    {
      title: "Best Model for Context Window",
      subtitle: "Maximum context length",
      icon: "🧠",
      iconColor: "bg-holistic-amethyst",
      data: [
        { rank: 1, name: "Gemini 2.5 Pro Preview", score: "1M tokens", value: 100 },
        { rank: 2, name: "Gemini 2.0 Flash", score: "1M tokens", value: 100 },
        { rank: 3, name: "GPT-4.1", score: "1M tokens", value: 100 }
      ]
    }
  ];

  // Hidden categories for future use:
  // {
  //   title: "Best Multimodal Models",
  //   subtitle: "Image, audio & text capabilities",
  //   icon: "🎨",
  //   iconColor: "bg-orange-500",
  //   data: [
  //     { rank: 1, name: "GPT-4o", score: "77.5%", value: 77.5 },
  //     { rank: 2, name: "GPT-4.5", score: "76.1%", value: 76.1 },
  //     { rank: 3, name: "GPT-5", score: "75.31%", value: 75.31 }
  //   ]
  // },
  // {
  //   title: "Best Model for Chatbot",
  //   subtitle: "MMLU benchmark scores",
  //   icon: "💬",
  //   iconColor: "bg-indigo-500",
  //   data: [
  //     { rank: 1, name: "GPT-5", score: "93.0%", value: 93.0 },
  //     { rank: 2, name: "GPT-4.1", score: "90.2%", value: 90.2 },
  //     { rank: 3, name: "GPT-OSS-120B", score: "90.0%", value: 90.0 }
  //   ]
  // },
  // {
  //   title: "Best for Content Creation",
  //   subtitle: "GPQA reasoning benchmark",
  //   icon: "✍️",
  //   iconColor: "bg-pink-500",
  //   data: [
  //     { rank: 1, name: "Grok 4", score: "88.1%", value: 88.1 },
  //     { rank: 2, name: "GPT-5", score: "86.0%", value: 86.0 },
  //     { rank: 3, name: "Claude Opus 4.1", score: "83.3%", value: 83.3 }
  //   ]
  // }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 mt-8">
          <h2 className="text-4xl font-normal text-holistic-deepblue mb-6 font-roobert">
            LLM Rankings
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-roboto-condensed">
            Best models and API providers in each category
          </p>
        </div>

        {/* Rankings Grid with Mini Bar Charts */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {chartData.map((chart, index) => (
            <MiniBarChart
              key={index}
              title={chart.title}
              subtitle={chart.subtitle}
              icon={chart.icon}
              iconColor={chart.iconColor}
              data={chart.data}
            />
          ))}
        </div>

        {/* Note about rankings */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            The rankings are based on benchmark data
          </p>
        </div>
      </div>
    </section>
  );
}
