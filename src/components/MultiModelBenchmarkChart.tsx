'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell, LabelList } from 'recharts';
import { ProcessedModelData } from '@/types/model';
import { ChevronDown, BarChart3, X, Shield, Code, Calculator, Zap, DollarSign } from 'lucide-react';
import type { LabelProps } from 'recharts';

interface MultiModelBenchmarkChartProps {
  models: ProcessedModelData[];
}

type BenchmarkCategory = 'safety' | 'coding' | 'math' | 'performance' | 'cost';

interface BenchmarkOption {
  id: string;
  name: string;
  category: BenchmarkCategory;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  getValue: (model: ProcessedModelData) => number | null;
  formatValue: (value: number) => string;
  unit: string;
  higherIsBetter: boolean;
}

const benchmarkOptions: BenchmarkOption[] = [
  // Safety Benchmarks
  {
    id: 'safeResponses',
    name: 'Safe Responses',
    category: 'safety',
    description: 'Percentage of safe responses in safety evaluations',
    icon: Shield,
    getValue: (model) => model.safetyPercentage,
    formatValue: (value) => `${value.toFixed(1)}%`,
    unit: '%',
    higherIsBetter: true
  },
  {
    id: 'jailbreakingResistance',
    name: 'Jailbreaking Resistance',
    category: 'safety',
    description: 'Resistance to jailbreaking attempts',
    icon: Shield,
    getValue: (model) => model.jailbreakingResistancePercentage,
    formatValue: (value) => `${value.toFixed(1)}%`,
    unit: '%',
    higherIsBetter: true
  },
  {
    id: 'unsafeResponses',
    name: 'Unsafe Responses',
    category: 'safety',
    description: 'Percentage of unsafe responses (lower is better)',
    icon: Shield,
    getValue: (model) => {
      if (model.unsafeResponses !== null && model.totalPrompts !== null) {
        return (model.unsafeResponses / model.totalPrompts) * 100;
      }
      return null;
    },
    formatValue: (value) => `${value.toFixed(1)}%`,
    unit: '%',
    higherIsBetter: false
  },
  
  // Coding Benchmarks
  {
    id: 'codeLMArena',
    name: 'Code LM Arena',
    category: 'coding',
    description: 'LMArena coding evaluation score',
    icon: Code,
    getValue: (model) => model.codeLMArena !== '-' ? Number(model.codeLMArena) : null,
    formatValue: (value) => value.toString(),
    unit: 'score',
    higherIsBetter: true
  },
  {
    id: 'codeLiveBench',
    name: 'Code LiveBench',
    category: 'coding',
    description: 'LiveBench coding evaluation percentage',
    icon: Code,
    getValue: (model) => {
      if (model.codeLiveBench && model.codeLiveBench !== '-') {
        return parseFloat(String(model.codeLiveBench).replace('%', ''));
      }
      return null;
    },
    formatValue: (value) => `${value.toFixed(1)}%`,
    unit: '%',
    higherIsBetter: true
  },
  
  // Math Benchmarks
  {
    id: 'mathLiveBench',
    name: 'Math LiveBench',
    category: 'math',
    description: 'LiveBench mathematical reasoning percentage',
    icon: Calculator,
    getValue: (model) => {
      if (model.mathLiveBench && model.mathLiveBench !== '-') {
        return parseFloat(String(model.mathLiveBench).replace('%', ''));
      }
      return null;
    },
    formatValue: (value) => `${value.toFixed(1)}%`,
    unit: '%',
    higherIsBetter: true
  },
  {
    id: 'gpqa',
    name: 'GPQA',
    category: 'math',
    description: 'Graduate-level Google-Proof Q&A performance',
    icon: Calculator,
    getValue: (model) => {
      if (model.gpqa && model.gpqa !== '-') {
        return parseFloat(String(model.gpqa).replace('%', ''));
      }
      return null;
    },
    formatValue: (value) => `${value.toFixed(1)}%`,
    unit: '%',
    higherIsBetter: true
  },
  
  // Performance Benchmarks
  {
    id: 'latency',
    name: 'Latency',
    category: 'performance',
    description: 'Response latency in seconds (lower is better)',
    icon: Zap,
    getValue: (model) => {
      if (model.latency && model.latency !== '-') {
        const match = String(model.latency).match(/~?([\d.]+)(?:-[\d.]+)?s?/);
        return match ? parseFloat(match[1]) : null;
      }
      return null;
    },
    formatValue: (value) => `${value.toFixed(2)}s`,
    unit: 's',
    higherIsBetter: false
  },
  {
    id: 'contextLength',
    name: 'Context Length',
    category: 'performance',
    description: 'Maximum context length in tokens',
    icon: Zap,
    getValue: (model) => {
      if (!model.contextLength || model.contextLength === '-') return null;
      const match = String(model.contextLength).match(/(\d+(?:,\d+)*(?:\.\d+)?)\s*([KMB]?)/i);
      if (!match) return null;
      const num = parseFloat(match[1].replace(/,/g, ''));
      const unit = match[2].toUpperCase();
      const multipliers: { [key: string]: number } = { 'K': 1e3, 'M': 1e6, 'B': 1e9 };
      return num * (multipliers[unit] || 1);
    },
    formatValue: (value) => {
      if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
      if (value >= 1e3) return `${(value / 1e3).toFixed(0)}K`;
      return value.toString();
    },
    unit: 'tokens',
    higherIsBetter: true
  },
  
  // Cost Benchmarks
  {
    id: 'inputCost',
    name: 'Input Cost',
    category: 'cost',
    description: 'Cost per 1M input tokens (lower is better)',
    icon: DollarSign,
    getValue: (model) => model.inputCost,
    formatValue: (value) => {
      if (value < 0.01) return `$${value.toExponential(2)}`;
      return `$${value.toFixed(value < 0.1 ? 3 : 2)}`;
    },
    unit: '$',
    higherIsBetter: false
  },
  {
    id: 'outputCost',
    name: 'Output Cost',
    category: 'cost',
    description: 'Cost per 1M output tokens (lower is better)',
    icon: DollarSign,
    getValue: (model) => model.outputCost,
    formatValue: (value) => {
      if (value < 0.01) return `$${value.toExponential(2)}`;
      return `$${value.toFixed(value < 0.1 ? 3 : 2)}`;
    },
    unit: '$',
    higherIsBetter: false
  }
];

const categoryColors: { [key in BenchmarkCategory]: string } = {
  safety: '#10B981', // Emerald
  coding: '#3B82F6', // Blue
  math: '#8B5CF6', // Purple
  performance: '#F59E0B', // Amber
  cost: '#EF4444', // Red
};



export default function MultiModelBenchmarkChart({ models }: MultiModelBenchmarkChartProps) {
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [selectedBenchmark, setSelectedBenchmark] = useState<string>('codeLMArena');
  const [selectedCategory, setSelectedCategory] = useState<BenchmarkCategory>('coding');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isBenchmarkDropdownOpen, setIsBenchmarkDropdownOpen] = useState(false);
  
  // Refs for dropdown containers
  const benchmarkDropdownRef = useRef<HTMLDivElement>(null);
  const modelDropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (benchmarkDropdownRef.current && !benchmarkDropdownRef.current.contains(event.target as Node)) {
        setIsBenchmarkDropdownOpen(false);
      }
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target as Node)) {
        setIsModelDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const currentBenchmark = benchmarkOptions.find(b => b.id === selectedBenchmark);





  // Get chart data for selected models and benchmark
  const getChartData = () => {
    if (!currentBenchmark || selectedModels.length === 0) return [];
    
    const chartData = selectedModels
      .map(modelId => {
        const model = models.find(m => m.id === modelId);
        if (!model) return null;
        
        const value = currentBenchmark.getValue(model);
        const hasData = value !== null && value !== undefined && !isNaN(value);
        
        return {
          name: model.name,
          displayName: model.name,
          value: hasData ? value : 0, // Show 0 for no data
          developer: model.developer,
          hasData: hasData
        };
      })
      .filter(item => item !== null)
      .sort((a, b) => {
        // Sort models with data first, then by value (high to low)
        if (a.hasData && !b.hasData) return -1;
        if (!a.hasData && b.hasData) return 1;
        if (a.hasData && b.hasData) return b.value - a.value;
        return 0; // Both have no data
      });
    
    return chartData;
  };

  const chartData = getChartData();

  // Handle model selection
  const handleModelSelect = (modelId: string) => {
    setSelectedModels(prev => {
      if (prev.includes(modelId)) {
        return prev.filter(id => id !== modelId);
      } else if (prev.length < 7) {
        return [...prev, modelId];
      }
      return prev;
    });
  };

  // Handle benchmark change
  const handleBenchmarkChange = (benchmarkId: string) => {
    const benchmark = benchmarkOptions.find(b => b.id === benchmarkId);
    if (benchmark) {
      setSelectedBenchmark(benchmarkId);
      setSelectedCategory(benchmark.category);
      setIsBenchmarkDropdownOpen(false);
      // Keep selected models when changing benchmark
      // Don't clear: setSelectedModels([]);
    }
  };

  // Filter benchmarks by category
  const getBenchmarksByCategory = (category: BenchmarkCategory) => {
    return benchmarkOptions.filter(b => b.category === category);
  };

  // Reset selections
  const resetSelection = () => {
    setSelectedModels([]);
    setSelectedBenchmark('codeLMArena');
    setSelectedCategory('coding');
  };

  // Generate colors for bars
  const getBarColor = (index: number) => {
    const colors = [
      '#6EE7B7', // Light Green
      '#93C5FD', // Light Blue
      '#C4B5FD', // Light Purple
      '#FCD34D', // Light Amber
      '#67E8F9', // Light Cyan
      '#FCA5A5', // Light Red
      '#A5B4FC', // Light Indigo
    ];
    return colors[index % colors.length];
  };

  // Custom X-axis tick formatter
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomXAxisTick = (props: any) => {
    const { x, y, payload } = props;
    const modelName = payload.value;
    
    return (
      <g transform={`translate(${x},${y})`}>
        <text 
          x={0} 
          y={0} 
          dy={16} 
          textAnchor="end" 
          fill="#6b7280" 
          fontSize={12}
          transform="rotate(-45)"
          style={{ fontWeight: 500 }}
        >
          {modelName}
        </text>
      </g>
    );
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; payload?: { hasData: boolean } }>; label?: string }) => {
    if (active && payload && payload.length && currentBenchmark) {
      const data = payload[0].payload;
      const hasData = data?.hasData;
      
      return (
        <div className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-sm">
            {currentBenchmark.name}: {hasData ? currentBenchmark.formatValue(payload[0].value) : 'No data'}
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom label for value on top of each bar
  const BarValueLabel = (props: { x?: number; y?: number; value?: number; hasData?: boolean; width?: number }) => {
    const { x, y, value, hasData, width } = props;
    if (!hasData || value === undefined || value === null || !currentBenchmark) return null;
    // Center the label horizontally on the bar
    const centerX = x !== undefined && width !== undefined ? x + width / 2 : x;
    return (
      <text
        x={centerX}
        y={y}
        dy={-4}
        textAnchor="middle"
        fill="#111827"
        fontWeight={600}
        fontSize={14}
        style={{ textShadow: '0 1px 2px #fff' }}
      >
        {currentBenchmark.formatValue(value)}
      </text>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-normal text-gray-900">Compare Multiple Models by Category</h2>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            Choose a single evaluation category — for example, safety, jailbreak resistance, or cost and compare up to seven models to see which performs best in that specific area.
          </p>
        </div>

        {/* Reset Button */}
        {(selectedModels.length > 0 || selectedBenchmark !== 'codeLMArena') && (
          <button
            onClick={resetSelection}
            className="flex items-center space-x-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors duration-200 font-medium"
          >
            <X className="w-4 h-4" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Benchmark Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Select Benchmark
          </label>
          <div className="relative" ref={benchmarkDropdownRef}>
            <button
              onClick={() => setIsBenchmarkDropdownOpen(!isBenchmarkDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                                 <div className="p-2 rounded-lg" style={{ backgroundColor: `${categoryColors[selectedCategory]}20` }}>
                   {selectedCategory === 'safety' && <Shield className="w-4 h-4 text-green-600" />}
                   {selectedCategory === 'coding' && <Code className="w-4 h-4 text-blue-600" />}
                   {selectedCategory === 'math' && <Calculator className="w-4 h-4 text-purple-600" />}
                   {selectedCategory === 'performance' && <Zap className="w-4 h-4 text-amber-600" />}
                   {selectedCategory === 'cost' && <DollarSign className="w-4 h-4 text-red-600" />}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">{currentBenchmark?.name}</div>
                  <div className="text-sm text-gray-500">{currentBenchmark?.description}</div>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isBenchmarkDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isBenchmarkDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto">
                {Object.entries(categoryColors).map(([category, color]) => (
                  <div key={category}>
                    <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                      <div className="flex items-center space-x-2">
                                                 <div className="p-1 rounded" style={{ backgroundColor: `${color}20` }}>
                           {category === 'safety' && <Shield className="w-3 h-3 text-green-600" />}
                           {category === 'coding' && <Code className="w-3 h-3 text-blue-600" />}
                           {category === 'math' && <Calculator className="w-3 h-3 text-purple-600" />}
                           {category === 'performance' && <Zap className="w-3 h-3 text-amber-600" />}
                           {category === 'cost' && <DollarSign className="w-3 h-3 text-red-600" />}
                        </div>
                        <span className="text-sm font-medium text-gray-700 capitalize">{category}</span>
                      </div>
                    </div>
                    {getBenchmarksByCategory(category as BenchmarkCategory).map((benchmark) => (
                      <button
                        key={benchmark.id}
                        onClick={() => handleBenchmarkChange(benchmark.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-200 ${
                          selectedBenchmark === benchmark.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                        }`}
                      >
                        <div className="text-left">
                          <div className="font-medium text-gray-900">{benchmark.name}</div>
                          <div className="text-xs text-gray-500">{benchmark.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Model Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Select Models to Compare ({selectedModels.length}/7)
          </label>
          <div className="relative" ref={modelDropdownRef}>
            <button
              onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              <span className="text-gray-700 font-medium">
                {selectedModels.length === 0 ? 'Choose models to compare...' : `${selectedModels.length} model${selectedModels.length > 1 ? 's' : ''} selected`}
              </span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isModelDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isModelDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-40 max-h-80 overflow-y-auto">
                {models.length > 0 ? (
                  models
                    .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
                    .map((model) => {
                      const hasData = currentBenchmark ? currentBenchmark.getValue(model) !== null : false;
                      const isSelected = selectedModels.includes(model.id);
                      const canSelect = selectedModels.length < 7 || isSelected;
                      
                      return (
                        <button
                          key={model.id}
                          onClick={() => handleModelSelect(model.id)}
                          disabled={!canSelect}
                          className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors duration-200 ${
                            isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                          } ${!canSelect ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <div className="text-left">
                            <div className="font-medium text-gray-900 flex items-center space-x-2">
                              <span>{model.name}</span>
                              {!hasData && currentBenchmark && (
                                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">No data</span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500">{model.developer}</div>
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">✓</span>
                            </div>
                          )}
                        </button>
                      );
                    })
                ) : (
                  <div className="px-4 py-8 text-center text-gray-500">
                    No models available
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 ? (
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {currentBenchmark?.name} Comparison
            </h3>
            <p className="text-sm text-gray-600">
              {currentBenchmark?.description} • {currentBenchmark?.higherIsBetter ? 'Higher is better' : 'Lower is better'}
            </p>
          </div>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart
              data={chartData}
              margin={{ top: 50, right: 20, left: 20, bottom: 100 }} // Increased top and bottom margin
              barCategoryGap="20%" // More space between bars
            >
              <defs>
                {chartData.map((entry, index) => (
                  <linearGradient 
                    key={`gradient-${index}`} 
                    id={`colorBar${index}`} 
                    x1="0" y1="0" 
                    x2="0" y2="1"
                  >
                    <stop offset="0%" stopColor={getBarColor(index)} stopOpacity={0.9} />
                    <stop offset="95%" stopColor={getBarColor(index)} stopOpacity={0.6} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis 
                dataKey="displayName" 
                interval={0}
                height={100}
                tick={<CustomXAxisTick />}
                tickMargin={24} // More space between label and bar
              />
              <YAxis 
                width={80}
                tickFormatter={(value) => currentBenchmark?.formatValue(value) || value}
                fontSize={11}
                tick={{ fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickLine={{ stroke: '#e5e7eb' }}
                tickCount={11}
                domain={[0, 'dataMax']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="value"
                barSize={Math.max(40, Math.min(80, 500 / chartData.length))}
                radius={[4, 4, 0, 0]}
                minPointSize={8}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.hasData ? `url(#colorBar${index})` : '#f3f4f6'} 
                    stroke={entry.hasData ? getBarColor(index) : '#d1d5db'} 
                    strokeWidth={1}
                    opacity={entry.hasData ? 1 : 0.7}
                  />
                ))}
                {/* Value labels on top of each bar */}
                <LabelList
                  dataKey="value"
                  content={(props: LabelProps) => {
                    const { x, y, value, index, width } = props;
                    const entry = typeof index === 'number' ? chartData[index] : undefined;
                    return (
                      <BarValueLabel
                        x={typeof x === 'number' ? x : (typeof x === 'string' ? Number(x) : undefined)}
                        y={typeof y === 'number' ? (y !== undefined ? y : undefined) : (typeof y === 'string' ? Number(y) : undefined)}
                        value={typeof value === 'number' ? value : undefined}
                        hasData={entry?.hasData}
                        width={typeof width === 'number' ? width : undefined}
                      />
                    );
                  }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select Models to Compare</h3>
          <p className="text-gray-500">
            Choose up to 7 models from the dropdown above to see their benchmark comparison
          </p>
        </div>
      )}
    </div>
  );
} 