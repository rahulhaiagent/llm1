'use client';

import React from 'react';
import Image from 'next/image';
import { ProcessedModelData } from '@/types/model';
import { 
  BarChart3, 
  TrendingUp, 
  Award, 
  Zap, 
  DollarSign, 
  Shield, 
  Calendar,
  HardDrive,
  FileText,
  Scale,
  Lock,
  AlertTriangle
} from 'lucide-react';

interface ComparisonTableProps {
  model1: ProcessedModelData;
  model2: ProcessedModelData;
}

interface TableRow {
  category: string;
  benchmark: string;
  model1Value: string;
  model2Value: string;
  model1Better: boolean;
  model2Better: boolean;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ model1, model2 }) => {
  
  const createTableData = (): TableRow[] => {
    const compareNumbers = (val1: number | null, val2: number | null, higherIsBetter: boolean) => {
      if (val1 === null || val2 === null) return { model1Better: false, model2Better: false };
      if (higherIsBetter) {
        return { model1Better: val1 > val2, model2Better: val2 > val1 };
      } else {
        return { model1Better: val1 < val2, model2Better: val2 < val1 };
      }
    };

    return [
      // Performance Metrics
      {
        category: 'Performance',
        benchmark: 'Code LM Arena Score',
        model1Value: model1.codeLMArena?.toString() || 'N/A',
        model2Value: model2.codeLMArena?.toString() || 'N/A',
        ...compareNumbers(
          typeof model1.codeLMArena === 'number' ? model1.codeLMArena : null,
          typeof model2.codeLMArena === 'number' ? model2.codeLMArena : null,
          true
        ),
        icon: BarChart3,
        description: 'Coding capability ranking from LM Arena',
      },
      {
        category: 'Performance',
        benchmark: 'Math Live Bench',
        model1Value: model1.mathLiveBench,
        model2Value: model2.mathLiveBench,
        ...compareNumbers(
          model1.mathLiveBench !== '-' ? parseFloat(model1.mathLiveBench.replace('%', '')) : null,
          model2.mathLiveBench !== '-' ? parseFloat(model2.mathLiveBench.replace('%', '')) : null,
          true
        ),
        icon: TrendingUp,
        description: 'Mathematical reasoning performance',
      },
      {
        category: 'Performance',
        benchmark: 'Code Live Bench',
        model1Value: model1.codeLiveBench,
        model2Value: model2.codeLiveBench,
        ...compareNumbers(
          model1.codeLiveBench !== '-' ? parseFloat(model1.codeLiveBench.replace('%', '')) : null,
          model2.codeLiveBench !== '-' ? parseFloat(model2.codeLiveBench.replace('%', '')) : null,
          true
        ),
        icon: Award,
        description: 'Live coding benchmark performance',
      },

      // Cost Metrics
      {
        category: 'Cost',
        benchmark: 'Input Cost (per 1M tokens)',
        model1Value: model1.inputCost ? `$${model1.inputCost.toFixed(2)}` : 'N/A',
        model2Value: model2.inputCost ? `$${model2.inputCost.toFixed(2)}` : 'N/A',
        ...compareNumbers(model1.inputCost, model2.inputCost, false),
        icon: DollarSign,
        description: 'Cost for processing input tokens',
      },
      {
        category: 'Cost',
        benchmark: 'Output Cost (per 1M tokens)',
        model1Value: model1.outputCost ? `$${model1.outputCost.toFixed(2)}` : 'N/A',
        model2Value: model2.outputCost ? `$${model2.outputCost.toFixed(2)}` : 'N/A',
        ...compareNumbers(model1.outputCost, model2.outputCost, false),
        icon: DollarSign,
        description: 'Cost for generating output tokens',
      },
      {
        category: 'Cost',
        benchmark: 'Average Cost (per 1M tokens)',
        model1Value: model1.inputCost && model1.outputCost ? 
          `$${((model1.inputCost + model1.outputCost) / 2).toFixed(2)}` : 'N/A',
        model2Value: model2.inputCost && model2.outputCost ? 
          `$${((model2.inputCost + model2.outputCost) / 2).toFixed(2)}` : 'N/A',
        ...compareNumbers(
          model1.inputCost && model1.outputCost ? (model1.inputCost + model1.outputCost) / 2 : null,
          model2.inputCost && model2.outputCost ? (model2.inputCost + model2.outputCost) / 2 : null,
          false
        ),
        icon: DollarSign,
        description: 'Average of input and output costs',
      },

      // Operational Metrics
      {
        category: 'Operational',
        benchmark: 'Operational Rank',
        model1Value: model1.operationalRank ? `#${model1.operationalRank}` : 'N/A',
        model2Value: model2.operationalRank ? `#${model2.operationalRank}` : 'N/A',
        ...compareNumbers(model1.operationalRank, model2.operationalRank, false),
        icon: Zap,
        description: 'Overall operational performance ranking',
      },
      {
        category: 'Operational',
        benchmark: 'Context Length',
        model1Value: model1.contextLength,
        model2Value: model2.contextLength,
        model1Better: false,
        model2Better: false, // Context length comparison depends on use case
        icon: HardDrive,
        description: 'Maximum context window size',
      },

      // Safety Metrics
      {
        category: 'Safety',
        benchmark: 'Safety Rank',
        model1Value: model1.safetyRank ? `#${model1.safetyRank}` : 'N/A',
        model2Value: model2.safetyRank ? `#${model2.safetyRank}` : 'N/A',
        ...compareNumbers(model1.safetyRank, model2.safetyRank, false),
        icon: Shield,
        description: 'Overall safety performance ranking',
      },
      {
        category: 'Safety',
        benchmark: 'Safe Responses',
        model1Value: model1.safeResponses?.toString() || 'N/A',
        model2Value: model2.safeResponses?.toString() || 'N/A',
        ...compareNumbers(model1.safeResponses, model2.safeResponses, true),
        icon: Shield,
        description: 'Number of safe responses in testing',
      },
      {
        category: 'Safety',
        benchmark: 'Unsafe Responses',
        model1Value: model1.unsafeResponses?.toString() || 'N/A',
        model2Value: model2.unsafeResponses?.toString() || 'N/A',
        ...compareNumbers(model1.unsafeResponses, model2.unsafeResponses, false),
        icon: AlertTriangle,
        description: 'Number of unsafe responses in testing',
      },
      {
        category: 'Safety',
        benchmark: 'Jailbreaking Resistance',
        model1Value: model1.jailbreakingResistance?.toString() || 'N/A',
        model2Value: model2.jailbreakingResistance?.toString() || 'N/A',
        ...compareNumbers(model1.jailbreakingResistance, model2.jailbreakingResistance, true),
        icon: Lock,
        description: 'Resistance to jailbreaking attempts',
      },

      // Model Information
      {
        category: 'Model Info',
        benchmark: 'Model Size',
        model1Value: model1.size,
        model2Value: model2.size,
        model1Better: false,
        model2Better: false,
        icon: HardDrive,
        description: 'Model parameter count or size',
      },
      {
        category: 'Model Info',
        benchmark: 'Release Date',
        model1Value: model1.released,
        model2Value: model2.released,
        model1Better: false,
        model2Better: false,
        icon: Calendar,
        description: 'Model release date',
      },
      {
        category: 'Model Info',
        benchmark: 'License',
        model1Value: model1.license,
        model2Value: model2.license,
        model1Better: false,
        model2Better: false,
        icon: FileText,
        description: 'Model licensing terms',
      },
      {
        category: 'Model Info',
        benchmark: 'Knowledge Cutoff',
        model1Value: model1.cutoffKnowledge,
        model2Value: model2.cutoffKnowledge,
        model1Better: false,
        model2Better: false,
        icon: Calendar,
        description: 'Training data cutoff date',
      },
    ];
  };

  const tableData = createTableData();

  // Group data by category
  const groupedData = tableData.reduce((acc, row) => {
    if (!acc[row.category]) {
      acc[row.category] = [];
    }
    acc[row.category].push(row);
    return acc;
  }, {} as Record<string, TableRow[]>);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Performance': return 'from-blue-500 to-indigo-600';
      case 'Cost': return 'from-green-500 to-emerald-600';
      case 'Safety': return 'from-purple-500 to-violet-600';
      case 'Operational': return 'from-orange-500 to-red-600';
      case 'Model Info': return 'from-gray-500 to-gray-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Performance': return Award;
      case 'Cost': return DollarSign;
      case 'Safety': return Shield;
      case 'Operational': return Zap;
      case 'Model Info': return FileText;
      default: return Scale;
    }
  };

  return (
    <div className="space-y-8">
      {Object.entries(groupedData).map(([category, rows]) => {
        const CategoryIcon = getCategoryIcon(category);
        const colorGradient = getCategoryColor(category);
        
        return (
          <div key={category} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Category Header */}
            <div className={`bg-gradient-to-r ${colorGradient} px-8 py-6`}>
              <h3 className="text-2xl font-bold text-white flex items-center">
                <CategoryIcon className="w-6 h-6 mr-3" />
                {category}
              </h3>
              <p className="text-blue-100 mt-1">
                {category === 'Performance' && 'Benchmark scores and capabilities'}
                {category === 'Cost' && 'Pricing and cost efficiency metrics'}
                {category === 'Safety' && 'Security and safety measurements'}
                {category === 'Operational' && 'Speed and operational metrics'}
                {category === 'Model Info' && 'Basic model information and specifications'}
              </p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                      Benchmark
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-indigo-700 border-b border-gray-200 bg-indigo-50">
                      {model1.name}
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-orange-700 border-b border-gray-200 bg-orange-50">
                      {model2.name}
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {rows.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-8 py-4">
                        <div className="flex items-center">
                          <row.icon className="w-5 h-5 mr-3 text-gray-500" />
                          <span className="font-medium text-gray-900">{row.benchmark}</span>
                        </div>
                      </td>
                      <td className={`px-6 py-4 text-center font-bold ${
                        row.model1Better 
                          ? 'bg-indigo-100 text-indigo-800' 
                          : row.model1Value !== 'N/A' 
                            ? 'text-gray-700' 
                            : 'text-gray-400'
                      }`}>
                        <div className="flex items-center justify-center">
                          {row.model1Value}
                          {row.model1Better && <span className="ml-2">🏆</span>}
                        </div>
                      </td>
                      <td className={`px-6 py-4 text-center font-bold ${
                        row.model2Better 
                          ? 'bg-orange-100 text-orange-800' 
                          : row.model2Value !== 'N/A' 
                            ? 'text-gray-700' 
                            : 'text-gray-400'
                      }`}>
                        <div className="flex items-center justify-center">
                          {row.model2Value}
                          {row.model2Better && <span className="ml-2">🏆</span>}
                        </div>
                      </td>
                      <td className="px-8 py-4 text-sm text-gray-600">
                        {row.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      {/* Summary Section */}
      <div className="bg-gradient-to-br from-gray-900 to-indigo-900 rounded-2xl shadow-lg p-8 text-white">
        <h3 className="text-2xl font-bold mb-6 flex items-center">
          <Scale className="w-6 h-6 mr-3" />
          Comparison Summary
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Model 1 Summary */}
          <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center mb-4">
              {model1.developerLogo && (
                <Image 
                  src={model1.developerLogo} 
                  alt={`${model1.developer} logo`}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-lg mr-4"
                />
              )}
              <div>
                <h4 className="text-xl font-bold text-indigo-200">{model1.name}</h4>
                <p className="text-gray-300">{model1.developer}</p>
              </div>
            </div>
            <p className="text-gray-200 text-sm mb-4 line-clamp-3">{model1.description}</p>
            
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">Wins:</span>
                <span className="font-bold text-indigo-200">
                  {tableData.filter(row => row.model1Better).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Size:</span>
                <span className="text-gray-200">{model1.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Released:</span>
                <span className="text-gray-200">{model1.released}</span>
              </div>
            </div>
          </div>

          {/* Model 2 Summary */}
          <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center mb-4">
              {model2.developerLogo && (
                <Image 
                  src={model2.developerLogo} 
                  alt={`${model2.developer} logo`}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-lg mr-4"
                />
              )}
              <div>
                <h4 className="text-xl font-bold text-orange-200">{model2.name}</h4>
                <p className="text-gray-300">{model2.developer}</p>
              </div>
            </div>
            <p className="text-gray-200 text-sm mb-4 line-clamp-3">{model2.description}</p>
            
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">Wins:</span>
                <span className="font-bold text-orange-200">
                  {tableData.filter(row => row.model2Better).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Size:</span>
                <span className="text-gray-200">{model2.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Released:</span>
                <span className="text-gray-200">{model2.released}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonTable; 