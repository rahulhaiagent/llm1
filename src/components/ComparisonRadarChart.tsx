'use client';

import React from 'react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Legend, 
  Tooltip 
} from 'recharts';
import { ProcessedModelData } from '@/types/model';

interface ComparisonRadarChartProps {
  selectedModels: ProcessedModelData[];
}

interface BenchmarkData {
  category: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export default function ComparisonRadarChart({ selectedModels }: ComparisonRadarChartProps) {
  // Model colors for the radar chart
  const modelColors = [
    '#10B981', // Green for first model
    '#8B5CF6', // Purple for second model
    '#3B82F6', // Blue for third model
    '#F59E0B', // Amber for fourth model
    '#EF4444', // Red for fifth model
  ];

  // Benchmark categories to display on the radar chart with scoring functions
  const benchmarkCategories = [
    { 
      key: 'reasoning', 
      label: 'Reasoning',
      getValue: (model: ProcessedModelData) => {
        if (model.reasoning === 'Yes') return 9;
        if (model.reasoning === 'No') return 3;
        return null;
      }
    },
    { 
      key: 'knowledge', 
      label: 'Knowledge',
      getValue: (model: ProcessedModelData) => {
        // Use GPQA as knowledge metric
        if (model.gpqa && model.gpqa !== '-') {
          const match = model.gpqa.toString().match(/(\d+(?:\.\d+)?)/);
          if (match) {
            const percentage = parseFloat(match[1]);
            // Scale percentage to 0-10 range
            return (percentage / 100) * 10;
          }
        }
        return null;
      }
    },
    { 
      key: 'instruction', 
      label: 'Instruction',
      getValue: (model: ProcessedModelData) => {
        // Use contextLength as a proxy for instruction following capability
        if (model.contextLength && model.contextLength !== '-') {
          const match = model.contextLength.match(/(\d+(?:,\d+)*(?:\.\d+)?)\s*([KMB]?)/i);
          if (match) {
            const num = parseFloat(match[1].replace(/,/g, ''));
            const unit = match[2].toUpperCase();
            const multipliers: { [key: string]: number } = { 'K': 1e3, 'M': 1e6, 'B': 1e9 };
            const tokens = num * (multipliers[unit] || 1);
            // Scale log of tokens to 0-10 range (1K tokens -> 3, 32K -> 6, 1M -> 9)
            return Math.min(3 + Math.log10(tokens / 1000) * 2, 10);
          }
        }
        return null;
      }
    },
    { 
      key: 'safety', 
      label: 'Safety',
      getValue: (model: ProcessedModelData) => {
        // Use the new safetyPercentage field if available
        if (model.safetyPercentage !== null) {
          return (model.safetyPercentage / 10);
        }
        
        // Fallback to calculating from safeResponses if needed
        if (model.safeResponses !== null && model.safeResponses !== undefined) {
          // If safeResponses is already a percentage (0-100)
          if (model.safeResponses <= 100) {
            return (model.safeResponses / 10);
          }
          
          // Otherwise calculate percentage from total
          if (model.totalPrompts) {
            return ((model.safeResponses / model.totalPrompts) * 10);
          }
        }
        return null;
      }
    },
    { 
      key: 'math', 
      label: 'Math',
      getValue: (model: ProcessedModelData) => {
        if (model.mathLiveBench && model.mathLiveBench !== '-') {
          const match = model.mathLiveBench.toString().match(/(\d+(?:\.\d+)?)/);
          if (match) {
            const percentage = parseFloat(match[1]);
            // Scale percentage to 0-10 range
            return (percentage / 100) * 10;
          }
        }
        return null;
      }
    },
    { 
      key: 'coding', 
      label: 'Coding',
      getValue: (model: ProcessedModelData) => {
        if (model.codeLiveBench && model.codeLiveBench !== '-') {
          const match = model.codeLiveBench.toString().match(/(\d+(?:\.\d+)?)/);
          if (match) {
            const percentage = parseFloat(match[1]);
            // Scale percentage to 0-10 range
            return (percentage / 100) * 10;
          }
        } else if (model.codeLMArena && model.codeLMArena !== '-') {
          // Scale codeLMArena score (typically 0-2000) to 0-10 range
          const score = Number(model.codeLMArena);
          if (!isNaN(score)) {
            return Math.min(score / 200, 10);
          }
        }
        return null;
      }
    },
    { 
      key: 'writing', 
      label: 'Writing',
      getValue: (model: ProcessedModelData) => {
        // For writing, use a combination of size and features
        let score = 5; // Default middle score
        
        // Adjust based on model size
        if (model.size && model.size !== '-') {
          if (model.size.includes('B')) {
            const match = model.size.match(/(\d+)/);
            if (match) {
              const billions = parseInt(match[1]);
              score += Math.min(billions / 20, 3); // Up to +3 for large models
            }
          }
        }
        
        // Adjust for features
        if (model.features?.structured_outputs) score += 1;
        if (model.features?.multimodal) score += 1;
        
        return Math.min(score, 10);
      }
    },
    { 
      key: 'creativity', 
      label: 'Creativity',
      getValue: (model: ProcessedModelData) => {
        // For creativity, use a combination of model features and size
        let score = 5; // Default middle score
        
        // Adjust based on developer reputation for creative models
        if (['Anthropic', 'OpenAI', 'Google', 'Mistral AI'].includes(model.developer)) {
          score += 1;
        }
        
        // Adjust for features that enable creativity
        if (model.features?.multimodal) score += 2;
        
        // Newer models tend to be more creative
        if (model.released) {
          const year = parseInt(model.released.split('-')[2] || '0');
          if (year >= 24) score += 1;
        }
        
        return Math.min(score, 10);
      }
    },
    { 
      key: 'jailbreaking', 
      label: 'Jailbreaking Resistance',
      getValue: (model: ProcessedModelData) => {
        // Use the new jailbreakingResistancePercentage field if available
        if (model.jailbreakingResistancePercentage !== null) {
          return (model.jailbreakingResistancePercentage / 10);
        }
        
        // Fallback to calculating from jailbreakingSafeResponses if needed
        if (model.jailbreakingSafeResponses !== null && model.jailbreakingSafeResponses !== undefined) {
          // If jailbreakingSafeResponses equals jailbreakingPrompts, it means 100% resistance
          if (model.jailbreakingPrompts && 
              model.jailbreakingSafeResponses === model.jailbreakingPrompts) {
            return 10; // 100% resistance = 10 on the 0-10 scale
          }
          
          // If jailbreakingSafeResponses is already a percentage (0-100)
          if (model.jailbreakingSafeResponses <= 100) {
            return (model.jailbreakingSafeResponses / 10);
          }
          
          // Otherwise calculate percentage from total
          if (model.jailbreakingPrompts) {
            return ((model.jailbreakingSafeResponses / model.jailbreakingPrompts) * 10);
          }
        }
        return null;
      }
    }
  ];

  // Prepare chart data
  const prepareRadarData = () => {
    // Filter categories where all selected models have data
    const availableCategories = benchmarkCategories.filter(category => {
      return selectedModels.every(model => {
        const value = category.getValue(model);
        return value !== null && value !== undefined;
      });
    });

    // Create radar data points
    return availableCategories.map(category => {
      const dataPoint: BenchmarkData = {
        category: category.label
      };

      // Add each model's value for this category
      selectedModels.forEach((model) => {
        const value = category.getValue(model);
        if (value !== null && value !== undefined) {
          dataPoint[model.name] = value;
        }
      });

      return dataPoint;
    });
  };

  const chartData = prepareRadarData();

  // If no models are selected or no common benchmarks, show a message
  if (!selectedModels || selectedModels.length === 0 || chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-gray-500 text-center">
          {selectedModels && selectedModels.length > 0 
            ? "No common benchmark data available for the selected models." 
            : "Select models to compare their benchmark performance."}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="h-[500px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis 
              dataKey="category" 
              tick={{ fill: "#6b7280", fontSize: 12, fontWeight: 500 }}
            />
            <PolarRadiusAxis 
              angle={30} 
              domain={[0, 10]} 
              tick={{ fill: "#6b7280", fontSize: 10 }}
            />
            
            {selectedModels.map((model, index) => (
              <Radar
                key={model.modelId}
                name={model.name}
                dataKey={model.name}
                stroke={modelColors[index % modelColors.length]}
                fill={modelColors[index % modelColors.length]}
                fillOpacity={0.2}
                strokeWidth={2}
                animationBegin={0}
                animationDuration={1500}
                animationEasing="ease-out"
                dot={true}
              />
            ))}
            
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-gray-900 text-white p-3 shadow-lg rounded-lg">
                      <p className="text-sm font-medium mb-1">{payload[0].payload.category}</p>
                      {payload.map((entry) => (
                        <div key={entry.name} className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="text-xs">{entry.name}: <b>{entry.value.toFixed(1)}</b>/10</span>
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            
            <Legend 
              align="center" 
              verticalAlign="bottom" 
              layout="horizontal"
              wrapperStyle={{ paddingTop: '20px' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 