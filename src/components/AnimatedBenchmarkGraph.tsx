'use client';

import { useState, useEffect } from 'react';

const AnimatedBenchmarkGraph = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedScores, setAnimatedScores] = useState<{[key: string]: number}>({});
  const [animatedBars, setAnimatedBars] = useState<{[key: string]: number}>({});

  const models = [
    { id: 'claude37', name: 'Claude 3.7', score: 99.7, color: 'bg-green-500', rank: 1 },
    { id: 'gpt45', name: 'GPT-4.5', score: 99.6, color: 'bg-blue-500', rank: 2 },
    { id: 'claude4', name: 'Claude 4', score: 98.7, color: 'bg-purple-500', rank: 3 },
    { id: 'gpt4o', name: 'GPT-4o', score: 97.2, color: 'bg-orange-500', rank: 4 },
    { id: 'gemini', name: 'Gemini Pro', score: 95.8, color: 'bg-red-500', rank: 5 },
  ];

  const benchmarkCategories = [
    { name: 'Safety', values: [99.7, 99.6, 98.7, 97.2, 95.8] },
    { name: 'Coding', values: [78.3, 76.1, 75.3, 77.5, 72.1] },
    { name: 'Math', values: [63.3, 69.3, 70.5, 83.4, 85.2] },
    { name: 'Reasoning', values: [88.1, 91.2, 89.7, 87.3, 84.6] },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      
      // Animate bars first
      setTimeout(() => {
        models.forEach((model, index) => {
          setTimeout(() => {
            setAnimatedBars(prev => ({
              ...prev,
              [model.id]: model.score
            }));
          }, index * 200);
        });
      }, 300);

      // Then animate score counters
      setTimeout(() => {
        models.forEach((model, index) => {
          setTimeout(() => {
            let current = 0;
            const increment = model.score / 30;
            const scoreTimer = setInterval(() => {
              current += increment;
              if (current >= model.score) {
                current = model.score;
                clearInterval(scoreTimer);
              }
              setAnimatedScores(prev => ({
                ...prev,
                [model.id]: current
              }));
            }, 50);
          }, index * 200);
        });
      }, 800);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 400 300">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Main Graph Container */}
      <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50 h-full">
        {/* Animated Background Waves */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-br from-holistic-blurple/10 to-transparent rounded-full animate-pulse"></div>
          <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-tr from-holistic-cerulean/10 to-transparent rounded-full animate-bounce"></div>
        </div>

        {/* Live Indicator */}
        <div className="relative flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-1 h-4 bg-holistic-blurple/30 rounded animate-pulse"></div>
            <div className="w-1 h-6 bg-holistic-blurple/50 rounded animate-pulse" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-1 h-3 bg-holistic-blurple/40 rounded animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1 h-5 bg-holistic-blurple/60 rounded animate-pulse" style={{ animationDelay: '0.3s' }}></div>
          </div>
        </div>

        {/* Benchmark Bars */}
        <div className="space-y-4 mb-6">
          {models.map((model, index) => (
            <div key={model.id} className="relative">
              {/* Model Row */}
              <div className="flex items-center space-x-3 mb-2">
                {/* Rank Badge */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white transition-all duration-500 ${
                  model.rank === 1 ? 'bg-yellow-500 shadow-lg shadow-yellow-500/30' :
                  model.rank === 2 ? 'bg-gray-400 shadow-lg shadow-gray-400/30' :
                  model.rank === 3 ? 'bg-orange-600 shadow-lg shadow-orange-600/30' :
                  'bg-gray-300'
                } ${isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
                style={{ transitionDelay: `${index * 100}ms` }}>
                  {model.rank}
                </div>

                {/* Progress Bar */}
                <div className="flex-1 relative">
                  <div className="h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                    {/* Animated Bar */}
                    <div 
                      className={`h-full ${model.color} transition-all duration-1000 ease-out relative`}
                      style={{ 
                        width: `${(animatedBars[model.id] || 0)}%`,
                        transitionDelay: `${index * 200}ms`
                      }}
                    >
                      {/* Shimmer Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                    </div>
                    
                    {/* Score Display */}
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      <span className="text-xs font-bold text-gray-700">
                        {(animatedScores[model.id] || 0).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Security Badge */}
                {model.rank <= 3 && (
                  <div className={`transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
                       style={{ transitionDelay: `${1000 + index * 100}ms` }}>
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Multi-Category Radar */}
        <div className="relative">
          <div className="grid grid-cols-2 gap-3">
            {benchmarkCategories.map((category, catIndex) => (
              <div key={category.name} className="relative">
                <div className="h-16 bg-gradient-to-t from-gray-50 to-transparent rounded-lg p-2 relative overflow-hidden">
                  {/* Mini bars for each model in this category */}
                  <div className="flex items-end justify-between h-full space-x-1">
                    {category.values.map((value, modelIndex) => (
                      <div key={modelIndex} className="flex-1 relative">
                        <div 
                          className={`w-full ${models[modelIndex]?.color || 'bg-gray-300'} rounded-sm transition-all duration-1000 ease-out`}
                          style={{ 
                            height: `${(value / 100) * 100}%`,
                            transitionDelay: `${1500 + catIndex * 200 + modelIndex * 50}ms`
                          }}
                        ></div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Category Label */}
                  <div className="absolute bottom-0 left-0 right-0 text-center">
                    <span className="text-xs text-gray-500 font-medium">{category.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Security Elements */}
        <div className={`absolute top-4 right-4 transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
             style={{ transitionDelay: '2000ms' }}>
          <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center animate-pulse">
            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Performance Indicator */}
        <div className={`absolute bottom-4 left-4 transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
             style={{ transitionDelay: '2200ms' }}>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-holistic-blurple rounded-full animate-ping"></div>
            <div className="w-2 h-2 bg-holistic-cerulean rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-holistic-amethyst rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedBenchmarkGraph;
