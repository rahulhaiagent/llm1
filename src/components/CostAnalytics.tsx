'use client';

import React, { useMemo } from 'react';
import { ArrowLeft, TrendingDown, Shield, Zap } from 'lucide-react';
import modelsData from '@/data/models.json';
import providersData from '@/data/models-by-provider.json';

interface UserRequirements {
  companyName: string;
  industry: string;
  monthlyTokens: number;
  priorities: string[];
}

interface ModelRecommendation {
  modelId: string;
  name: string;
  organization: string;
  score: number;
  reasons: string[];
  cheapestProvider: {
    name: string;
    monthlyCost: number;
    inputCost: number;
    outputCost: number;
  };
  allProviders: Array<{
    name: string;
    monthlyCost: number;
    inputCost: number;
    outputCost: number;
  }>;
  safety: string;
  performance: string;
}

interface ProviderInfo {
  model_id: string;
  price_per_input_token: number;
  price_per_output_token: number;
  price_per_cached_input_token?: number;
  throughput?: number | string;
  latency?: number | string;
  input_cost_per_million?: string;
  output_cost_per_million?: string;
  context?: string;
  max_output_tokens?: string;
  updated_at: string;
}

interface ModelProviderData {
  modelName: string;
  modelId: string;
  organization: string;
  providers: Record<string, ProviderInfo>;
}

interface CostAnalyticsProps {
  requirements: UserRequirements;
  onReset: () => void;
}

export default function CostAnalytics({ requirements, onReset }: CostAnalyticsProps) {
  // Calculate token usage based on industry
  const getTokenRatio = (industry: string) => {
    const ratios: { [key: string]: { input: number; output: number } } = {
      'Technology & Software': { input: 0.4, output: 0.6 },
      'Healthcare & Life Sciences': { input: 0.6, output: 0.4 },
      'Financial Services': { input: 0.5, output: 0.5 },
      'E-commerce & Retail': { input: 0.3, output: 0.7 },
      'Education': { input: 0.4, output: 0.6 },
      'Manufacturing': { input: 0.6, output: 0.4 },
      'Media & Entertainment': { input: 0.2, output: 0.8 },
      'Government & Public Sector': { input: 0.7, output: 0.3 },
      'Legal Services': { input: 0.6, output: 0.4 },
      'Consulting': { input: 0.5, output: 0.5 }
    };
    return ratios[industry] || { input: 0.5, output: 0.5 };
  };

  // Get top 3 model recommendations
  const recommendations = useMemo(() => {
    const tokenRatio = getTokenRatio(requirements.industry);
    const inputTokens = requirements.monthlyTokens * tokenRatio.input;
    const outputTokens = requirements.monthlyTokens * tokenRatio.output;

    const modelRecommendations: ModelRecommendation[] = [];

    // Only process models that exist in models-by-provider.json
    Object.entries(providersData as Record<string, ModelProviderData>).forEach(([modelId, modelData]) => {
      // Find corresponding model in models.json
      const modelInfo = modelsData.find(m => m.ModelId === modelId);
      if (!modelInfo || !modelData.providers) return;

      let score = 0;
      const reasons: string[] = [];

      // Scoring based on priorities
      if (requirements.priorities && requirements.priorities.length > 0) {
        requirements.priorities.forEach((priority) => {
          if (priority === 'Speed & Low Latency') {
            const providers = Object.values(modelData.providers);
            const hasLowLatency = providers.some(p => 
              p.latency && (typeof p.latency === 'number' ? p.latency < 1 : p.latency.includes('Fast'))
            );
            if (hasLowLatency) {
              score += 25;
              reasons.push('Fast response times');
            }
          }
          if (priority === 'Budget & Cost Efficiency') {
            const providers = Object.values(modelData.providers);
            const avgInputCost = providers.reduce((sum, p) => {
              const cost = p.input_cost_per_million ? parseFloat(p.input_cost_per_million.replace(/[$,]/g, '')) : 10;
              return sum + cost;
            }, 0) / providers.length;
            if (avgInputCost < 1) {
              score += 30;
              reasons.push('Very cost efficient');
            } else if (avgInputCost < 5) {
              score += 20;
              reasons.push('Cost efficient');
            }
          }
          if (priority === 'Security & Data Privacy' && modelInfo.SafetyRank) {
            const rank = parseInt(modelInfo.SafetyRank.replace('#', ''));
            if (rank <= 10) {
              score += 25;
              reasons.push('High safety ranking');
            }
          }
          if (priority === 'High Accuracy' && modelInfo.GPQA) {
            const accuracy = parseFloat(modelInfo.GPQA.replace('%', ''));
            if (accuracy > 85) {
              score += 20;
              reasons.push('High accuracy scores');
            }
          }
          if (priority === 'Compliance (SOC2, HIPAA, etc.)' && modelInfo.SafetyRank) {
            const rank = parseInt(modelInfo.SafetyRank.replace('#', ''));
            if (rank <= 5) {
              score += 30;
              reasons.push('Enterprise compliance ready');
            }
          }
          if (priority === 'Scalability') {
            const providers = Object.values(modelData.providers);
            const hasHighThroughput = providers.some(p => p.throughput && parseFloat(String(p.throughput)) > 100);
            if (hasHighThroughput) {
              score += 15;
              reasons.push('High throughput capability');
            }
          }
        });
      }

      // Industry specific scoring
      if (requirements.industry === 'Healthcare & Life Sciences' && modelInfo.SafetyRank) {
        const rank = parseInt(modelInfo.SafetyRank.replace('#', ''));
        if (rank <= 5) {
          score += 25;
          reasons.push('HIPAA compliance ready');
        }
      }
      if (requirements.industry === 'Financial Services' && modelInfo.SafetyRank) {
        const rank = parseInt(modelInfo.SafetyRank.replace('#', ''));
        if (rank <= 10) {
          score += 20;
          reasons.push('Financial-grade security');
        }
      }

      // Calculate costs for all providers
      const allProviders = Object.entries(modelData.providers).map(([providerName, providerInfo]) => {
        const inputCostPerM = providerInfo.input_cost_per_million ? 
          parseFloat(providerInfo.input_cost_per_million.replace(/[$,]/g, '')) : 
          (providerInfo.price_per_input_token ? providerInfo.price_per_input_token * 1000000 : 10);
        
        const outputCostPerM = providerInfo.output_cost_per_million ? 
          parseFloat(providerInfo.output_cost_per_million.replace(/[$,]/g, '')) : 
          (providerInfo.price_per_output_token ? providerInfo.price_per_output_token * 1000000 : 30);

        const monthlyCost = (inputTokens / 1000000) * inputCostPerM + (outputTokens / 1000000) * outputCostPerM;

        return {
          name: providerName,
          monthlyCost,
          inputCost: inputCostPerM,
          outputCost: outputCostPerM
        };
      }).filter(p => !isNaN(p.monthlyCost) && p.monthlyCost > 0).sort((a, b) => a.monthlyCost - b.monthlyCost);

      if (allProviders.length > 0) {
        modelRecommendations.push({
          modelId,
          name: modelData.modelName || modelInfo.Model,
          organization: modelData.organization || modelInfo['Org.'],
          score,
          reasons: reasons.length > 0 ? reasons : ['Good general purpose model'],
          cheapestProvider: allProviders[0],
          allProviders,
          safety: modelInfo.SafetyRank || 'N/A',
          performance: modelInfo.GPQA || modelInfo.Latency || 'N/A'
        });
      }
    });

    // Sort by score and cost, return top 3
    return modelRecommendations
      .sort((a, b) => b.score - a.score || a.cheapestProvider.monthlyCost - b.cheapestProvider.monthlyCost)
      .slice(0, 3);
  }, [requirements]);

  const baselineCost = 60000; // $60k baseline for comparison

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onReset}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Start Over
            </button>
            <div className="text-right">
              <h1 className="text-xl font-semibold text-gray-900">Cost Analysis</h1>
              <p className="text-sm text-gray-500">{requirements.companyName}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {(requirements.monthlyTokens / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-gray-500">Monthly Tokens</div>
          </div>
                      <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">{requirements.industry.split(' ')[0]}</div>
              <div className="text-sm text-gray-500">Industry</div>
            </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">{requirements.priorities.length}</div>
            <div className="text-sm text-gray-500">Priorities</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">
              ${Math.max(0, baselineCost - (recommendations[0]?.cheapestProvider.monthlyCost || 0)).toFixed(0)}
            </div>
            <div className="text-sm text-gray-500">Potential Savings</div>
          </div>
        </div>

        {/* Top 3 Models */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Top 3 Recommended Models</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Model</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Best Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Safety</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Why Recommended</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recommendations.map((model, index) => (
                  <tr key={model.modelId} className={index === 0 ? 'bg-green-50' : 'bg-white'}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                          index === 0 ? 'bg-green-500' : index === 1 ? 'bg-blue-500' : 'bg-gray-500'
                        }`}>
                          {index + 1}
                        </div>
                        {index === 0 && <span className="ml-2 text-xs font-medium text-green-600">BEST</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{model.name}</div>
                      <div className="text-sm text-gray-500">{model.organization}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        ${model.cheapestProvider.monthlyCost.toFixed(2)}/mo
                      </div>
                      <div className="text-sm text-gray-500">via {model.cheapestProvider.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm">{model.safety}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Zap className="h-4 w-4 text-blue-500 mr-1" />
                        <span className="text-sm">{model.performance}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {model.reasons.slice(0, 2).join(', ')}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Provider Pricing for Each Model */}
        {recommendations.map((model, index) => (
          <div key={model.modelId} className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">#{index + 1} {model.name}</h3>
                  <p className="text-sm text-gray-500">{model.reasons.join(' • ')}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Starting at</div>
                  <div className="font-semibold text-green-600">
                    ${model.cheapestProvider.monthlyCost.toFixed(2)}/month
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Input Cost</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Output Cost</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monthly Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Savings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {model.allProviders.map((provider, providerIndex) => {
                    const savings = baselineCost - provider.monthlyCost;
                    const savingsPercent = (savings / baselineCost) * 100;

                    return (
                      <tr key={provider.name} className={providerIndex === 0 ? 'bg-green-50' : 'bg-white'}>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <span className="font-medium text-gray-900">{provider.name}</span>
                            {providerIndex === 0 && (
                              <span className="ml-2 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                                CHEAPEST
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          ${provider.inputCost.toFixed(2)}/1M
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          ${provider.outputCost.toFixed(2)}/1M
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-gray-900">
                            ${provider.monthlyCost.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {savings > 0 ? (
                            <div className="flex items-center text-green-600">
                              <TrendingDown className="h-4 w-4 mr-1" />
                              <span className="font-medium">
                                ${savings.toFixed(0)} ({savingsPercent.toFixed(0)}%)
                              </span>
                            </div>
                          ) : (
                            <span className="text-red-600 font-medium">
                              +${Math.abs(savings).toFixed(0)}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}