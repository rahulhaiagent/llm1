'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ProcessedModelData, ModelData } from '@/types/model';
import { processModelData } from '@/lib/data-processor';
import rawModelDataJson from '@/data/models.json';
import { ArrowLeft, GitCompare, ChevronRight, TrendingUp, DollarSign, Shield, Zap, Calendar, HardDrive, Award, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import Navigation from '../../components/Navigation';
import ComparisonRadarChart from '@/components/ComparisonRadarChart';
import MultiModelBenchmarkChart from '@/components/MultiModelBenchmarkChart';

// Process the model data directly like in the main page
const rawModelData = rawModelDataJson as ModelData[];
const modelData = processModelData(rawModelData);

interface Benchmark {
  name: string;
  key: string;
  unit: string;
  getValue: (model: ProcessedModelData) => number | null;
  higherIsBetter: boolean;
  formatValue: (val: number) => string;
}

interface ComparisonMetricProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value1: string | number | null;
  value2: string | number | null;
  higherIsBetter?: boolean;
  description?: string;
}

const ComparePage: React.FC = () => {
  const [models] = useState<ProcessedModelData[]>(modelData);
  const [model1, setModel1] = useState<ProcessedModelData | null>(null);
  const [model2, setModel2] = useState<ProcessedModelData | null>(null);
  const [selectedModels, setSelectedModels] = useState<ProcessedModelData[]>([]);

  const handleModel1Change = (modelId: string) => {
    const selectedModel = models.find(m => m.id === modelId) || null;
    setModel1(selectedModel);
    updateSelectedModels(selectedModel, model2);
  };

  const handleModel2Change = (modelId: string) => {
    const selectedModel = models.find(m => m.id === modelId) || null;
    setModel2(selectedModel);
    updateSelectedModels(model1, selectedModel);
  };

  const updateSelectedModels = (m1: ProcessedModelData | null, m2: ProcessedModelData | null) => {
    const newSelectedModels: ProcessedModelData[] = [];
    if (m1) newSelectedModels.push(m1);
    if (m2) newSelectedModels.push(m2);
    setSelectedModels(newSelectedModels);
  };

  const clearComparison = () => {
    setModel1(null);
    setModel2(null);
    setSelectedModels([]);
  };

  const swapModels = () => {
    const temp = model1;
    setModel1(model2);
    setModel2(temp);
    // No need to update selectedModels as they contain the same models, just in different order
  };

  // Comparison Chart Component
  const ComparisonChart = ({ model1, model2 }: { model1: ProcessedModelData; model2: ProcessedModelData }) => {
    const model1Color = '#3b82f6'; // Blue for model 1
    const model2Color = '#8b5cf6'; // Purple for model 2

    const benchmarks = [
      {
        name: 'Input Price',
        key: 'inputCost',
        unit: '$',
        getValue: (model: ProcessedModelData) => model.inputCost,
        higherIsBetter: false,
        formatValue: (val: number) => `$${val.toFixed(2)}`
      },
      {
        name: 'Output Price',
        key: 'outputCost',
        unit: '$',
        getValue: (model: ProcessedModelData) => model.outputCost,
        higherIsBetter: false,
        formatValue: (val: number) => `$${val.toFixed(2)}`
      },
      {
        name: 'Context Length',
        key: 'contextLength',
        unit: 'tokens',
        getValue: (model: ProcessedModelData) => {
          if (!model.contextLength || model.contextLength === '-') return null;
          const match = model.contextLength.match(/(\d+(?:,\d+)*(?:\.\d+)?)\s*([KMB]?)/i);
          if (!match) return null;
          const num = parseFloat(match[1].replace(/,/g, ''));
          const unit = match[2].toUpperCase();
          const multipliers: { [key: string]: number } = { 'K': 1e3, 'M': 1e6, 'B': 1e9 };
          return num * (multipliers[unit] || 1);
        },
        higherIsBetter: true,
        formatValue: (val: number) => {
          if (val >= 1e6) return `${(val / 1e6).toFixed(1)}M`;
          if (val >= 1e3) return `${(val / 1e3).toFixed(0)}K`;
          return val.toString();
        }
      },
      {
        name: 'Code LM Arena',
        key: 'codeLMArena',
        unit: 'score',
        getValue: (model: ProcessedModelData) => model.codeLMArena !== '-' ? Number(model.codeLMArena) : null,
        higherIsBetter: true,
        formatValue: (val: number) => val.toString()
      },
      {
        name: 'Math LiveBench',
        key: 'mathLiveBench',
        unit: '%',
        getValue: (model: ProcessedModelData) => model.mathLiveBench !== '-' ? parseFloat(model.mathLiveBench.toString().replace('%', '')) : null,
        higherIsBetter: true,
        formatValue: (val: number) => `${val.toFixed(1)}%`
      },
      {
        name: 'GPQA',
        key: 'gpqa',
        unit: '%',
        getValue: (model: ProcessedModelData) => model.gpqa !== '-' && model.gpqa ? parseFloat(model.gpqa.toString().replace('%', '')) : null,
        higherIsBetter: true,
        formatValue: (val: number) => `${val.toFixed(1)}%`
      },
      {
        name: 'Latency',
        key: 'latency',
        unit: 's',
        getValue: (model: ProcessedModelData) => {
          if (!model.latency || model.latency === '-') return null;
          // Extract number from strings like "~0.2s", "~2-3s", "~22.8s"
          const match = model.latency.match(/~?([\d.]+)(?:-[\d.]+)?s?/);
          return match ? parseFloat(match[1]) : null;
        },
        higherIsBetter: false, // Lower latency is better
        formatValue: (val: number) => `~${val}s`
      },
      {
        name: 'Safe Responses',
        key: 'safeResponses',
        unit: '%',
        getValue: (model: ProcessedModelData) => model.safetyPercentage !== null ? model.safetyPercentage : model.safeResponses,
        higherIsBetter: true,
        formatValue: (val: number) => `${val.toFixed(1)}%`
      },
      // {
      //   name: 'Unsafe Responses',
      //   key: 'unsafeResponses',
      //   unit: '%',
      //   getValue: (model: ProcessedModelData) => model.unsafeResponses,
      //   higherIsBetter: false,
      //   formatValue: (val: number) => `${val.toFixed(1)}%`
      // },
      {
        name: 'Jailbreaking Resistance',
        key: 'jailbreakingResistance',
        unit: '%',
        getValue: (model: ProcessedModelData) => model.jailbreakingResistancePercentage !== null ? model.jailbreakingResistancePercentage : model.jailbreakingResistance,
        higherIsBetter: true,
        formatValue: (val: number) => `${val.toFixed(1)}%`
      }
    ];

    // Filter benchmarks to only show those where at least one model has data
    const availableBenchmarks = benchmarks.filter(benchmark => {
      const val1 = benchmark.getValue(model1);
      const val2 = benchmark.getValue(model2);
      return val1 !== null || val2 !== null;
    });

    if (availableBenchmarks.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-[1.5em] font-normal text-gray-900 mb-2">No Benchmark Data Available</h3>
          <p className="text-gray-500">No comparable benchmark data is available for these models.</p>
        </div>
      );
    }

    // Calculate max values for normalization
    const getMaxValue = (benchmark: Benchmark) => {
      const val1 = benchmark.getValue(model1);
      const val2 = benchmark.getValue(model2);
      const values = [val1, val2].filter(v => v !== null) as number[];
      return values.length > 0 ? Math.max(...values) : 1;
    };

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <h3 className="text-[1.5em] font-normal text-gray-900">Benchmark Comparison</h3>
          </div>
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: model1Color }}></div>
              <span className="text-gray-700 font-medium">{model1.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: model2Color }}></div>
              <span className="text-gray-700 font-medium">{model2.name}</span>
            </div>
          </div>
        </div>
        
        <div 
          className="grid gap-8"
          style={{
            gridTemplateColumns: `repeat(${Math.min(availableBenchmarks.length, 8)}, minmax(0, 1fr))`,
          }}
        >
          {availableBenchmarks.map((benchmark) => {
            const val1 = benchmark.getValue(model1);
            const val2 = benchmark.getValue(model2);
            const maxVal = getMaxValue(benchmark);
            
            // Calculate bar heights - higher values should always result in taller bars
            const normalizeValue = (val: number | null) => {
              if (val === null) return 20; // Small height for missing data
              return (val / maxVal) * 120; // Taller bar for higher values
            };

            const height1 = normalizeValue(val1);
            const height2 = normalizeValue(val2);

            return (
              <div key={benchmark.key} className="flex flex-col items-center">
                <div className="flex items-end justify-center space-x-3 h-40 mb-4">
                  {/* Model 1 Bar */}
                  <div className="flex flex-col items-center">
                    <div 
                      className="w-10 rounded-lg transition-all duration-700 ease-out relative group shadow-sm hover:shadow-md"
                      style={{ 
                        height: `${height1}px`,
                        backgroundColor: val1 !== null ? model1Color : '#e5e7eb',
                        opacity: val1 !== null ? 1 : 0.5
                      }}
                    >
                      {val1 !== null && (
                        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap z-20 shadow-lg">
                          {benchmark.formatValue(val1)}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-t-3 border-transparent border-t-gray-900"></div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Model 2 Bar */}
                  <div className="flex flex-col items-center">
                    <div 
                      className="w-10 rounded-lg transition-all duration-700 ease-out relative group shadow-sm hover:shadow-md"
                      style={{ 
                        height: `${height2}px`,
                        backgroundColor: val2 !== null ? model2Color : '#e5e7eb',
                        opacity: val2 !== null ? 1 : 0.5
                      }}
                    >
                      {val2 !== null && (
                        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap z-20 shadow-lg">
                          {benchmark.formatValue(val2)}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-t-3 border-transparent border-t-gray-900"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-700 text-center">{benchmark.name}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const ComparisonMetric = ({ 
    icon: Icon, 
    label, 
    value1, 
    value2, 
    description 
  }: Omit<ComparisonMetricProps, 'higherIsBetter'>) => {
    return (
      <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
        <div className="flex items-center space-x-3 flex-1">
          <Icon className="w-5 h-5 text-gray-500" />
          <div>
            <div className="font-medium text-gray-900">{label}</div>
            {description && <div className="text-sm text-gray-500">{description}</div>}
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="text-right px-3 py-2 rounded-lg min-w-[100px] text-gray-700">
            {value1 || 'N/A'}
          </div>
          
          <div className="text-gray-400">vs</div>
          
          <div className="text-right px-3 py-2 rounded-lg min-w-[100px] text-gray-700">
            {value2 || 'N/A'}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="mx-auto w-full max-w-[1400px] px-2 sm:px-3 lg:px-4 py-12">
        {/* Back button */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Leaderboard
          </Link>
        </div>
        
        {/* Page Title */}
        <div className="mb-12 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl font-normal mb-6 text-gray-900 tracking-tight leading-tight">Interactive Model Comparison</h1>
          <p className="text-xl text-gray-700 mb-4 font-medium">Select models to compare their performance across different evaluation categories.</p>
        </div>
        
        {/* Model Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <GitCompare className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-normal text-gray-900">Select Models to Compare</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Model 1 Selection */}
            <div>
              <label htmlFor="model1" className="block text-sm font-medium text-gray-700 mb-2">Model 1</label>
              <select
                id="model1"
                value={model1?.id || ''}
                onChange={(e) => handleModel1Change(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a model</option>
                {models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name} ({model.developer})
                  </option>
                ))}
              </select>
            </div>
            
            {/* Model 2 Selection */}
            <div>
              <label htmlFor="model2" className="block text-sm font-medium text-gray-700 mb-2">Model 2</label>
              <select
                id="model2"
                value={model2?.id || ''}
                onChange={(e) => handleModel2Change(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a model</option>
                {models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name} ({model.developer})
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="mt-6 flex justify-center space-x-4">
            <button
              onClick={swapModels}
              disabled={!model1 || !model2}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
              Swap Models
            </button>
            
            <button
              onClick={clearComparison}
              disabled={!model1 && !model2}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear
            </button>
          </div>
        </div>
        
        {/* Comparison Content */}
        {model1 && model2 ? (
          <div className="space-y-12">
            {/* Section 1: Compare the Models */}
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-normal text-gray-900 mb-4 font-roobert">Compare the Models</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Side-by-side comparison of model specifications, features, and detailed information
                </p>
                <div className="w-20 h-0.5 bg-gradient-to-r from-holistic-cerulean to-holistic-blurple rounded-full mx-auto mt-4"></div>
              </div>

              {/* Model Headers */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center space-x-4">
                    {model1.developerLogo && (
                      <Image 
                        src={model1.developerLogo} 
                        alt={`${model1.developer} logo`}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-normal text-gray-900">{model1.name}</h3>
                      <p className="text-gray-600">{model1.developer}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>{model1.size}</span>
                        <span>•</span>
                        <span>{model1.released}</span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-700 text-sm leading-relaxed">{model1.description}</p>
                  <div className="mt-4">
                    <Link 
                      href={`/model/${model1.id}`}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Learn More
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center space-x-4">
                    {model2.developerLogo && (
                      <Image 
                        src={model2.developerLogo} 
                        alt={`${model2.developer} logo`}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-normal text-gray-900">{model2.name}</h3>
                      <p className="text-gray-600">{model2.developer}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>{model2.size}</span>
                        <span>•</span>
                        <span>{model2.released}</span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-700 text-sm leading-relaxed">{model2.description}</p>
                  <div className="mt-4">
                    <Link 
                      href={`/model/${model2.id}`}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Learn More
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Compare the Benchmarks */}
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-normal text-gray-900 mb-4 font-roobert">Compare the Benchmarks</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Performance metrics, safety scores, and technical benchmark comparisons
                </p>
                <div className="w-20 h-0.5 bg-gradient-to-r from-holistic-amethyst to-holistic-blurple rounded-full mx-auto mt-4"></div>
              </div>

              {/* Radar Chart Comparison */}
              <div className="mb-8">
                <h3 className="text-xl font-normal text-gray-900 mb-6">Performance Radar Comparison</h3>
                <ComparisonRadarChart selectedModels={selectedModels} />
              </div>

              {/* Bar Chart Comparison */}
              <ComparisonChart model1={model1} model2={model2} />
              
              {/* Detailed Metrics Comparison */}
              <div className="space-y-8">
                {/* Performance Metrics */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-normal text-gray-900">Performance Benchmarks</h3>
                  </div>
                </div>
                <div className="p-6">
                  <ComparisonMetric
                    icon={BarChart3}
                    label="Code LM Arena"
                    value1={model1.codeLMArena}
                    value2={model2.codeLMArena}
                    description="Coding capability ranking"
                  />
                  <ComparisonMetric
                    icon={Award}
                    label="Math Live Bench"
                    value1={model1.mathLiveBench}
                    value2={model2.mathLiveBench}
                    description="Mathematical reasoning performance"
                  />
                  <ComparisonMetric
                    icon={Award}
                    label="Code Live Bench"
                    value1={model1.codeLiveBench}
                    value2={model2.codeLiveBench}
                    description="Live coding benchmark"
                  />
                  <ComparisonMetric
                    icon={Award}
                    label="GPQA"
                    value1={model1.gpqa}
                    value2={model2.gpqa}
                    description="Graduate-level Problem-solving Quality Assessment"
                  />
                  <ComparisonMetric
                    icon={Zap}
                    label="Latency"
                    value1={model1.latency}
                    value2={model2.latency}
                    description="Response time (TTFT - Time To First Token)"
                  />
                  <ComparisonMetric
                    icon={Zap}
                    label="Operational Rank"
                    value1={model1.operationalRank ? `#${model1.operationalRank}` : 'N/A'}
                    value2={model2.operationalRank ? `#${model2.operationalRank}` : 'N/A'}
                    description="Overall operational performance"
                  />
                </div>
              </div>

              {/* Cost Analysis */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-normal text-gray-900">Cost Analysis</h3>
                  </div>
                </div>
                <div className="p-6">
                  <ComparisonMetric
                    icon={DollarSign}
                    label="Input Cost"
                    value1={model1.inputCost ? `$${model1.inputCost.toFixed(2)}` : 'N/A'}
                    value2={model2.inputCost ? `$${model2.inputCost.toFixed(2)}` : 'N/A'}
                    description="Per 1M input tokens"
                  />
                  <ComparisonMetric
                    icon={DollarSign}
                    label="Output Cost"
                    value1={model1.outputCost ? `$${model1.outputCost.toFixed(2)}` : 'N/A'}
                    value2={model2.outputCost ? `$${model2.outputCost.toFixed(2)}` : 'N/A'}
                    description="Per 1M output tokens"
                  />
                  <ComparisonMetric
                    icon={DollarSign}
                    label="Average Cost"
                    value1={model1.inputCost && model1.outputCost ? `$${((model1.inputCost + model1.outputCost) / 2).toFixed(2)}` : 'N/A'}
                    value2={model2.inputCost && model2.outputCost ? `$${((model2.inputCost + model2.outputCost) / 2).toFixed(2)}` : 'N/A'}
                    description="Average of input and output costs"
                  />
                </div>
              </div>

              {/* Safety & Security */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg font-normal text-gray-900">Safety & Security</h3>
                  </div>
                </div>
                <div className="p-6">
                  <ComparisonMetric
                    icon={Shield}
                    label="Safety Rank"
                    value1={model1.safetyRank ? `#${model1.safetyRank}` : 'N/A'}
                    value2={model2.safetyRank ? `#${model2.safetyRank}` : 'N/A'}
                    description="Overall safety performance"
                  />
                  <ComparisonMetric
                    icon={Shield}
                    label="Safe Responses"
                    value1={model1.safetyPercentage !== null ? (
                      `${model1.safetyPercentage}%${model1.totalPrompts ? ` (${model1.safeResponses} out of ${model1.totalPrompts} prompts)` : ''}` 
                    ) : (
                      `${model1.safeResponses}%${model1.totalPrompts ? ` (${model1.totalPrompts} prompts)` : ''}` 
                    )}
                    value2={model2.safetyPercentage !== null ? (
                      `${model2.safetyPercentage}%${model2.totalPrompts ? ` (${model2.safeResponses} out of ${model2.totalPrompts} prompts)` : ''}` 
                    ) : (
                      `${model2.safeResponses}%${model2.totalPrompts ? ` (${model2.totalPrompts} prompts)` : ''}` 
                    )}
                    description="Percentage of safe responses to harmful prompts"
                  />
                  <ComparisonMetric
                    icon={Shield}
                    label="Jailbreaking Resistance"
                    value1={model1.jailbreakingResistancePercentage !== null ? (
                      `${model1.jailbreakingResistancePercentage}%${model1.jailbreakingPrompts ? ` (${model1.jailbreakingSafeResponses} out of ${model1.jailbreakingPrompts} attempts)` : ''}` 
                    ) : (
                      `${model1.jailbreakingSafeResponses}%${model1.jailbreakingPrompts ? ` (${model1.jailbreakingPrompts} attempts)` : ''}` 
                    )}
                    value2={model2.jailbreakingResistancePercentage !== null ? (
                      `${model2.jailbreakingResistancePercentage}%${model2.jailbreakingPrompts ? ` (${model2.jailbreakingSafeResponses} out of ${model2.jailbreakingPrompts} attempts)` : ''}` 
                    ) : (
                      `${model2.jailbreakingSafeResponses}%${model2.jailbreakingPrompts ? ` (${model2.jailbreakingPrompts} attempts)` : ''}` 
                    )}
                    description="Resistance to jailbreaking attempts"
                  />
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <HardDrive className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-normal text-gray-900">Technical Specifications</h3>
                  </div>
                </div>
                <div className="p-6">
                  <ComparisonMetric
                    icon={HardDrive}
                    label="Context Length"
                    value1={model1.contextLength}
                    value2={model2.contextLength}
                    description="Maximum context window"
                  />
                  <ComparisonMetric
                    icon={Calendar}
                    label="Knowledge Cutoff"
                    value1={model1.cutoffKnowledge}
                    value2={model2.cutoffKnowledge}
                    description="Training data cutoff date"
                  />
                  <ComparisonMetric
                    icon={HardDrive}
                    label="License"
                    value1={model1.license}
                    value2={model2.license}
                    description="Model licensing terms"
                  />
                </div>
              </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Multi-Model Benchmark Comparison Section */}
        <div className="mt-12">
          <MultiModelBenchmarkChart models={models} />
        </div>
      </main>
    </div>
  );
};

export default ComparePage; 