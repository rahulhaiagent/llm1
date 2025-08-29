'use client';

import React from 'react';

interface MiniBarChartProps {
  title: string;
  subtitle: string;
  icon: string;
  iconColor: string;
  data: Array<{
    rank: number;
    name: string;
    score: string;
    value: number; // Numeric value for bar height (0-100)
  }>;
}

export default function MiniBarChart({ title, subtitle, icon, iconColor, data }: MiniBarChartProps) {
  // Find the maximum value for scaling
  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-8 h-8 ${iconColor} rounded-lg flex items-center justify-center text-white text-sm font-bold`}>
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-holistic-deepblue font-roobert">
            {title}
          </h3>
          <p className="text-sm text-gray-500 font-roboto-condensed">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Mini Bar Chart */}
      <div className="space-y-4">
        {data.map((item) => {
          const barHeight = (item.value / maxValue) * 100;
          
          return (
            <div key={item.rank} className="space-y-2">
              {/* Model name and score */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600">
                    {item.rank}
                  </span>
                  <span className="text-holistic-deepblue font-medium text-sm font-roobert">
                    {item.name}
                  </span>
                </div>
                <span className="text-holistic-deepblue font-bold text-sm font-roboto-condensed">
                  {item.score}
                </span>
              </div>
              
              {/* Bar */}
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-1000 ease-out ${
                    item.rank === 1 
                      ? iconColor.includes('green') ? 'bg-green-500' :
                        iconColor.includes('blue') ? 'bg-holistic-blurple' :
                        iconColor.includes('purple') ? 'bg-holistic-amethyst' :
                        iconColor.includes('orange') ? 'bg-orange-500' :
                        iconColor.includes('indigo') ? 'bg-indigo-500' :
                        iconColor.includes('pink') ? 'bg-pink-500' :
                        iconColor.includes('cyan') ? 'bg-holistic-cerulean' : 'bg-holistic-blurple'
                      : 'bg-gray-400'
                  }`}
                  style={{ 
                    width: `${barHeight}%`,
                    animationDelay: `${item.rank * 200}ms`
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
