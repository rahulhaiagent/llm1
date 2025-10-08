'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartEvent,
  ActiveElement,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ProcessedModelData } from '@/types/model';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Add global style to ensure tooltips appear above all elements
if (typeof document !== 'undefined') {
  const existingStyle = document.querySelector('#chartjs-tooltip-style');
  if (!existingStyle) {
    const style = document.createElement('style');
    style.id = 'chartjs-tooltip-style';
    style.textContent = `
      .chartjs-tooltip {
        z-index: 9999 !important;
        pointer-events: none !important;
        position: absolute !important;
        opacity: 1 !important;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
      }
      
      .custom-chart-tooltip {
        position: absolute;
        background-color: rgba(17, 24, 39, 0.9);
        color: white;
        padding: 12px;
        border-radius: 8px;
        font-family: Inter, system-ui, sans-serif;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        pointer-events: none;
        z-index: 9999;
        border: 1px solid rgba(255, 255, 255, 0.2);
        transition: opacity 0.15s ease-in-out;
        transform: translate(-50%, 0);
      }
      
      .custom-chart-tooltip h4 {
        margin: 0 0 5px 0;
        font-size: 14px;
        font-weight: normal;
      }
      
      .custom-chart-tooltip p {
        margin: 3px 0;
        font-size: 13px;
      }
    `;
    document.head.appendChild(style);
  }
}

// Define the type for tooltip positioner functions
type TooltipPositionerFunction = (
  elements: readonly ActiveElement[], 
  eventPosition: {x: number; y: number}
) => {x: number; y: number} | false;

// Extend the TooltipPositionerMap interface to include our custom positioner
declare module 'chart.js' {
  interface TooltipPositionerMap {
    aboveBar: TooltipPositionerFunction;
  }
}

// Custom tooltip positioner to ensure tooltip appears above logos
if (typeof Tooltip !== 'undefined' && Tooltip.positioners) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Tooltip.positioners.aboveBar = function(
    elements: readonly ActiveElement[], 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    eventPosition: {x: number; y: number}
  ) {
    if (!elements.length) {
      return false;
    }

    const element = elements[0];
    const position = element.element;
    
    if (!position) {
      return false;
    }
    
    // Get chart dimensions to check for space constraints
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chart = (element as any).chart;
    if (!chart || !chart.chartArea) {
      return {
        x: position.x,
        y: position.y - 40
      };
    }
    
    const chartArea = chart.chartArea;
    
    // Calculate the position based on the bar's position
    // Position tooltip directly above the bar, with enough space for the logo
    let x = position.x;
    
    // Calculate y position to be above the logo (which is 30px above the bar)
    // Logo is positioned at bar.y - 35, so we position tooltip at bar.y - 70
    let y = position.y - 70;
    
    // Check if tooltip would be too close to the top of the chart
    const tooCloseToTop = y < chartArea.top + 20;
    
    // Check if tooltip would be too close to the right edge
    const tooCloseToRight = x > chartArea.right - 100;
    
    // Check if tooltip would be too close to the left edge
    const tooCloseToLeft = x < chartArea.left + 100;
    
    // If too close to top, position to the left or right of the bar instead
    if (tooCloseToTop) {
      // If bar is on the right side of chart, position tooltip to the left
      if (tooCloseToRight) {
        x = position.x - 100;
        y = position.y;
      } 
      // If bar is on the left side of chart, position tooltip to the right
      else if (tooCloseToLeft) {
        x = position.x + 100;
        y = position.y;
      }
      // If bar is in the middle, position tooltip to the left
      else {
        x = position.x - 100;
        y = position.y;
      }
    }
    
    return { x, y };
  };
}

interface VerticalBarChartProps {
  models: ProcessedModelData[];
  title: string;
  subtitle: string;
  metric: 'price' | 'coding' | 'math' | 'speed' | 'safety';
  selectedModels?: string[];
  onModelSelect?: (modelId: string) => void;
  availableModels?: ProcessedModelData[];
}

interface LogoPosition {
  x: number;
  y: number;
  logo: string;
  developer: string;
}

interface CustomTooltip {
  visible: boolean;
  x: number;
  y: number;
  modelName: string;
  value: string;
  provider: string;
  color: string;
}

const VerticalBarChart: React.FC<VerticalBarChartProps> = ({ 
  models, 
  title, 
  subtitle, 
  metric,
  selectedModels = [],
  onModelSelect,
  availableModels = []
}) => {
  const chartRef = useRef<ChartJS<'bar'>>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [logoPositions, setLogoPositions] = useState<LogoPosition[]>([]);
  const [tooltip, setTooltip] = useState<CustomTooltip>({
    visible: false,
    x: 0,
    y: 0,
    modelName: '',
    value: '',
    provider: '',
    color: ''
  });

  // Helper function to wrap long model names
  const wrapModelName = (name: string): string[] => {
    if (!name || typeof name !== 'string') return [''];
    
    // Special case handling for common model patterns
    // Keep version numbers with model names
    
    // Pattern: "Claude 3.7 Sonnet" -> ["Claude 3.7", "Sonnet"]
    const claudeMatch = name.match(/^(Claude\s+\d+\.\d+)\s+(.+)$/);
    if (claudeMatch) {
      return [claudeMatch[1], claudeMatch[2]];
    }
    
    // Pattern: "Gemini 2.5 Pro Preview" -> ["Gemini 2.5 Pro", "Preview"]
    const geminiMatch = name.match(/^(Gemini\s+\d+\.\d+\s+Pro)\s+(.+)$/);
    if (geminiMatch) {
      return [geminiMatch[1], geminiMatch[2]];
    }
    
    // Pattern: "Llama 3.1 In start" -> ["Llama 3.1", "In start"]
    const llamaMatch = name.match(/^(Llama\s+\d+\.\d+)\s+(.+)$/);
    if (llamaMatch) {
      return [llamaMatch[1], llamaMatch[2]];
    }
    
    // Pattern: "GPT-4.1-nano" -> ["GPT-4.1", "nano"]
    const gptMatch = name.match(/^(GPT-\d+\.\d+)[-\s](.+)$/);
    if (gptMatch) {
      return [gptMatch[1], gptMatch[2]];
    }
    
    // If the name is short enough, return it as is
    if (name.length <= (metric === 'safety' ? 10 : 14)) {
      return [name];
    }
    
    // Split by natural word boundaries
    const words = name.split(/[\s.-]+/);
    
    // If we only have one word, return it as is
    if (words.length <= 1) {
      return [name];
    }
    
    // Build lines by combining words, keeping version numbers with their model names
    const lines: string[] = [];
    let currentLine = words[0];
    let hasVersionNumber = /\d+\.\d+/.test(currentLine);
    
    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const isVersionNumber = /^\d+\.\d+$/.test(word);
      
      // Always keep version numbers with the model name
      if (isVersionNumber && currentLine.length < 15) {
        currentLine += ' ' + word;
        hasVersionNumber = true;
        continue;
      }
      
      // If current line has a version number, try to keep the next word with it
      // if it's a short descriptor like "Pro", "In", etc.
      if (hasVersionNumber && word.length < 5 && currentLine.length + word.length < 15) {
        currentLine += ' ' + word;
        continue;
      }
      
      const testLine = currentLine + ' ' + word;
      
      // Check if adding this word would exceed our preferred line length
      if (testLine.length <= (metric === 'safety' ? 10 : 14)) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = word;
        hasVersionNumber = /\d+\.\d+/.test(word);
      }
    }
    
    // Add the last line if it's not empty
    if (currentLine) {
      lines.push(currentLine);
    }
    
    return lines.length > 0 ? lines : [name];
  };

  // Custom plugin for in-bar hover text - simplified version
  const hoverTextPlugin = {
    id: 'hoverText',
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    afterDatasetsDraw: () => {
      // Values inside bars are now hidden since we're using custom tooltips instead
    }
  };

  // Custom plugin to handle custom tooltip
  const customTooltipPlugin = {
    id: 'customTooltip',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    beforeRender: () => {
      // We'll use our own tooltip implementation
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    afterDraw: (_chart: ChartJS<'bar'>) => {
      // We'll use our own tooltip implementation
    }
  };

  // Get data based on metric type
  const getChartData = () => {
    let processedModels: ProcessedModelData[] = [];
    let getValue: (model: ProcessedModelData) => number = () => 0;
    let formatValue: (value: number) => string = (val) => val.toString();
    let isGroupedBar = false;
    
    try {
    switch (metric) {
      case 'price':
        // Get models with both input and output costs
        let priceModels = models
          .filter(model => 
              model.inputCost !== null && 
              model.inputCost !== undefined &&
              typeof model.inputCost === 'number' &&
              model.outputCost !== null && 
              model.outputCost !== undefined &&
              typeof model.outputCost === 'number' &&
              !isNaN(model.inputCost) &&
              !isNaN(model.outputCost)
          )
          .sort((a, b) => {
            const avgA = (Number(a.inputCost) + Number(a.outputCost)) / 2;
            const avgB = (Number(b.inputCost) + Number(b.outputCost)) / 2;
            return avgA - avgB;
          })
            .slice(0, 5);

        // Add selected models if they're not already included
        if (selectedModels && selectedModels.length > 0) {
          const selectedPriceModels = models.filter(model => 
            selectedModels.includes(model.id) &&
              model.inputCost !== null && 
              model.inputCost !== undefined &&
              typeof model.inputCost === 'number' &&
              model.outputCost !== null && 
              model.outputCost !== undefined &&
              typeof model.outputCost === 'number' &&
              !isNaN(model.inputCost) &&
              !isNaN(model.outputCost) &&
            !priceModels.find(pm => pm.id === model.id)
          );
          priceModels = [...priceModels, ...selectedPriceModels].slice(0, 7);
        }

        processedModels = priceModels;
          getValue = (model) => Number(model.inputCost) || 0;
        formatValue = (val) => `$${val.toFixed(2)}`;
        isGroupedBar = true;
        break;
      
      case 'coding':
        let codingModels = models
          .filter(model => {
            return model.codeLMArena !== '-' && 
                   model.codeLMArena !== null && 
                   model.codeLMArena !== 'N/A' &&
                   model.codeLMArena !== undefined &&
                   model.codeLMArena !== '' &&
                   !isNaN(Number(model.codeLMArena));
          })
          .sort((a, b) => Number(b.codeLMArena) - Number(a.codeLMArena))
          .slice(0, 5);

        if (selectedModels && selectedModels.length > 0) {
          const selectedCodingModels = models.filter(model => 
            selectedModels.includes(model.id) &&
            model.codeLMArena !== '-' && 
            model.codeLMArena !== null && 
            model.codeLMArena !== 'N/A' &&
            model.codeLMArena !== undefined &&
            model.codeLMArena !== '' &&
            !isNaN(Number(model.codeLMArena)) &&
            !codingModels.find(cm => cm.id === model.id)
          );
          codingModels = [...codingModels, ...selectedCodingModels].slice(0, 7);
        }

        processedModels = codingModels;
          getValue = (model) => Number(model.codeLMArena) || 0;
        formatValue = (val) => val.toString();
        break;
      
      case 'math':
        let mathModels = models
          .filter(model => {
            return model.mathLiveBench !== '-' && 
                   model.mathLiveBench !== null && 
                   model.mathLiveBench !== 'N/A' &&
                   model.mathLiveBench !== undefined &&
                   model.mathLiveBench !== '' &&
                   !isNaN(parseFloat(String(model.mathLiveBench).replace('%', '')));
          })
          .sort((a, b) => {
            const mathA = parseFloat(String(a.mathLiveBench).replace('%', ''));
            const mathB = parseFloat(String(b.mathLiveBench).replace('%', ''));
            return mathB - mathA;
          })
          .slice(0, 5);

        if (selectedModels && selectedModels.length > 0) {
          const selectedMathModels = models.filter(model => 
            selectedModels.includes(model.id) &&
            model.mathLiveBench !== '-' && 
            model.mathLiveBench !== null && 
            model.mathLiveBench !== 'N/A' &&
            model.mathLiveBench !== undefined &&
            model.mathLiveBench !== '' &&
            !isNaN(parseFloat(String(model.mathLiveBench).replace('%', ''))) &&
            !mathModels.find(mm => mm.id === model.id)
          );
          mathModels = [...mathModels, ...selectedMathModels].slice(0, 7);
        }

        processedModels = mathModels;
          getValue = (model) => parseFloat(String(model.mathLiveBench).replace('%', '')) || 0;
        formatValue = (val) => `${val.toFixed(1)}%`;
        break;
      
      case 'speed':
        let speedModels = models
            .filter(model => model.operationalRank !== null && model.operationalRank !== undefined)
          .sort((a, b) => {
            const getRank = (model: ProcessedModelData) => {
              if (!model.operationalRank) return 999;
                return parseInt(String(model.operationalRank).replace('#', '')) || 999;
            };
            return getRank(a) - getRank(b);
          })
          .slice(0, 5);

        if (selectedModels && selectedModels.length > 0) {
          const selectedSpeedModels = models.filter(model => 
            selectedModels.includes(model.id) &&
            model.operationalRank !== null &&
              model.operationalRank !== undefined &&
            !speedModels.find(sm => sm.id === model.id)
          );
          speedModels = [...speedModels, ...selectedSpeedModels].slice(0, 7);
        }

        processedModels = speedModels;
        getValue = (model) => {
            if (!model.operationalRank) return 0;
            const rank = parseInt(String(model.operationalRank).replace('#', '')) || 999;
            return Math.max(0, 100 - rank);
        };
          formatValue = (val) => `Rank #${Math.max(1, 100 - val)}`;
        break;
      
      case 'safety':
        const safetyModels = models
          .filter(model => 
            model.safetyPercentage !== null && 
            model.safetyPercentage !== undefined
          )
          .sort((a, b) => {
            const rankA = typeof a.safetyRank === 'number' ? a.safetyRank : Infinity;
            const rankB = typeof b.safetyRank === 'number' ? b.safetyRank : Infinity;
            if (rankA !== rankB) return rankA - rankB; // ascending by safety rank
            // fallback by safety score desc
            return (b.safetyPercentage || 0) - (a.safetyPercentage || 0);
          });

        processedModels = safetyModels;
        getValue = (model) => {
          return model.safetyPercentage || 0;
        };
        formatValue = (val) => `${Math.round(val)}%`;
        break;
          
        default:
          processedModels = models.slice(0, 5);
          getValue = () => 0;
          formatValue = (val) => val.toString();
      }
    } catch (error) {
      console.error('Error processing chart data:', error);
      processedModels = [];
    }

    return { processedModels, getValue, formatValue, isGroupedBar };
  };

  const { processedModels, getValue, formatValue, isGroupedBar } = getChartData();

  // Generate colors
  const colors = [
    'rgba(147, 197, 253, 0.8)',   // Light Blue
    'rgba(134, 239, 172, 0.8)',   // Light Green
    'rgba(196, 181, 253, 0.8)',   // Light Purple
    'rgba(253, 186, 116, 0.8)',   // Light Orange
    'rgba(252, 165, 165, 0.8)',   // Light Red
    'rgba(244, 114, 182, 0.8)',   // Light Pink
    'rgba(125, 211, 252, 0.8)',   // Light Sky Blue
    'rgba(167, 243, 208, 0.8)',   // Light Emerald
    'rgba(253, 230, 138, 0.8)',   // Light Yellow
    'rgba(196, 164, 132, 0.8)',   // Light Brown
    'rgba(203, 213, 225, 0.8)',   // Light Gray
  ];

  const borderColors = [
    'rgba(59, 130, 246, 0.6)',    // Blue border
    'rgba(34, 197, 94, 0.6)',     // Green border
    'rgba(139, 92, 246, 0.6)',    // Purple border
    'rgba(251, 146, 60, 0.6)',    // Orange border
    'rgba(239, 68, 68, 0.6)',     // Red border
    'rgba(236, 72, 153, 0.6)',    // Pink border
    'rgba(14, 165, 233, 0.6)',    // Sky Blue border
    'rgba(16, 185, 129, 0.6)',    // Emerald border
    'rgba(245, 158, 11, 0.6)',    // Yellow border
    'rgba(161, 98, 7, 0.6)',      // Brown border
    'rgba(107, 114, 128, 0.6)',   // Gray border
  ];

  // Chart data configuration
  const data = isGroupedBar ? {
    labels: processedModels.map(model => model.name || ''),
    datasets: [
      {
        label: 'Input Cost',
        data: processedModels.map(model => Number(model.inputCost) || 0),
        backgroundColor: 'rgba(147, 197, 253, 0.8)',
        borderColor: 'rgba(59, 130, 246, 0.6)',
        borderWidth: 1.5,
        borderRadius: 8,
        borderSkipped: false,
        hoverBackgroundColor: 'rgba(147, 197, 253, 0.9)',
        hoverBorderColor: 'rgba(59, 130, 246, 0.8)',
        hoverBorderWidth: 2,
        barThickness: 35,
        maxBarThickness: 50,
      },
      {
        label: 'Output Cost',
        data: processedModels.map(model => Number(model.outputCost) || 0),
        backgroundColor: 'rgba(134, 239, 172, 0.8)',
        borderColor: 'rgba(34, 197, 94, 0.6)',
        borderWidth: 1.5,
        borderRadius: 8,
        borderSkipped: false,
        hoverBackgroundColor: 'rgba(134, 239, 172, 0.9)',
        hoverBorderColor: 'rgba(34, 197, 94, 0.8)',
        hoverBorderWidth: 2,
        barThickness: 35,
        maxBarThickness: 50,
      },
    ],
  } : {
    labels: processedModels.map(model => model.name || ''),
    datasets: [
      {
        label: title,
        data: processedModels.map(getValue),
        backgroundColor: colors.slice(0, processedModels.length),
        borderColor: borderColors.slice(0, processedModels.length),
        borderWidth: 1.5,
        borderRadius: 10,
        borderSkipped: false,
        hoverBackgroundColor: colors.slice(0, processedModels.length).map(color => color.replace('0.8', '0.9')),
        hoverBorderWidth: 2,
        barThickness: metric === 'safety' ? 30 : 45,
        maxBarThickness: metric === 'safety' ? 45 : 65,
        categoryPercentage: metric === 'safety' ? 0.9 : 0.85,
        barPercentage: metric === 'safety' ? 0.6 : 0.8
      },
    ],
  };

  // Chart options with type assertion to avoid complex Chart.js typing issues
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 80,
        bottom: 40,
        left: 5,
        right: 5,
      },
    },
    animation: {
      duration: 800,
      easing: 'easeOutQuart' as const,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delay: (context: any) => context.dataIndex * 100,
      onComplete: () => {
        setTimeout(updateLogoPositions, 50);
      },
    },
    plugins: {
      legend: {
        display: isGroupedBar,
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 25,
          font: {
            size: 14,
            family: 'Inter, system-ui, sans-serif',
            weight: '600',
          },
          color: '#374151',
          boxWidth: 12,
          boxHeight: 12,
        },
        align: 'center',
      },
      title: {
        display: false,
      },
      tooltip: {
        enabled: false, // Disable Chart.js tooltips
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          display: true,
          maxRotation: 0,
          minRotation: 0,
          font: {
            size: metric === 'safety' ? 8 : 10,
            family: 'Inter, system-ui, sans-serif',
            weight: '600',
            lineHeight: metric === 'safety' ? 1.1 : 1.2,
          },
          color: '#374151',
          padding: 4,
          maxTicksLimit: 25,
          autoSkip: false,
          callback: function(_value: unknown, index: number): string[] {
            const modelName = processedModels[index]?.name || '';
            return wrapModelName(modelName);
          },
        },
        border: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        max: function(context: { chart: { data: { datasets: Array<{ data: Array<number> }> } } }) {
          if (metric === 'safety') {
            return 100;
          }
          
          try {
            const maxValue = Math.max(...context.chart.data.datasets.flatMap((dataset) => dataset.data));
            return maxValue * 1.25;
          } catch (error) {
            console.error('Error calculating max value:', error);
            return 100;
          }
        },
        grid: {
          color: 'rgba(156, 163, 175, 0.2)',
          lineWidth: 1,
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 12,
            family: 'Inter, system-ui, sans-serif',
            weight: '500',
          },
          color: '#374151',
          padding: 12,
          callback: function(value: number | string) {
            if (isGroupedBar) {
              return `$${Number(value).toFixed(2)}`;
            }
            return formatValue(Number(value));
          },
        },
        border: {
          display: false,
        },
      },
    },
    elements: {
      bar: {
        borderWidth: 2,
        borderSkipped: false,
      },
    },
    interaction: {
      intersect: true,
      mode: 'nearest',
    },
    onHover: (event: ChartEvent, elements: ActiveElement[]) => {
      const chartCanvas = event.native?.target as HTMLCanvasElement;
      if (chartCanvas && elements && elements.length) {
        chartCanvas.style.cursor = 'pointer';
        
        // Show custom tooltip
        const chart = chartRef.current;
        if (chart) {
          const element = elements[0];
          const datasetIndex = element.datasetIndex;
          const index = element.index;
          
          // Get the model data
          const model = processedModels[index];
          if (!model) return;
          
          // Get the value to display
          let value: string;
          if (isGroupedBar) {
            const dataset = chart.data.datasets[datasetIndex];
            const rawValue = dataset.data[index];
            value = `${dataset.label}: $${Number(rawValue).toFixed(2)}`;
          } else {
            const rawValue = chart.data.datasets[datasetIndex].data[index];
            if (metric === 'safety') {
              value = `Safe Responses: ${formatValue(Number(rawValue))}`;
            } else {
              value = `${metric.charAt(0).toUpperCase() + metric.slice(1)}: ${formatValue(Number(rawValue))}`;
            }
          }
          
          // Get the position of the bar
          const barMeta = chart.getDatasetMeta(datasetIndex);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const bar = barMeta.data[index] as any;
          
          // Position tooltip above the bar
          const x = bar.x;
          const y = bar.y - 70; // Position above the logo
          
          // Set tooltip data
          setTooltip({
            visible: true,
            x: x,
            y: y,
            modelName: model.name || '',
            value: value,
            provider: model.developer || '',
            color: colors[index % colors.length]
          });
        }
      } else {
        if (chartCanvas) {
          chartCanvas.style.cursor = 'default';
        }
        // Hide tooltip when not hovering over a bar
        setTooltip(prev => ({ ...prev, visible: false }));
      }
    },
  } as const;

  // Function to calculate logo positions
  const updateLogoPositions = useCallback(() => {
    const chart = chartRef.current;
    const container = containerRef.current;
    if (!chart || !container) return;
    
    try {
    const positions: LogoPosition[] = processedModels.map((model, index) => {
      let logoX: number;
      let logoY: number;

      if (isGroupedBar) {
          const inputMeta = chart.getDatasetMeta(0);
          const outputMeta = chart.getDatasetMeta(1);
        
        const inputBar = inputMeta.data[index];
        const outputBar = outputMeta.data[index];
        
          if (!inputBar || !outputBar) {
            return {
              x: 0,
              y: 0,
              logo: model.developerLogo || '',
              developer: model.developer || '',
            };
          }
          
        const inputBarY = inputBar.y;
        const outputBarY = outputBar.y;
        const centerX = (inputBar.x + outputBar.x) / 2;
          const tallestBarTop = inputBarY <= outputBarY ? inputBarY : outputBarY;
        
          logoX = centerX - 15;
        logoY = tallestBarTop - 30;
      } else {
        const meta = chart.getDatasetMeta(0);
        const bar = meta.data[index];
        
          if (!bar) {
            return {
              x: 0,
              y: 0,
              logo: model.developerLogo || '',
              developer: model.developer || '',
            };
          }
          
          logoX = bar.x - 10;
          logoY = bar.y - 35;
      }
      
      return {
        x: logoX,
        y: logoY,
        logo: model.developerLogo || '',
          developer: model.developer || '',
      };
    });

    setLogoPositions(positions);
    } catch (error) {
      console.error('Error calculating logo positions:', error);
    }
  }, [processedModels, isGroupedBar]);

  // Update positions on window resize
  useEffect(() => {
    const handleResize = () => {
      setTimeout(updateLogoPositions, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateLogoPositions]);

  // Position calculation effects
  useEffect(() => {
    const timer = setTimeout(updateLogoPositions, 600);
    return () => clearTimeout(timer);
  }, [updateLogoPositions]);

  useEffect(() => {
    const timer = setTimeout(updateLogoPositions, 100);
    return () => clearTimeout(timer);
  }, [processedModels.length, updateLogoPositions]);

  // Render component
  return (
    <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow duration-300">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-3xl font-normal text-gray-900 mb-3">{title}</h2>
          <p className="text-gray-700 text-lg font-medium">{subtitle}</p>
        </div>
        
        {/* Model Selection Dropdown */}
        {onModelSelect && availableModels && availableModels.length > 0 && (
          <div className="ml-8 min-w-[220px]">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Add Model ({processedModels.length}/7)
            </label>
            <div className="relative">
              <select
                className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 font-medium transition-all duration-200 appearance-none"
                value=""
                onChange={(e) => {
                  if (e.target.value && processedModels.length < 7) {
                    onModelSelect(e.target.value);
                  }
                }}
                disabled={processedModels.length >= 7}
              >
                <option value="">Select a model...</option>
                {availableModels
                  .filter(model => {
                    const notAlreadySelected = !processedModels.find(pm => pm.id === model.id);
                    
                    switch (metric) {
                      case 'price':
                        return notAlreadySelected && 
                               model.inputCost !== null && typeof model.inputCost === 'number' &&
                               model.outputCost !== null && typeof model.outputCost === 'number';
                      case 'coding':
                        return notAlreadySelected && 
                               model.codeLMArena !== '-' && model.codeLMArena !== null;
                      case 'math':
                        return notAlreadySelected && 
                               model.mathLiveBench !== '-' && model.mathLiveBench !== null;
                      case 'speed':
                        return notAlreadySelected && 
                               model.operationalRank !== null;
                      case 'safety':
                        return notAlreadySelected &&
                               model.safetyPercentage !== null;
                      default:
                        return notAlreadySelected;
                    }
                  })
                  .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
                  .map(model => (
                    <option key={model.id} value={model.id}>
                      {model.name} - {model.developer}
                    </option>
                  ))
                }
              </select>
              {/* Custom dropdown arrow */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            {/* Selected Models List */}
            {selectedModels && selectedModels.length > 0 && (
              <div className="mt-5">
                <p className="text-sm font-semibold text-gray-700 mb-3">Added Models:</p>
                <div className="space-y-2">
                  {selectedModels.map(modelId => {
                    const model = availableModels.find(m => m.id === modelId);
                    if (!model) return null;
                    
                    return (
                      <div key={modelId} className="flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50 px-3 py-2 rounded-lg text-sm border border-indigo-100 hover:from-indigo-100 hover:to-purple-100 transition-all duration-200">
                        <span className="truncate font-medium text-gray-800">{model.name}</span>
                        <button
                          onClick={() => onModelSelect(modelId)}
                          className="ml-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full w-6 h-6 flex items-center justify-center transition-all duration-200 font-bold"
                          title="Remove model"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div ref={containerRef} className="relative h-[500px] w-full bg-gradient-to-b from-white to-slate-50 rounded-xl shadow-sm border border-slate-200 p-1">
        {processedModels.length > 0 ? (
          <>
        <Bar 
          ref={chartRef}
          data={data} 
          options={options}
              plugins={[hoverTextPlugin, customTooltipPlugin]}
        />
        
        {/* Logo overlays */}
        {logoPositions.map((position, index) => (
          <div
                key={`${processedModels[index]?.id || index}-logo`}
            className="absolute transition-opacity duration-500"
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`,
              width: '30px',
              height: '30px',
            }}
          >
            {position.logo ? (
              <Image
                src={position.logo}
                alt={`${position.developer} logo`}
                width={30}
                height={30}
                className="w-full h-full object-contain rounded"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                    <div class="w-full h-full rounded-full flex items-center justify-center text-white font-bold text-sm"
                               style="background-color: ${colors[index] || colors[0]}; border: 2px solid ${borderColors[index] || borderColors[0]}">
                      ${position.developer.charAt(0).toUpperCase()}
                    </div>
                  `;
                      }
                }}
              />
            ) : (
              <div 
                className="w-full h-full rounded-full flex items-center justify-center text-white font-bold text-sm"
                style={{
                      backgroundColor: colors[index] || colors[0],
                      border: `2px solid ${borderColors[index] || borderColors[0]}`,
                }}
              >
                {position.developer.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        ))}
            
            {/* Custom tooltip */}
            {tooltip.visible && (
              <div 
                className="custom-chart-tooltip"
                style={{
                  left: `${tooltip.x}px`,
                  top: `${tooltip.y}px`,
                  opacity: tooltip.visible ? 1 : 0,
                }}
              >
                <h4>{tooltip.modelName}</h4>
                <p>{tooltip.value}</p>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-gray-500 text-lg mb-2">No data available for this metric</p>
              <p className="text-gray-400 text-sm">Try selecting a different metric or check your data source</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Model details below chart or CTA */}
      {processedModels.length > 0 && (
      <div className="mt-8">
        {metric === 'safety' ? (
          // Safety CTA instead of legend
          <div className="text-center">
         
          </div>
        ) : isGroupedBar ? (
          // Price chart legend with input/output info
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-12 mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 rounded-lg" style={{ backgroundColor: 'rgba(147, 197, 253, 0.8)' }}></div>
                <span className="text-sm font-semibold text-gray-700">Input Cost</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 rounded-lg" style={{ backgroundColor: 'rgba(134, 239, 172, 0.8)' }}></div>
                <span className="text-sm font-semibold text-gray-700">Output Cost</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {processedModels.map((model, index) => (
                <div 
                  key={model.id}
                  className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-3 border border-gray-200 hover:shadow-md hover:from-gray-50 hover:to-gray-100 transition-all duration-300 group"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-sm font-bold text-indigo-600 bg-indigo-100 rounded-full w-7 h-7 flex items-center justify-center">#{index + 1}</span>
                    <h3 className="font-normal text-gray-900 text-sm truncate group-hover:text-indigo-700 transition-colors">{model.name}</h3>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Input:</span>
                        <span className="font-bold text-indigo-600">${Number(model.inputCost || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Output:</span>
                        <span className="font-bold text-orange-600">${Number(model.outputCost || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center border-t pt-3">
                      <span className="text-gray-700 font-semibold">Avg:</span>
                      <span className="font-bold text-gray-900 text-base">
                          ${((Number(model.inputCost || 0) + Number(model.outputCost || 0)) / 2).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-gray-500 truncate text-xs font-medium bg-gray-100 px-2 py-1 rounded-lg">{model.developer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Regular chart legend
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {processedModels.map((model, index) => (
              <div 
                key={model.id}
                className="flex items-center space-x-4 p-4 rounded-xl border border-gray-200 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-300 group bg-white shadow-sm"
              >
                <div 
                  className="w-5 h-5 rounded-lg shadow-sm"
                  style={{ 
                      background: `linear-gradient(135deg, ${colors[index] || colors[0]}, ${borderColors[index] || borderColors[0]})` 
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-normal text-gray-900 truncate group-hover:text-indigo-700 transition-colors">
                    {model.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate font-medium">
                    {model.developer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      )}
    </div>
  );
};

export default VerticalBarChart; 