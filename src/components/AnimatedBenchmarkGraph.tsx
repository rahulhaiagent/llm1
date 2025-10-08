'use client';

import { useState, useEffect } from 'react';

const AnimatedBenchmarkGraph = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedScores, setAnimatedScores] = useState<{[key: string]: number}>({});
  const [currentDimension, setCurrentDimension] = useState('Safety');

  // Radar chart data - single model with multiple dimensions
  const radarData = {
    model: 'Claude 3.7',
    dimensions: [
      { 
        name: 'Safety', 
        score: 99.7, 
        angle: 0,
        colors: {
          primary: 'rgba(34, 197, 94, 0.8)',
          fill: ['rgba(34, 197, 94, 0.3)', 'rgba(34, 197, 94, 0.2)', 'rgba(34, 197, 94, 0.1)'],
          center: 'rgb(34, 197, 94)'
        }
      },
      { 
        name: 'Coding', 
        score: 78.3, 
        angle: 60,
        colors: {
          primary: 'rgba(59, 130, 246, 0.8)',
          fill: ['rgba(59, 130, 246, 0.3)', 'rgba(59, 130, 246, 0.2)', 'rgba(59, 130, 246, 0.1)'],
          center: 'rgb(59, 130, 246)'
        }
      },
      { 
        name: 'Math', 
        score: 63.3, 
        angle: 120,
        colors: {
          primary: 'rgba(168, 85, 247, 0.8)',
          fill: ['rgba(168, 85, 247, 0.3)', 'rgba(168, 85, 247, 0.2)', 'rgba(168, 85, 247, 0.1)'],
          center: 'rgb(168, 85, 247)'
        }
      },
      { 
        name: 'Reasoning', 
        score: 88.1, 
        angle: 180,
        colors: {
          primary: 'rgba(245, 158, 11, 0.8)',
          fill: ['rgba(245, 158, 11, 0.3)', 'rgba(245, 158, 11, 0.2)', 'rgba(245, 158, 11, 0.1)'],
          center: 'rgb(245, 158, 11)'
        }
      },
      { 
        name: 'Performance', 
        score: 92.5, 
        angle: 240,
        colors: {
          primary: 'rgba(59, 130, 246, 0.8)',
          fill: ['rgba(59, 130, 246, 0.3)', 'rgba(59, 130, 246, 0.2)', 'rgba(59, 130, 246, 0.1)'],
          center: 'rgb(59, 130, 246)'
        }
      },
      { 
        name: 'Cost Efficiency', 
        score: 85.0, 
        angle: 300,
        colors: {
          primary: 'rgba(239, 68, 68, 0.8)',
          fill: ['rgba(239, 68, 68, 0.3)', 'rgba(239, 68, 68, 0.2)', 'rgba(239, 68, 68, 0.1)'],
          center: 'rgb(239, 68, 68)'
        }
      },
    ]
  };

  const centerX = 180;
  const centerY = 180;
  const maxRadius = 100;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    // Continuous animation cycle
    const animationCycle = () => {
      const dimensions = radarData.dimensions;
      let currentIndex = 0;

      const animateNext = () => {
        // Phase 1: Animate all dimensions to new random base values (300ms)
        const baseScores: {[key: string]: number} = {};
        dimensions.forEach(dim => {
          // Generate varied random ranges for more dynamic visualization
          const minVal = Math.random() * 20 + 30; // Random min between 30-50%
          const maxVal = Math.random() * 20 + 60; // Random max between 60-80%
          baseScores[dim.name] = Math.random() * (maxVal - minVal) + minVal;
        });
        setAnimatedScores(baseScores);
        
        // Phase 2: After a brief delay, randomly set 1-3 dimensions to 100%
      setTimeout(() => {
          const targetScores: {[key: string]: number} = {};
          
          // Randomly decide how many dimensions get 100% (1, 2, or 3)
          const numPerfectScores = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3
          
          // Randomly select which dimensions get 100%
          const shuffledDimensions = [...dimensions].sort(() => Math.random() - 0.5);
          const perfectDimensions = shuffledDimensions.slice(0, numPerfectScores);
          
          // Set scores for all dimensions
          dimensions.forEach(dim => {
            if (perfectDimensions.some(perfectDim => perfectDim.name === dim.name)) {
              targetScores[dim.name] = 100;
            } else {
              // Generate fresh random values for non-perfect dimensions
              const variation = Math.random() * 30 + 40; // Random between 40-70%
              const fluctuation = (Math.random() - 0.5) * 15; // Add some fluctuation ±7.5%
              targetScores[dim.name] = Math.max(25, Math.min(85, variation + fluctuation));
            }
          });
          
          setAnimatedScores(targetScores);
          
          // Update current dimension to the first perfect one for color coordination
          setCurrentDimension(perfectDimensions[0].name);
        }, 400);
        
        currentIndex = (currentIndex + 1) % dimensions.length;
        setTimeout(animateNext, 2500); // Change every 2.5 seconds for smoother transitions
      };

      setTimeout(animateNext, 500);
    };

    animationCycle();

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // radarData.dimensions is stable within component lifecycle

  // Helper functions for radar chart
  const polarToCartesian = (angle: number, radius: number) => {
    const radian = (angle - 90) * (Math.PI / 180);
    return {
      x: centerX + radius * Math.cos(radian),
      y: centerY + radius * Math.sin(radian)
    };
  };

  const createRadarPath = () => {
    return radarData.dimensions.map((dimension, index) => {
      const score = animatedScores[dimension.name] || 0;
      const radius = (score / 100) * maxRadius;
      const point = polarToCartesian(dimension.angle, radius);
      return `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
    }).join(' ') + ' Z';
  };

  // Get current colors based on active dimension
  const getCurrentColors = () => {
    const activeDim = radarData.dimensions.find(dim => dim.name === currentDimension);
    return activeDim?.colors || radarData.dimensions[0].colors;
  };

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
       <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/50 h-full flex items-center justify-center">
        {/* Animated Background Waves */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-br from-holistic-blurple/10 to-transparent rounded-full animate-pulse"></div>
          <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-tr from-holistic-cerulean/10 to-transparent rounded-full animate-bounce"></div>
        </div>

        {/* Radar Chart - Centered */}
        <div className="flex items-center justify-center h-full">
          <div className="relative">
            <svg width="360" height="360" className="overflow-visible">
              <defs>
                <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={getCurrentColors().fill[0]} />
                  <stop offset="50%" stopColor={getCurrentColors().fill[1]} />
                  <stop offset="100%" stopColor={getCurrentColors().fill[2]} />
                </radialGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                <filter id="morphingGlow">
                  <feGaussianBlur stdDeviation="2" result="glow"/>
                  <feFlood floodColor={getCurrentColors().primary} floodOpacity="0.3" result="color"/>
                  <feComposite in="color" in2="glow" operator="in" result="coloredGlow"/>
                  <feMerge>
                    <feMergeNode in="coloredGlow"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Background Grid Circles */}
              {[20, 40, 60, 80, 100].map((radius, index) => (
                <circle
                  key={radius}
                  cx={centerX}
                  cy={centerY}
                  r={(radius / 100) * maxRadius}
                  fill="none"
                  stroke="rgba(156, 163, 175, 0.2)"
                  strokeWidth="1"
                  className={`transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                />
              ))}
              
              {/* Axis Lines */}
              {radarData.dimensions.map((dimension, index) => {
                const point = polarToCartesian(dimension.angle, maxRadius);
                return (
                  <line
                    key={dimension.name}
                    x1={centerX}
                    y1={centerY}
                    x2={point.x}
                    y2={point.y}
                    stroke="rgba(156, 163, 175, 0.3)"
                    strokeWidth="1"
                    className={`transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                    style={{ transitionDelay: `${index * 150}ms` }}
                  />
                );
              })}
              
              {/* Animated Radar Area */}
              <path
                d={createRadarPath()}
                fill="url(#radarGradient)"
                stroke={getCurrentColors().primary}
                strokeWidth="2"
                filter="url(#glow)"
                className={`transition-all duration-1000 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                style={{ 
                  animation: 'radarPulse 3s ease-in-out infinite, morphingGlow 2.5s ease-in-out infinite',
                  transformOrigin: `${centerX}px ${centerY}px`,
                  transition: 'stroke 1500ms ease-in-out, d 800ms cubic-bezier(0.4, 0, 0.2, 1)',
                  strokeDasharray: '5, 5',
                  strokeDashoffset: '0'
                }}
              />
              
              {/* Secondary Radar Area for Morphing Effect */}
              <path
                d={createRadarPath()}
                fill="none"
                stroke={getCurrentColors().primary}
                strokeWidth="1"
                strokeOpacity="0.4"
                className={`transition-all duration-1000 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                style={{ 
                  animation: 'morphingRipple 2.5s ease-in-out infinite',
                  transformOrigin: `${centerX}px ${centerY}px`,
                  transition: 'stroke 1500ms ease-in-out, d 600ms cubic-bezier(0.4, 0, 0.2, 1)',
                  strokeDasharray: '10, 5',
                  strokeDashoffset: '0'
                }}
              />
              
              
              {/* Labels */}
              {radarData.dimensions.map((dimension, index) => {
                const labelRadius = maxRadius + 45; // Increased distance from chart
                const point = polarToCartesian(dimension.angle, labelRadius);
                
                // Adjust text anchor based on position to avoid overlap
                let textAnchor = "middle";
                if (point.x < centerX - 20) textAnchor = "end";
                else if (point.x > centerX + 20) textAnchor = "start";
                
                return (
                  <text
                    key={dimension.name}
                    x={point.x}
                    y={point.y}
                    textAnchor={textAnchor}
                    dominantBaseline="middle"
                    className={`text-sm font-medium fill-gray-700 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                    style={{ transitionDelay: `${index * 200 + 800}ms` }}
                  >
                    {dimension.name}
                  </text>
                );
              })}
              
              {/* Center Circle */}
              <circle
                cx={centerX}
                cy={centerY}
                r="8"
                fill={getCurrentColors().center}
                className={`${isVisible ? 'opacity-100' : 'opacity-0'}`}
                style={{ 
                  transitionDelay: '1000ms',
                  transition: 'fill 1500ms ease-in-out, opacity 1000ms ease-in-out'
                }}
              />
            </svg>
          </div>
        </div>


        {/* Live Indicator - Top Left */}
        <div className={`absolute top-4 left-4 transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
             style={{ transitionDelay: '1000ms' }}>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>

        {/* Floating Security Elements - Top Right */}
        <div className={`absolute top-4 right-4 transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
             style={{ transitionDelay: '2000ms' }}>
          <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center animate-pulse">
            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Performance Indicator - Bottom Left */}
        <div className={`absolute bottom-4 left-4 transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
             style={{ transitionDelay: '2200ms' }}>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-holistic-blurple rounded-full animate-ping"></div>
            <div className="w-2 h-2 bg-holistic-cerulean rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-holistic-amethyst rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>

        {/* Chart Indicators - Bottom Right */}
        <div className={`absolute bottom-4 right-4 transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
             style={{ transitionDelay: '1500ms' }}>
          <div className="flex items-center space-x-1">
            <div className="w-1 h-4 bg-holistic-blurple/30 rounded animate-pulse"></div>
            <div className="w-1 h-6 bg-holistic-blurple/50 rounded animate-pulse" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-1 h-3 bg-holistic-blurple/40 rounded animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1 h-5 bg-holistic-blurple/60 rounded animate-pulse" style={{ animationDelay: '0.3s' }}></div>
          </div>
        </div>
        {/* CSS Animations */}
        <style jsx>{`
          @keyframes radarPulse {
            0%, 100% {
              transform: scale(1);
              opacity: 0.7;
            }
            50% {
              transform: scale(1.02);
              opacity: 0.9;
            }
          }
          
          @keyframes morphingGlow {
            0%, 100% {
              filter: drop-shadow(0 0 8px currentColor);
              opacity: 0.8;
            }
            20% {
              filter: drop-shadow(0 0 15px currentColor);
              opacity: 0.6;
            }
            50% {
              filter: drop-shadow(0 0 12px currentColor);
              opacity: 1;
            }
            80% {
              filter: drop-shadow(0 0 18px currentColor);
              opacity: 0.7;
            }
          }
          
          @keyframes morphingRipple {
            0% {
              transform: scale(1);
              opacity: 0.4;
              stroke-dashoffset: 0;
            }
            25% {
              transform: scale(1.05);
              opacity: 0.6;
              stroke-dashoffset: -10;
            }
            50% {
              transform: scale(1.02);
              opacity: 0.3;
              stroke-dashoffset: -20;
            }
            75% {
              transform: scale(1.08);
              opacity: 0.5;
              stroke-dashoffset: -30;
            }
            100% {
              transform: scale(1);
              opacity: 0.4;
              stroke-dashoffset: -40;
            }
          }
          
          /* Smooth transitions for SVG elements */
          svg path {
            transition: d 800ms cubic-bezier(0.4, 0, 0.2, 1), 
                       stroke 1500ms ease-in-out, 
                       fill 1500ms ease-in-out;
          }
          
          svg circle, svg stop {
            transition: all 1500ms ease-in-out;
          }
          
          /* Enhanced path morphing */
          svg path[d] {
            transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }
          
          
          
          @media (prefers-reduced-motion: reduce) {
            * {
              animation: none !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default AnimatedBenchmarkGraph;
