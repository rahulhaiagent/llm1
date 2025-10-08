'use client';

import React from 'react';
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
import { ProcessedModelData } from '@/types/model';
import { BarChart3, TrendingUp, Award, Zap, DollarSign, Shield } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ComparisonChartProps {
  model1: ProcessedModelData;
  model2: ProcessedModelData;
}

interface BenchmarkData {
  name: string;
  model1Value: number | null;
  model2Value: number | null;
  model1Display: string;
  model2Display: string;
  category: 'performance' | 'cost' | 'safety' | 'operational';
  higherIsBetter: boolean;
  icon: React.ComponentType<{ className?: string }>;
}

const ComparisonChart: React.FC<ComparisonChartProps> = ({ model1, model2 }) => {
  // Prepare benchmark data
  const getBenchmarkData = (): BenchmarkData[] => {
    return [
      // Performance Benchmarks
      {
        name: 'Code LM Arena',
        model1Value: typeof model1.codeLMArena === 'number' ? model1.codeLMArena : null,
        model2Value: typeof model2.codeLMArena === 'number' ? model2.codeLMArena : null,
        model1Display: model1.codeLMArena?.toString() || 'N/A',
        model2Display: model2.codeLMArena?.toString() || 'N/A',
        category: 'performance' as const,
        higherIsBetter: true,
        icon: BarChart3,
      },
      {
        name: 'Math Live Bench',
        model1Value: model1.mathLiveBench !== '-' ? parseFloat(model1.mathLiveBench.replace('%', '')) : null,
        model2Value: model2.mathLiveBench !== '-' ? parseFloat(model2.mathLiveBench.replace('%', '')) : null,
        model1Display: model1.mathLiveBench,
        model2Display: model2.mathLiveBench,
        category: 'performance' as const,
        higherIsBetter: true,
        icon: TrendingUp,
      },
      {
        name: 'Code Live Bench',
        model1Value: model1.codeLiveBench !== '-' ? parseFloat(model1.codeLiveBench.replace('%', '')) : null,
        model2Value: model2.codeLiveBench !== '-' ? parseFloat(model2.codeLiveBench.replace('%', '')) : null,
        model1Display: model1.codeLiveBench,
        model2Display: model2.codeLiveBench,
        category: 'performance' as const,
        higherIsBetter: true,
        icon: Award,
      },
      // Operational Benchmarks
      {
        name: 'Operational Rank',
        model1Value: model1.operationalRank ? 100 - model1.operationalRank : null, // Invert for chart display
        model2Value: model2.operationalRank ? 100 - model2.operationalRank : null,
        model1Display: model1.operationalRank ? `#${model1.operationalRank}` : 'N/A',
        model2Display: model2.operationalRank ? `#${model2.operationalRank}` : 'N/A',
        category: 'operational' as const,
        higherIsBetter: false, // Lower rank number is better
        icon: Zap,
      },
      // Cost Benchmarks
      {
        name: 'Input Cost',
        model1Value: model1.inputCost,
        model2Value: model2.inputCost,
        model1Display: model1.inputCost ? `$${model1.inputCost.toFixed(2)}` : 'N/A',
        model2Display: model2.inputCost ? `$${model2.inputCost.toFixed(2)}` : 'N/A',
        category: 'cost' as const,
        higherIsBetter: false,
        icon: DollarSign,
      },
      {
        name: 'Output Cost',
        model1Value: model1.outputCost,
        model2Value: model2.outputCost,
        model1Display: model1.outputCost ? `$${model1.outputCost.toFixed(2)}` : 'N/A',
        model2Display: model2.outputCost ? `$${model2.outputCost.toFixed(2)}` : 'N/A',
        category: 'cost' as const,
        higherIsBetter: false,
        icon: DollarSign,
      },
      // Safety Benchmarks
      {
        name: 'Safety Rank',
        model1Value: model1.safetyRank ? 100 - model1.safetyRank : null,
        model2Value: model2.safetyRank ? 100 - model2.safetyRank : null,
        model1Display: model1.safetyRank ? `#${model1.safetyRank}` : 'N/A',
        model2Display: model2.safetyRank ? `#${model2.safetyRank}` : 'N/A',
        category: 'safety' as const,
        higherIsBetter: false,
        icon: Shield,
      },
      {
        name: 'Safe Responses',
        model1Value: model1.safeResponses,
        model2Value: model2.safeResponses,
        model1Display: model1.safeResponses?.toString() || 'N/A',
        model2Display: model2.safeResponses?.toString() || 'N/A',
        category: 'safety' as const,
        higherIsBetter: true,
        icon: Shield,
      },
      {
        name: 'Jailbreaking Resistance',
        model1Value: model1.jailbreakingResistance,
        model2Value: model2.jailbreakingResistance,
        model1Display: model1.jailbreakingResistance?.toString() || 'N/A',
        model2Display: model2.jailbreakingResistance?.toString() || 'N/A',
        category: 'safety' as const,
        higherIsBetter: true,
        icon: Shield,
      },
    ].filter(benchmark => 
      benchmark.model1Value !== null || benchmark.model2Value !== null
    );
  };

  const benchmarkData = getBenchmarkData();

  // Group benchmarks by category
  const groupedBenchmarks = benchmarkData.reduce((acc, benchmark) => {
    if (!acc[benchmark.category]) {
      acc[benchmark.category] = [];
    }
    acc[benchmark.category].push(benchmark);
    return acc;
  }, {} as Record<string, BenchmarkData[]>);

  const createChartData = (benchmarks: BenchmarkData[]) => {
    const labels = benchmarks.map(b => b.name);
    
    return {
      labels,
      datasets: [
        {
          label: model1.name,
          data: benchmarks.map(b => b.model1Value || 0),
          backgroundColor: 'rgba(99, 102, 241, 0.8)',
          borderColor: 'rgba(99, 102, 241, 1)',
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        },
        {
          label: model2.name,
          data: benchmarks.map(b => b.model2Value || 0),
          backgroundColor: 'rgba(251, 146, 60, 0.8)',
          borderColor: 'rgba(251, 146, 60, 1)',
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        },
      ],
    };
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            size: 14,
            family: 'Inter, system-ui, sans-serif',
            weight: '600',
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: function(context: any) {
            const benchmarkIndex = context.dataIndex;
            const benchmark = benchmarks[benchmarkIndex];
            const isModel1 = context.datasetIndex === 0;
            const displayValue = isModel1 ? benchmark.model1Display : benchmark.model2Display;
            const modelName = isModel1 ? model1.name : model2.name;
            return `${modelName}: ${displayValue}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
            family: 'Inter, system-ui, sans-serif',
            weight: '500',
          },
          maxRotation: 45,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(156, 163, 175, 0.2)',
        },
        ticks: {
          font: {
            size: 11,
            family: 'Inter, system-ui, sans-serif',
          },
        },
      },
    },
    animation: {
      duration: 800,
      easing: 'easeOutQuart',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delay: (context: any) => context.dataIndex * 100,
    },
  };

  const benchmarks = benchmarkData; // For tooltip callback

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'performance': return 'Performance Benchmarks';
      case 'cost': return 'Cost Efficiency';
      case 'safety': return 'Safety & Security';
      case 'operational': return 'Operational Performance';
      default: return category;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'performance': return Award;
      case 'cost': return DollarSign;
      case 'safety': return Shield;
      case 'operational': return Zap;
      default: return BarChart3;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'performance': return 'from-blue-500 to-indigo-600';
      case 'cost': return 'from-green-500 to-emerald-600';
      case 'safety': return 'from-purple-500 to-violet-600';
      case 'operational': return 'from-orange-500 to-red-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="space-y-8">
      {Object.entries(groupedBenchmarks).map(([category, benchmarks]) => {
        const CategoryIcon = getCategoryIcon(category);
        const colorGradient = getCategoryColor(category);
        
        return (
          <div key={category} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="mb-6">
              <h3 className={`text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${colorGradient} flex items-center mb-2`}>
                <CategoryIcon className="w-6 h-6 mr-3 text-gray-700" />
                {getCategoryTitle(category)}
              </h3>
              <p className="text-gray-600">
                {category === 'performance' && 'Measure coding, math, and reasoning capabilities'}
                {category === 'cost' && 'Compare input and output pricing per million tokens'}
                {category === 'safety' && 'Evaluate safety measures and resistance to attacks'}
                {category === 'operational' && 'Assess speed and operational efficiency'}
              </p>
            </div>
            
            <div className="h-80 mb-6">
              <Bar data={createChartData(benchmarks)} options={chartOptions} />
            </div>
            
            {/* Benchmark Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {benchmarks.map((benchmark, index) => {
                const model1Better = benchmark.model1Value !== null && benchmark.model2Value !== null &&
                  (benchmark.higherIsBetter ? 
                    benchmark.model1Value > benchmark.model2Value : 
                    benchmark.model1Value < benchmark.model2Value);
                
                const model2Better = benchmark.model1Value !== null && benchmark.model2Value !== null &&
                  (benchmark.higherIsBetter ? 
                    benchmark.model2Value > benchmark.model1Value : 
                    benchmark.model2Value < benchmark.model1Value);

                return (
                  <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900 flex items-center">
                        <benchmark.icon className="w-4 h-4 mr-2 text-gray-600" />
                        {benchmark.name}
                      </h4>
                    </div>
                    
                    <div className="space-y-2">
                      <div className={`flex justify-between items-center p-2 rounded-lg ${model1Better ? 'bg-indigo-100 border border-indigo-200' : 'bg-white'}`}>
                        <span className="font-medium text-gray-700">{model1.name}:</span>
                        <span className={`font-bold ${model1Better ? 'text-indigo-700' : 'text-gray-600'}`}>
                          {benchmark.model1Display}
                          {model1Better && <span className="ml-1">🏆</span>}
                        </span>
                      </div>
                      
                      <div className={`flex justify-between items-center p-2 rounded-lg ${model2Better ? 'bg-orange-100 border border-orange-200' : 'bg-white'}`}>
                        <span className="font-medium text-gray-700">{model2.name}:</span>
                        <span className={`font-bold ${model2Better ? 'text-orange-700' : 'text-gray-600'}`}>
                          {benchmark.model2Display}
                          {model2Better && <span className="ml-1">🏆</span>}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ComparisonChart; 