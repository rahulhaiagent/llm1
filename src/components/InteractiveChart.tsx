'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ModelRecommendation {
  model: {
    Model: string;
    'Input Cost/M': string;
    'Output Cost/M': string;
    OperationalRank?: string;
    SafeResponses?: string;
    JailbreakingResistance?: string;
    CodeLMArena?: string;
    MathLiveBench?: string;
    Latency?: string;
    'Org.': string;
  };
  score: number;
  reason: string;
  isProviderComparison?: boolean;
  providerData?: {
    providerName: string;
    modelId: string;
    inputCost: number;
    outputCost: number;
    latency: number;
    throughput: number;
  };
}

interface InteractiveChartProps {
  recommendations: ModelRecommendation[];
  title: string;
  queryContext?: string;
}

type ColorTheme = 'modern' | 'vibrant' | 'pastel' | 'professional' | 'gradient';
type AnimationStyle = 'smooth' | 'bounce' | 'elastic' | 'basic' | 'wave' | 'cascade' | 'spiral' | 'heartbeat' | 'zoom';
type Theme = 'light' | 'dark';

const colorThemes = {
  modern: ['#3B82F6', '#8B5CF6', '#EF4444', '#10B981', '#F59E0B'],
  vibrant: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
  pastel: ['#A78BFA', '#34D399', '#FBBF24', '#F87171', '#60A5FA'],
  professional: ['#1E40AF', '#7C3AED', '#DC2626', '#059669', '#D97706'],
  gradient: ['#667EEA', '#764BA2', '#F093FB', '#F5576C', '#4FACFE']
};

const animationConfigs = {
  smooth: {
    duration: 2500,
    easing: 'easeInOutQuart' as const,
  },
  bounce: {
    duration: 3000,
    easing: 'easeOutBounce' as const,
  },
  elastic: {
    duration: 3500,
    easing: 'easeOutElastic' as const,
  },
  basic: {
    duration: 2000,
    easing: 'easeInOutQuad' as const,
  },
  wave: {
    duration: 3000,
    easing: 'easeInOutSine' as const,
  },
  cascade: {
    duration: 2800,
    easing: 'easeInOutCubic' as const,
  },
  spiral: {
    duration: 3200,
    easing: 'easeInOutBack' as const,
  },
  heartbeat: {
    duration: 2600,
    easing: 'easeInOutCirc' as const,
  },
  zoom: {
    duration: 2400,
    easing: 'easeInOutExpo' as const,
  },
};

export default function InteractiveChart({ recommendations, title, queryContext = '' }: InteractiveChartProps) {
  const [colorTheme, setColorTheme] = useState<ColorTheme>('modern');
  const [animationStyle, setAnimationStyle] = useState<AnimationStyle>('smooth');
  const [showLabels, setShowLabels] = useState(true);
  const [showGridlines, setShowGridlines] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);
  const [theme, setTheme] = useState<Theme>('light');
  const [isRecording, setIsRecording] = useState(false);
  const chartRef = useRef<ChartJS<'bar'>>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Determine if chart should be shown based on query context and data
  const shouldShowChart = useMemo(() => {
    const lowerQuery = queryContext.toLowerCase();
    
    // Skip chart for provider-only queries where visualization isn't meaningful
    const isProviderListQuery = (
      lowerQuery.includes('provider') && 
      (lowerQuery.includes('which') || lowerQuery.includes('what') || lowerQuery.includes('list'))
    );
    
    // Skip chart if we have less than 2 data points
    const hasMinimalData = recommendations.length < 2;
    
    // Skip chart if all recommendations have the same values (no variation to visualize)
    const hasVariation = recommendations.length > 1 && (() => {
      const firstScore = recommendations[0].score;
      return recommendations.some(rec => rec.score !== firstScore);
    })();
    
    // Skip chart for pure provider comparison queries (better shown in table)
    const isPureProviderComparison = recommendations.every(rec => rec.isProviderComparison);
    
    console.log('Chart visibility check:', {
      isProviderListQuery,
      hasMinimalData,
      hasVariation,
      isPureProviderComparison,
      queryContext: lowerQuery
    });
    
    // Show chart only if we have meaningful data to visualize
    return !isProviderListQuery && !hasMinimalData && hasVariation && !isPureProviderComparison;
  }, [recommendations, queryContext]);

  // Trigger animation replay when color theme or animation style changes
  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [colorTheme, animationStyle]);

  // Extract numeric value helper
  const extractNumeric = (value: string): number => {
    if (!value || value === '-' || value === 'N/A') return 0;
    const match = value.match(/(\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[1]) : 0;
  };

  // Get theme-aware styles
  const getThemeStyles = () => {
    if (theme === 'dark') {
      return {
        background: 'bg-gray-900',
        cardBackground: 'bg-slate-900',
        text: 'text-white',
        textSecondary: 'text-gray-300',
        border: 'border-gray-700',
        gridColor: 'rgba(255, 255, 255, 0.1)',
        tickColor: '#e5e7eb'
      };
    }
    return {
      background: 'bg-white',
      cardBackground: 'bg-white',
      text: 'text-gray-900',
      textSecondary: 'text-gray-600',
      border: 'border-gray-300',
      gridColor: 'rgba(0, 0, 0, 0.1)',
      tickColor: '#374151'
    };
  };

  const themeStyles = getThemeStyles();

  // Prepare chart data based on query context
  const chartData = useMemo(() => {
    const labels = recommendations.map(rec => rec.model.Model);
    
    // Determine what metrics to show based on query context
    const lowerQuery = queryContext.toLowerCase();
    const isCostQuery = lowerQuery.includes('cheap') || lowerQuery.includes('cost') || lowerQuery.includes('price') || lowerQuery.includes('affordable');
    const isSecurityQuery = lowerQuery.includes('secure') || lowerQuery.includes('safety') || lowerQuery.includes('safe');
    const isCodingQuery = lowerQuery.includes('coding') || lowerQuery.includes('programming') || lowerQuery.includes('code');
    const isLatencyQuery = lowerQuery.includes('fast') || lowerQuery.includes('latency') || lowerQuery.includes('speed') || lowerQuery.includes('quick');
    const isCostAndSecurityQuery = (lowerQuery.includes('cheap') || lowerQuery.includes('affordable')) && (lowerQuery.includes('secure') || lowerQuery.includes('safe'));
    const isProviderQuery = lowerQuery.includes('provider') || lowerQuery.includes('support') || lowerQuery.includes('available') || lowerQuery.includes('which');
    const isPerformanceQuery = lowerQuery.includes('performance') || lowerQuery.includes('best') || lowerQuery.includes('top') || lowerQuery.includes('rank');
    
    const colors = colorThemes[colorTheme];
    const datasets = [];

    // Check if this is a provider comparison query
    const isProviderComparison = recommendations.length > 0 && recommendations[0].isProviderComparison;

    // Show provider-specific metrics for provider comparisons
    if (isProviderComparison || isProviderQuery) {
      const inputCosts = recommendations.map(rec => extractNumeric(rec.model['Input Cost/M']));
      const outputCosts = recommendations.map(rec => extractNumeric(rec.model['Output Cost/M']));
      const latencies = recommendations.map(rec => extractNumeric(rec.model.Latency || ''));
      
      datasets.push({
        label: 'Input Cost ($/M)',
        data: inputCosts,
        backgroundColor: colors[0],
        borderColor: colors[0],
        borderWidth: 0,
        borderRadius: 8,
        borderSkipped: false,
      });
      
      datasets.push({
        label: 'Output Cost ($/M)',
        data: outputCosts,
        backgroundColor: colors[1],
        borderColor: colors[1],
        borderWidth: 0,
        borderRadius: 8,
        borderSkipped: false,
      });
      
      datasets.push({
        label: 'Latency (seconds)',
        data: latencies,
        backgroundColor: colors[2],
        borderColor: colors[2],
        borderWidth: 0,
        borderRadius: 8,
        borderSkipped: false,
      });
    } else if (isCostQuery) {
      const inputCosts = recommendations.map(rec => extractNumeric(rec.model['Input Cost/M']));
      const outputCosts = recommendations.map(rec => extractNumeric(rec.model['Output Cost/M']));
      
      datasets.push({
        label: 'Input Cost ($/M)',
        data: inputCosts,
        backgroundColor: colors[0],
        borderColor: colors[0],
        borderWidth: 0,
        borderRadius: 8,
        borderSkipped: false,
      });
      
      datasets.push({
        label: 'Output Cost ($/M)',
        data: outputCosts,
        backgroundColor: colors[1],
        borderColor: colors[1],
        borderWidth: 0,
        borderRadius: 8,
        borderSkipped: false,
      });
    } else if (isSecurityQuery) {
      const safetyScores = recommendations.map(rec => extractNumeric(rec.model.SafeResponses || ''));
      const jailbreakScores = recommendations.map(rec => extractNumeric(rec.model.JailbreakingResistance || ''));
      
      datasets.push({
        label: 'Safety Score (%)',
        data: safetyScores,
        backgroundColor: colors[0],
        borderColor: colors[0],
        borderWidth: 0,
        borderRadius: 8,
        borderSkipped: false,
      });
      
      datasets.push({
        label: 'Jailbreak Resistance (%)',
        data: jailbreakScores,
        backgroundColor: colors[1],
        borderColor: colors[1],
        borderWidth: 0,
        borderRadius: 8,
        borderSkipped: false,
      });
    } else if (isCodingQuery) {
      const codingScores = recommendations.map(rec => extractNumeric(rec.model.CodeLMArena || ''));
      
      // For coding queries, only show coding score
      datasets.push({
        label: 'Coding Score',
        data: codingScores,
        backgroundColor: colors[0],
        borderColor: colors[0],
        borderWidth: 0,
        borderRadius: 8,
        borderSkipped: false,
      });
    } else if (isLatencyQuery) {
      // Show only latency for speed queries - only for models with actual latency data
      const modelsWithLatency = recommendations.filter(rec => {
        const hasProviderLatency = rec.providerData?.latency && rec.providerData.latency > 0;
        const hasModelLatency = rec.model.Latency && extractNumeric(rec.model.Latency) > 0;
        return hasProviderLatency || hasModelLatency;
      });
      
      // Debug: log filtered models
      console.log('Models with latency data:', modelsWithLatency.length, 'out of', recommendations.length);
      
      // If no models have latency data, fall back to showing all with score-based data
      const modelsToShow = modelsWithLatency.length > 0 ? modelsWithLatency : recommendations;
      
      // Update labels to only include models with latency data
      const latencyLabels = modelsToShow.map(rec => rec.model.Model);
      
      const rawLatencies = modelsToShow.map(rec => {
        if (rec.providerData?.latency) {
          return rec.providerData.latency;
        }
        return extractNumeric(rec.model.Latency || '');
      });
      
      // Debug: log the raw latencies
      console.log('Raw latencies for filtered models:', rawLatencies);
      
      // Use actual latency values in seconds (no scaling needed)
      const latencies = rawLatencies.map((latency, index) => {
        console.log(`Model ${index} (${modelsToShow[index].model.Model}): Latency ${latency}s`);
        return latency;
      });
      
      // Debug: log the processed data
      console.log('Processed latencies:', latencies);
      
      // Override labels for latency queries to only show models with data
      labels.length = 0;
      labels.push(...latencyLabels);

      // Show only latency bars (single dataset)
      datasets.push({
        label: 'Latency (seconds)',
        data: latencies,
        backgroundColor: colors[0],
        borderColor: colors[0],
        borderWidth: 0,
        borderRadius: 8,
        borderSkipped: false,
        yAxisID: 'y',
      });
    } else if (isCostAndSecurityQuery) {
      // Show cost and security for "cheap and secure" queries
      const avgCosts = recommendations.map(rec => {
        const inputCost = extractNumeric(rec.model['Input Cost/M']);
        const outputCost = extractNumeric(rec.model['Output Cost/M']);
        return (inputCost + outputCost) / 2;
      });
      const safetyScores = recommendations.map(rec => extractNumeric(rec.model.SafeResponses || ''));
      
      datasets.push({
        label: 'Avg Cost ($/M)',
        data: avgCosts,
        backgroundColor: colors[0],
        borderColor: colors[0],
        borderWidth: 0,
        borderRadius: 8,
        borderSkipped: false,
      });
      
      datasets.push({
        label: 'Safety Score (%)',
        data: safetyScores,
        backgroundColor: colors[2],
        borderColor: colors[2],
        borderWidth: 0,
        borderRadius: 8,
        borderSkipped: false,
      });
    } else if (isPerformanceQuery) {
      // Only show performance data when specifically asked for performance
      const performanceRanks = recommendations.map(rec => {
        const rank = extractNumeric(rec.model.OperationalRank || '');
        return rank === 0 ? 0 : 101 - rank; // Invert for better visualization
      });
      
      datasets.push({
        label: 'Performance Score',
        data: performanceRanks,
        backgroundColor: colors[0],
        borderColor: colors[0],
        borderWidth: 0,
        borderRadius: 8,
        borderSkipped: false,
      });
    } else {
      // Default: show only cost data (most commonly requested)
      const avgCosts = recommendations.map(rec => {
        const inputCost = extractNumeric(rec.model['Input Cost/M']);
        const outputCost = extractNumeric(rec.model['Output Cost/M']);
        return (inputCost + outputCost) / 2;
      });
      
      datasets.push({
        label: 'Avg Cost ($/M)',
        data: avgCosts,
        backgroundColor: colors[0],
        borderColor: colors[0],
        borderWidth: 0,
        borderRadius: 8,
        borderSkipped: false,
      });
    }

    return {
      labels,
      datasets,
    };
  }, [recommendations, colorTheme, queryContext]);

  // Chart options
  const options = useMemo(() => {
    const lowerQuery = queryContext.toLowerCase();
    const isLatencyQuery = lowerQuery.includes('fast') || lowerQuery.includes('latency') || lowerQuery.includes('speed') || lowerQuery.includes('quick');
    
    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: animationConfigs[animationStyle],
      interaction: {
        intersect: false,
        mode: 'index' as const,
      },
      plugins: {
        legend: {
          display: showLabels,
          position: 'top' as const,
          labels: {
            color: themeStyles.tickColor,
            font: {
              size: 14,
              weight: 'bold' as const,
            },
            usePointStyle: true,
            pointStyle: 'rectRounded',
            padding: 25,
          },
        },
        title: {
          display: true,
          text: title,
          color: themeStyles.tickColor,
          font: {
            size: 22,
            weight: 'bold' as const,
          },
          padding: {
            top: 25,
            bottom: 35,
          },
        },
        tooltip: {
          backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.95)',
          titleColor: theme === 'dark' ? '#ffffff' : '#000000',
          bodyColor: theme === 'dark' ? '#ffffff' : '#000000',
          borderColor: colorThemes[colorTheme][0],
          borderWidth: 2,
          cornerRadius: 12,
          displayColors: true,
          padding: 16,
          titleFont: {
            size: 14,
            weight: 'bold' as const,
          },
          bodyFont: {
            size: 13,
            weight: 'normal' as const,
          },
          callbacks: isLatencyQuery ? {
            label: function(context: { dataset: { label?: string }, parsed: { y: number } }) {
              const datasetLabel = context.dataset.label || '';
              const value = context.parsed.y;
              
              if (datasetLabel.includes('Latency')) {
                // Show actual latency in seconds
                return `${datasetLabel}: ${value.toFixed(2)}s`;
              }
              return `${datasetLabel}: ${value}`;
            }
          } : undefined,
        },
      },
      scales: {
        x: {
          display: showGridlines,
          grid: {
            display: showGridlines,
            color: themeStyles.gridColor,
            lineWidth: 1,
          },
          ticks: {
            color: themeStyles.tickColor,
            font: {
              size: 13,
              weight: 'bold' as const,
            },
            maxRotation: 45,
            padding: 8,
          },
          border: {
            display: false,
          },
        },
        y: {
          display: showGridlines,
          grid: {
            display: showGridlines,
            color: themeStyles.gridColor,
            lineWidth: 1,
          },
          ticks: {
            color: themeStyles.tickColor,
            font: {
              size: 13,
              weight: 'bold' as const,
            },
            padding: 12,
            stepSize: isLatencyQuery ? 0.05 : undefined, // 0.05 second increments for better granularity
            callback: isLatencyQuery ? function(value: number | string) {
              return Number(value).toFixed(2) + 's'; // Show as "0.15s", "0.20s", etc.
            } : undefined,
          },
          border: {
            display: false,
          },
          beginAtZero: false, // Don't start from zero for latency to show bars better
          min: isLatencyQuery ? 0.1 : 0, // Start from 0.1s for latency charts
          max: isLatencyQuery ? 0.5 : undefined, // Max 0.5s for latency charts as requested
          grace: isLatencyQuery ? 0 : '10%', // No grace for latency to use exact range
        },
      },
    };
  }, [colorTheme, animationStyle, showLabels, showGridlines, title, theme, themeStyles, queryContext]);

  // Replay animation
  const replayAnimation = () => {
    setAnimationKey(prev => prev + 1);
  };

  // Export data functionality
  const exportData = () => {
    const csvData = recommendations.map(rec => ({
      Model: rec.model.Model,
      Organization: rec.model['Org.'],
      InputCost: rec.model['Input Cost/M'],
      OutputCost: rec.model['Output Cost/M'],
      OperationalRank: rec.model.OperationalRank || 'N/A',
      SafetyScore: rec.model.SafeResponses || 'N/A',
      CodingScore: rec.model.CodeLMArena || 'N/A',
      Reason: rec.reason
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `model-recommendations-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Export chart as theme-aware image
  const exportImage = () => {
    if (chartRef.current) {
      const canvas = chartRef.current.canvas;
      
      // Create a new canvas with theme-aware background
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = canvas.width;
      exportCanvas.height = canvas.height;
      const exportCtx = exportCanvas.getContext('2d');
      
      if (exportCtx) {
        // Fill background based on theme
        exportCtx.fillStyle = theme === 'dark' ? '#1e293b' : '#ffffff';
        exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
        
        // Draw the chart on top
        exportCtx.drawImage(canvas, 0, 0);
        
        const url = exportCanvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = url;
        link.download = `chart-${theme}-mode-${new Date().toISOString().split('T')[0]}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

    // Export animation as WebM video
  const exportVideo = async () => {
    if (!chartRef.current || !containerRef.current) return;
    
    setIsRecording(true);
    let mediaRecorder: MediaRecorder | null = null;
    const recordedChunks: Blob[] = [];
    
    try {
      // Create a canvas to record from
      const recordCanvas = document.createElement('canvas');
      const recordCtx = recordCanvas.getContext('2d');
      recordCanvas.width = 1200;
      recordCanvas.height = 800;
      
      if (!recordCtx) {
        throw new Error('Could not get canvas context');
      }
      
      // Get canvas stream for recording
      const stream = recordCanvas.captureStream(30); // 30 FPS
      
      // Setup MediaRecorder for WebM
      const options = {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 2500000 // 2.5 Mbps
      };
      
      // Fallback to VP8 if VP9 not supported
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = 'video/webm;codecs=vp8';
      }
      
      // Fallback to default WebM if specific codecs not supported
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = 'video/webm';
      }
      
      mediaRecorder = new MediaRecorder(stream, options);
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `chart-animation-${theme}-mode-${new Date().toISOString().split('T')[0]}.webm`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        console.log(`Created WebM video in ${theme} mode`);
      };
      
      // Start recording
      mediaRecorder.start(100); // Collect data every 100ms
      
      // Function to draw current chart state to recording canvas
      const drawFrame = () => {
        if (!recordCtx || !chartRef.current) return;
        
        // Fill background based on theme
        recordCtx.fillStyle = theme === 'dark' ? '#1e293b' : '#ffffff';
        recordCtx.fillRect(0, 0, recordCanvas.width, recordCanvas.height);
        
        // Draw the chart
        const chartCanvas = chartRef.current.canvas;
        recordCtx.drawImage(chartCanvas, 0, 0, recordCanvas.width, recordCanvas.height);
      };
      
      // Restart animation
      setAnimationKey(prev => prev + 1);
      
      // Wait for animation to start
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Record for 3 seconds (duration of animation)
      const recordingDuration = 3000;
      const frameInterval = 1000 / 30; // 30 FPS
      const totalFrames = Math.floor(recordingDuration / frameInterval);
      
      for (let i = 0; i < totalFrames; i++) {
        drawFrame();
        await new Promise(resolve => setTimeout(resolve, frameInterval));
      }
      
      // Stop recording
      mediaRecorder.stop();
      
      // Stop all tracks to clean up
      stream.getTracks().forEach(track => track.stop());
      
    } catch (error) {
      console.error('Error creating video:', error);
      
      // Fallback to GIF-style export if WebM fails
      await exportVideoFallback();
    } finally {
      setIsRecording(false);
    }
  };

  // Fallback method for browsers that don't support MediaRecorder
  const exportVideoFallback = async () => {
    if (!chartRef.current) return;
    
    const frames: string[] = [];
    const totalFrames = 30;
    
    try {
      // Restart animation and capture frames
      setAnimationKey(prev => prev + 1);
      await new Promise(resolve => setTimeout(resolve, 100));
      
      for (let i = 0; i < totalFrames; i++) {
        await new Promise(resolve => setTimeout(resolve, 100));
        const canvas = chartRef.current.canvas;
        
        // Create theme-aware frame
        const frameCanvas = document.createElement('canvas');
        frameCanvas.width = canvas.width;
        frameCanvas.height = canvas.height;
        const frameCtx = frameCanvas.getContext('2d');
        
        if (frameCtx) {
          frameCtx.fillStyle = theme === 'dark' ? '#1e293b' : '#ffffff';
          frameCtx.fillRect(0, 0, frameCanvas.width, frameCanvas.height);
          frameCtx.drawImage(canvas, 0, 0);
          frames.push(frameCanvas.toDataURL('image/png'));
        }
      }
      
      // Create a simple animated PNG sequence (fallback)
      const link = document.createElement('a');
      link.href = frames[frames.length - 1]; // Last frame as fallback
      link.download = `chart-animation-fallback-${theme}-mode-${new Date().toISOString().split('T')[0]}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log(`Created fallback animation with ${frames.length} frames`);
    } catch (error) {
      console.error('Fallback export failed:', error);
    }
  };

  return (
    <div ref={containerRef} className={`${themeStyles.cardBackground} rounded-3xl p-8 shadow-2xl ${themeStyles.border} border`}>
      {/* Header Section */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <p className={`${themeStyles.textSecondary} text-sm mb-4`}>
            Vertical bar chart displaying model comparison data across different metrics. 
            Y-axis represents performance values, X-axis shows model names.
          </p>
        </div>
        
        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
            theme === 'light' 
              ? 'bg-gray-200 hover:bg-gray-300 text-gray-800' 
              : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
          }`}
        >
          {theme === 'light' ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              <span className="text-sm font-medium">Dark</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="text-sm font-medium">Light</span>
            </>
          )}
        </button>
      </div>

      {/* Chart Controls - Show only if chart is displayed */}
      {shouldShowChart && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Color Theme */}
        <div>
          <label className={`flex items-center space-x-3 text-sm font-semibold ${themeStyles.textSecondary} mb-3`}>
            <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
            <span>Color Theme</span>
          </label>
          <select
            value={colorTheme}
            onChange={(e) => setColorTheme(e.target.value as ColorTheme)}
            className={`w-full ${theme === 'dark' ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
          >
            <option value="modern">Modern</option>
            <option value="vibrant">Vibrant</option>
            <option value="pastel">Pastel</option>
            <option value="professional">Professional</option>
            <option value="gradient">Gradient</option>
          </select>
          <div className="flex space-x-2 mt-3">
            {colorThemes[colorTheme].slice(0, 5).map((color, index) => (
              <div
                key={index}
                className={`w-4 h-4 rounded-full border-2 shadow-sm ${theme === 'dark' ? 'border-slate-600' : 'border-gray-400'}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Animation Style */}
        <div>
          <label className={`flex items-center space-x-3 text-sm font-semibold ${themeStyles.textSecondary} mb-3`}>
            <div className="w-5 h-5 rounded-full bg-gradient-to-r from-green-500 to-teal-500"></div>
            <span>Animation Style</span>
          </label>
          <select
            value={animationStyle}
            onChange={(e) => setAnimationStyle(e.target.value as AnimationStyle)}
            className={`w-full ${theme === 'dark' ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
          >
            <option value="smooth">Smooth Flow</option>
            <option value="bounce">Bounce</option>
            <option value="elastic">Elastic</option>
            <option value="basic">Basic Rise</option>
            <option value="wave">Ocean Wave</option>
            <option value="cascade">Cascade</option>
            <option value="spiral">Spiral</option>
            <option value="heartbeat">Heartbeat</option>
            <option value="zoom">Zoom In</option>
          </select>
        </div>

        {/* Display Options */}
        <div>
          <label className={`flex items-center space-x-3 text-sm font-semibold ${themeStyles.textSecondary} mb-3`}>
            <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
            <span>Display Options</span>
          </label>
          <div className="space-y-3">
            <label className={`flex items-center space-x-3 text-sm ${themeStyles.textSecondary}`}>
              <input
                type="checkbox"
                checked={showLabels}
                onChange={(e) => setShowLabels(e.target.checked)}
                className={`w-4 h-4 rounded ${theme === 'dark' ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-300'} text-blue-600 focus:ring-blue-500 focus:ring-2`}
              />
              <span>Show Labels</span>
            </label>
            <label className={`flex items-center space-x-3 text-sm ${themeStyles.textSecondary}`}>
              <input
                type="checkbox"
                checked={showGridlines}
                onChange={(e) => setShowGridlines(e.target.checked)}
                className={`w-4 h-4 rounded ${theme === 'dark' ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-300'} text-blue-600 focus:ring-blue-500 focus:ring-2`}
              />
              <span>Show Gridlines</span>
            </label>
          </div>
        </div>
      </div>
      )}

      {/* Chart Container - Show only if appropriate */}
      {shouldShowChart ? (
        <div className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'} rounded-2xl p-6 mb-6 border`} style={{ height: '450px' }}>
          <Bar ref={chartRef} key={animationKey} data={chartData} options={options} />
        </div>
      ) : (
        <div className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'} rounded-2xl p-6 mb-6 border`}>
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <svg className={`mx-auto w-12 h-12 mb-3 ${themeStyles.textSecondary}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className={`${themeStyles.textSecondary} text-sm font-medium`}>Chart visualization not suitable for this data</p>
              <p className={`${themeStyles.textSecondary} text-xs mt-1`}>Detailed information is shown in the table below</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        {shouldShowChart && (
          <button
            onClick={replayAnimation}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 border ${
              theme === 'light' 
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300 hover:border-gray-400' 
                : 'bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600 hover:border-gray-500'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="font-medium">Replay</span>
          </button>
        )}

        <button
          onClick={exportData}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 border ${
            theme === 'light'
              ? 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 hover:border-blue-300'
              : 'bg-blue-900 hover:bg-blue-800 text-blue-200 border-blue-700 hover:border-blue-600'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="font-medium">CSV</span>
        </button>

        {shouldShowChart && (
          <>
            <button
              onClick={exportImage}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 border ${
                theme === 'light'
                  ? 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200 hover:border-green-300'
                  : 'bg-green-900 hover:bg-green-800 text-green-200 border-green-700 hover:border-green-600'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">Image</span>
            </button>

            <button
              onClick={exportVideo}
              disabled={isRecording}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 border disabled:opacity-50 ${
                theme === 'light'
                  ? 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200 hover:border-purple-300 disabled:hover:bg-purple-50'
                  : 'bg-purple-900 hover:bg-purple-800 text-purple-200 border-purple-700 hover:border-purple-600 disabled:hover:bg-purple-900'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">{isRecording ? 'Recording...' : 'Video'}</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
} 