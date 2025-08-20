'use client';

import React, { useState } from 'react';
import { ProcessedModelData } from '@/types/model';
import VerticalBarChart from './VerticalBarChart';
import { ChevronDown, BarChart3, X } from 'lucide-react';

interface CustomComparisonChartProps {
  models: ProcessedModelData[];
}

type BenchmarkType = 'price' | 'coding' | 'math' | 'speed' | 'safety';

interface BenchmarkOption {
  id: BenchmarkType;
  name: string;
  description: string;
  icon: string;
}

const benchmarkOptions: BenchmarkOption[] = [
  {
    id: 'price',
    name: 'Price Comparison',
    description: 'Compare input and output costs per million tokens',
    icon: '💰'
  },
  {
    id: 'coding',
    name: 'Coding Performance',
    description: 'Based on CodeLMArena scores',
    icon: '💻'
  },
  {
    id: 'math',
    name: 'Math Performance',
    description: 'Based on MathLiveBench scores',
    icon: '🔢'
  },
  {
    id: 'speed',
    name: 'Speed Performance',
    description: 'Based on operational rankings',
    icon: '⚡'
  },
  {
    id: 'safety',
    name: 'Safety Performance',
    description: 'Based on red teaming safety assessments',
    icon: '🛡️'
  }
];

const CustomComparisonChart: React.FC<CustomComparisonChartProps> = ({ models }) => {
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [selectedBenchmark, setSelectedBenchmark] = useState<BenchmarkType>('coding');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isBenchmarkDropdownOpen, setIsBenchmarkDropdownOpen] = useState(false);

  // Filter models based on selected benchmark to only show those with data
  const getAvailableModels = () => {
    return models.filter(model => {
      switch (selectedBenchmark) {
        case 'price':
          return model.inputCost !== null && 
                 model.inputCost !== undefined &&
                 typeof model.inputCost === 'number' &&
                 model.outputCost !== null && 
                 model.outputCost !== undefined &&
                 typeof model.outputCost === 'number' &&
                 !isNaN(model.inputCost) &&
                 !isNaN(model.outputCost);
        case 'coding':
          return model.codeLMArena !== '-' && 
                 model.codeLMArena !== null && 
                 model.codeLMArena !== 'N/A' &&
                 model.codeLMArena !== undefined &&
                 model.codeLMArena !== '' &&
                 !isNaN(Number(model.codeLMArena));
        case 'math':
          return model.mathLiveBench !== '-' && 
                 model.mathLiveBench !== null && 
                 model.mathLiveBench !== 'N/A' &&
                 model.mathLiveBench !== undefined &&
                 model.mathLiveBench !== '' &&
                 !isNaN(parseFloat(String(model.mathLiveBench).replace('%', '')));
        case 'speed':
          return model.operationalRank !== null && 
                 model.operationalRank !== undefined;
        case 'safety':
          return model.safetyPercentage !== null && 
                 model.safetyPercentage !== undefined;
        default:
          return true;
      }
    });
  };

  const availableModels = getAvailableModels();

  // Get selected models as ProcessedModelData objects
  const getSelectedModelsData = () => {
    return selectedModels.map(modelId => 
      models.find(model => model.id === modelId)
    ).filter(model => model !== undefined) as ProcessedModelData[];
  };

  // Handle model selection
  const handleModelSelect = (modelId: string) => {
    setSelectedModels(prev => {
      if (prev.includes(modelId)) {
        // Remove model if already selected
        return prev.filter(id => id !== modelId);
      } else {
        // Add model if not selected and under limit
        if (prev.length < 5) {
          return [...prev, modelId];
        }
        return prev;
      }
    });
  };

  // Handle benchmark change
  const handleBenchmarkChange = (benchmark: BenchmarkType) => {
    setSelectedBenchmark(benchmark);
    setIsBenchmarkDropdownOpen(false);
    // Clear selected models when changing benchmark
    setSelectedModels([]);
  };

  // Reset all selections
  const resetSelection = () => {
    setSelectedModels([]);
    setSelectedBenchmark('coding');
  };

  const selectedBenchmarkOption = benchmarkOptions.find(option => option.id === selectedBenchmark);

  return (
    <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Custom Model Comparison</h2>
          </div>
          <p className="text-gray-700 text-lg font-medium">
            Select up to 5 models and choose a benchmark to compare their performance
          </p>
        </div>

        {/* Reset Button */}
        {(selectedModels.length > 0 || selectedBenchmark !== 'coding') && (
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
            Select Benchmark to Compare
          </label>
          <div className="relative">
            <button
              onClick={() => setIsBenchmarkDropdownOpen(!isBenchmarkDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{selectedBenchmarkOption?.icon}</span>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">{selectedBenchmarkOption?.name}</div>
                  <div className="text-sm text-gray-500">{selectedBenchmarkOption?.description}</div>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isBenchmarkDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isBenchmarkDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto">
                {benchmarkOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleBenchmarkChange(option.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-200 ${
                      selectedBenchmark === option.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                  >
                    <span className="text-2xl">{option.icon}</span>
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">{option.name}</div>
                      <div className="text-sm text-gray-500">{option.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Model Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Select Models to Compare ({selectedModels.length}/5)
          </label>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              disabled={selectedModels.length >= 5}
              className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-gray-700 font-medium">
                {selectedModels.length === 0 ? 'Choose models to compare...' : `${selectedModels.length} model${selectedModels.length > 1 ? 's' : ''} selected`}
              </span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-40 max-h-80 overflow-y-auto">
                {availableModels.length > 0 ? (
                  availableModels
                    .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
                    .map((model) => (
                      <button
                        key={model.id}
                        onClick={() => handleModelSelect(model.id)}
                        className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors duration-200 ${
                          selectedModels.includes(model.id) ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                        }`}
                      >
                        <div className="text-left">
                          <div className="font-semibold text-gray-900">{model.name}</div>
                          <div className="text-sm text-gray-500">{model.developer}</div>
                        </div>
                        {selectedModels.includes(model.id) && (
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">✓</span>
                          </div>
                        )}
                      </button>
                    ))
                ) : (
                  <div className="px-4 py-3 text-gray-500 text-center">
                    No models available for {selectedBenchmarkOption?.name}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selected Models List */}
      {selectedModels.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Models:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {selectedModels.map((modelId) => {
              const model = models.find(m => m.id === modelId);
              if (!model) return null;
              
              return (
                <div key={modelId} className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50 px-3 py-2 rounded-lg border border-blue-100 hover:from-blue-100 hover:to-purple-100 transition-all duration-200">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 text-sm truncate">{model.name}</div>
                    <div className="text-xs text-gray-500 truncate">{model.developer}</div>
                  </div>
                  <button
                    onClick={() => handleModelSelect(modelId)}
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

      {/* Chart */}
      {selectedModels.length > 0 ? (
        <VerticalBarChart
          models={getSelectedModelsData()}
          title={`${selectedBenchmarkOption?.name} Comparison`}
          subtitle={`${selectedBenchmarkOption?.description} - Comparing ${selectedModels.length} model${selectedModels.length > 1 ? 's' : ''}`}
          metric={selectedBenchmark}
        />
      ) : (
        <div className="bg-gradient-to-b from-white to-slate-50 rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="mb-6">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Compare Models?</h3>
              <p className="text-gray-600">
                Select a benchmark and choose up to 5 models to see a detailed comparison using the same beautiful charts from our recommendations page.
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100">
              <p className="text-sm text-gray-700 font-medium">
                💡 <strong>Tip:</strong> Different benchmarks show different aspects of model performance. Choose the one that matches your use case!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Close dropdown when clicking outside */}
      <div
        className={`fixed inset-0 z-30 ${isDropdownOpen || isBenchmarkDropdownOpen ? 'block' : 'hidden'}`}
        onClick={() => {
          setIsDropdownOpen(false);
          setIsBenchmarkDropdownOpen(false);
        }}
      />
    </div>
  );
};

export default CustomComparisonChart; 