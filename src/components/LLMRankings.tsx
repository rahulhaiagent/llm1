'use client'

import React, { useState, useEffect, useMemo } from 'react';

export default function LLMRankings() {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedScores, setAnimatedScores] = useState<{[key: string]: number}>({});

  const chartData = useMemo(() => [
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
    }
  ], []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Start score animations
          setTimeout(() => {
            chartData.forEach((chart, chartIndex) => {
              chart.data.forEach((item, itemIndex) => {
                setTimeout(() => {
                  setAnimatedScores(prev => ({
                    ...prev,
                    [`${chartIndex}-${itemIndex}`]: item.value
                  }));
                }, 0);
              });
            });
          }, 0);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('llm-rankings-section');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [chartData]);

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
    <section id="llm-rankings-section" className="py-16 bg-gray-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-10 left-10 w-32 h-32 bg-holistic-blurple/5 rounded-full transition-all duration-[3000ms] ${isVisible ? 'animate-pulse scale-110' : 'scale-0'}`}></div>
        <div className={`absolute top-32 right-20 w-24 h-24 bg-holistic-cerulean/5 rounded-full transition-all duration-[2500ms] delay-300 ${isVisible ? 'animate-bounce scale-100' : 'scale-0'}`}></div>
        <div className={`absolute bottom-20 left-1/4 w-20 h-20 bg-holistic-amethyst/5 rounded-full transition-all duration-[2000ms] delay-500 ${isVisible ? 'animate-pulse scale-105' : 'scale-0'}`}></div>
        <div className={`absolute bottom-32 right-1/3 w-28 h-28 bg-green-500/5 rounded-full transition-all duration-[2800ms] delay-700 ${isVisible ? 'animate-bounce scale-100' : 'scale-0'}`}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header with Complex Animation */}
        <div className={`text-center mb-16 mt-8 transition-all duration-0 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-[2em] font-normal text-holistic-deepblue mb-6 font-roobert relative pb-3 group">
            {/* <span className={`inline-block transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>LLM</span> */}
            <span className={`inline-block transition-all duration-0 delay-0 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>LLM Rankings</span>
            <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-holistic-cerulean to-holistic-blurple rounded-full transition-all duration-0 delay-0 ${isVisible ? 'w-20 opacity-100' : 'w-0 opacity-0'}`}></div>
            
            {/* Animated sparkles */}
            <div className={`absolute -top-2 left-1/2 transform -translate-x-1/2 transition-all duration-0 delay-0 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
              <div className="relative">
                <div className="absolute animate-ping w-2 h-2 bg-holistic-blurple rounded-full"></div>
                <div className="w-2 h-2 bg-holistic-blurple rounded-full"></div>
              </div>
            </div>
          </h2>
          <p className={`text-lg text-gray-600 max-w-2xl mx-auto transition-all duration-0 delay-0 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Best models and API providers in each category
          </p>
        </div>

        {/* Rankings Grid with Staggered Animation */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {chartData.map((chart, index) => (
            <div
              key={index}
              className={`transform transition-all duration-0 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl group ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-12'
              }`}
              style={{ 
                transitionDelay: `0ms`,
                transformOrigin: 'center bottom'
              }}
            >
              {/* Custom Enhanced Chart Card */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 relative overflow-hidden group-hover:border-holistic-blurple/30 transition-all duration-300">
                {/* Animated gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-holistic-blurple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Icon with pulse animation */}
                <div className={`w-12 h-12 ${chart.iconColor} rounded-lg flex items-center justify-center mb-4 relative z-10 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-xl animate-pulse">{chart.icon}</span>
                  <div className="absolute inset-0 bg-white/20 rounded-lg animate-ping opacity-0 group-hover:opacity-100"></div>
                </div>
                
                {/* Title with typewriter effect */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 relative z-10 group-hover:text-holistic-deepblue transition-colors duration-300 font-roobert">
                  {chart.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 relative z-10">
                  {chart.subtitle}
                </p>
                
                {/* Animated Rankings */}
                <div className="space-y-3 relative z-10">
                  {chart.data.map((item, itemIndex) => {
                    const scoreKey = `${index}-${itemIndex}`;
                    const animatedScore = animatedScores[scoreKey] || 0;
                    const progress = (animatedScore / 100) * 100;
                    
                    return (
                      <div key={itemIndex} className="flex items-center justify-between group/item hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200">
                        <div className="flex items-center space-x-3">
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-bold transition-all duration-300 group-hover/item:scale-110 ${
                            item.rank === 1 ? 'bg-green-600 shadow-lg shadow-green-600/30' : 
                            item.rank === 2 ? 'bg-gray-400 shadow-lg shadow-gray-400/30' : 
                            'bg-gray-400 shadow-lg shadow-gray-400/30'
                          }`}>
                            {item.rank}
                          </div>
                          <span className="font-medium text-gray-900 text-sm group-hover/item:text-holistic-deepblue transition-colors duration-200 font-roobert">
                            {item.name}
                          </span>
                        </div>
                        
                        {/* Animated Score with Progress Bar */}
                        <div className="flex items-center space-x-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-1000 ease-out ${
                                item.rank === 1 ? 'bg-green-600' : 'bg-holistic-blurple'
                              }`}
                              style={{ 
                                width: `${progress}%`,
                                transitionDelay: `${1200 + index * 200 + itemIndex * 100}ms`
                              }}
                            ></div>
                          </div>
                          <span className={`font-bold text-sm transition-all duration-300 ${
                            item.rank === 1 ? 'text-green-600' : 'text-gray-600'
                          } group-hover/item:scale-110`}>
                            {chart.title.includes('Context') ? item.score : `${Math.round(animatedScore)}${chart.title.includes('Context') ? '' : '%'}`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Floating action indicator */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-2 h-2 bg-holistic-blurple rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Note about rankings with fade-in animation */}
        <div className={`text-center mt-8 transition-all duration-1000 delay-[2000ms] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-sm text-gray-500 relative">
            The rankings are based on benchmark data
            {/* Animated dots */}
            <span className="inline-flex ml-1">
              <span className="animate-bounce delay-0">.</span>
              <span className="animate-bounce delay-100">.</span>
              <span className="animate-bounce delay-200">.</span>
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
