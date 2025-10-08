'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Image from 'next/image';
import { ChevronUpIcon, ChevronDownIcon, EyeIcon } from '@heroicons/react/24/outline';
import modelsByProvider from '../data/models-by-provider.json';

type SortField = 'provider' | 'input_price' | 'output_price' | 'latency' | 'throughput';
type SortDirection = 'asc' | 'desc';

interface ModelByProviderData {
  modelName: string;
  modelId: string;
  organization: string;
  providers: Record<string, {
    model_id: string;
    price_per_input_token: number;
    price_per_output_token: number;
    price_per_cached_input_token?: number;
    throughput?: number | string;
    latency?: string | number;
    context?: string;
    max_output_tokens?: string;
    input_cost_per_million?: string;
    output_cost_per_million?: string;
    updated_at: string;
  }>;
}





interface ModelPageProvidersProps {
  modelId: string;
}

const ModelPageProviders: React.FC<ModelPageProvidersProps> = ({ modelId }) => {
  const [sortField, setSortField] = useState<SortField>('input_price');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Find the model data by model ID in the models-by-provider.json
  const currentModelData = useMemo(() => {
    // If modelId is undefined or empty, return null (no provider data)
    if (!modelId) {
      return null;
    }
    return (modelsByProvider as Record<string, ModelByProviderData>)[modelId] || null;
  }, [modelId]);

  // Format currency
  const formatCurrency = (price: number) => {
    return `$${(price * 1000000).toFixed(2)}`;
  };

  // Format latency
  const formatLatency = (latency: number | string | undefined) => {
    if (!latency) return 'N/A';
    if (typeof latency === 'string') {
      return latency; // Return the string as is (e.g. "~11s")
    }
    return `${latency} ms`;
  };

  // Format throughput
  const formatThroughput = (throughput: number | string | undefined) => {
    if (!throughput) return 'N/A';
    if (typeof throughput === 'string') {
      return throughput; // Return the string as is
    }
    return `${throughput} tokens/s`;
  };

  // Get sorted providers
  const sortedProviders = useMemo(() => {
    if (!currentModelData || !currentModelData.providers) return [];

    const providers = Object.entries(currentModelData.providers).map(([name, data]) => ({
      name,
      ...data,
    }));

    return providers.sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;

      switch (sortField) {
        case 'provider':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'input_price':
          aValue = a.price_per_input_token;
          bValue = b.price_per_input_token;
          break;
        case 'output_price':
          aValue = a.price_per_output_token || 0;
          bValue = b.price_per_output_token || 0;
          break;
        case 'latency':
          // Handle string latency values
          if (typeof a.latency === 'string' && typeof b.latency === 'string') {
            aValue = a.latency;
            bValue = b.latency;
          } else {
            aValue = typeof a.latency === 'string' ? 999999 : (a.latency || 999999);
            bValue = typeof b.latency === 'string' ? 999999 : (b.latency || 999999);
          }
          break;
        case 'throughput':
          // Handle string throughput values
          if (typeof a.throughput === 'string' && typeof b.throughput === 'string') {
            aValue = a.throughput;
            bValue = b.throughput;
          } else {
            aValue = typeof a.throughput === 'string' ? 0 : (a.throughput || 0);
            bValue = typeof b.throughput === 'string' ? 0 : (b.throughput || 0);
          }
          break;
        default:
          aValue = 0;
          bValue = 0;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortDirection === 'asc' 
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });
  }, [currentModelData, sortField, sortDirection]);

  // Handle sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get sort icon
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUpIcon className="w-4 h-4" /> : 
      <ChevronDownIcon className="w-4 h-4" />;
  };

  // Get provider logo path
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getProviderLogo = (providerName: string) => {
    const logoMap: Record<string, string> = {
      'OpenAI': '/openai.png',
      'Anthropic': '/anthropic.png',
      'Google': '/google.png',
      'AWS Bedrock': '/AWS-Bedrock.png',
      'Bedrock': '/AWS-Bedrock.png',
      'Azure': '/azure.png',
      'Together': '/Together.png',
      'Fireworks': '/Fireworks.png',
      'DeepSeek': '/deepseek.png',
      'xAI': '/xai.png',
      'Mistral AI': '/Mistral.png',
      'Mistral': '/Mistral.png',
      'Meta': '/meta.png',
      'Perplexity': '/perplexity.png',
      'Gemini': '/gemini.png',
      'Gemma': '/Gemma.png',
      'OpenRouter': '/open-router.jpeg',
      'Google Vertex': '/google.png',
      'Google Vertex (Global)': '/google.png',
      'Groq': '/groq.png',
      'Cerebras': '/Cerebras.png',
      'Crusoe': '/Crusoe.jpeg',
      'Nebius AI Studio': '/Nebius AI Studio.jpeg',
      'Parasail': '/Parasail.jpeg',
      'Phala': '/Phala.jpeg',
      'DeepInfra': '/logos/default.png',
      'nCompass': '/logos/default.png',
      'NovitaAI': '/logos/default.png',
      'AtlasCloud': '/logos/default.png',
      'Baseten': '/logos/default.png',
      'Eden AI': '/logos/default.png',
      'Glama': '/logos/default.png',
      'Langbase': '/logos/default.png',
      'Palantir AIP': '/logos/default.png'
    };
    return logoMap[providerName] || null;
  };

  // Get provider fallback initial
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getProviderInitial = (providerName: string) => {
    const initialMap: Record<string, string> = {
      'AWS Bedrock': 'AWS',
      'Bedrock': 'AWS',
      'Azure': 'Az',
      'Groq': 'Gq',
      'Sambanova': 'S',
      'Hyperbolic': 'H',
      'Novita': 'N',
      'Replicate': 'R'
    };
    return initialMap[providerName] || providerName.charAt(0);
  };

  if (!currentModelData || sortedProviders.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No provider information available for this model.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Providers Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('provider')}
              >
                <div className="flex items-center space-x-1">
                  <span>Provider</span>
                  {getSortIcon('provider')}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('input_price')}
              >
                <div className="flex items-center space-x-1">
                  <span>Input $/1M</span>
                  {getSortIcon('input_price')}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('output_price')}
              >
                <div className="flex items-center space-x-1">
                  <span>Output $/1M</span>
                  {getSortIcon('output_price')}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('latency')}
              >
                <div className="flex items-center space-x-1">
                  <span>Latency</span>
                  {getSortIcon('latency')}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('throughput')}
              >
                <div className="flex items-center space-x-1">
                  <span>Throughput</span>
                  {getSortIcon('throughput')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedProviders.map((provider, index) => (
              <tr 
                key={provider.name}
                className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8">
                      {/* Unified neutral icon for all providers */}
                      <div className="h-8 w-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                        <span className="block w-2.5 h-2.5 rounded-full bg-gray-400" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {provider.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {formatCurrency(provider.price_per_input_token)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {formatCurrency(provider.price_per_output_token || 0)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatLatency(provider.latency)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatThroughput(provider.throughput)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View All Button */}
      <div className="flex justify-end mt-4">
        <Link 
          href="/providers" 
          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border rounded-md hover:bg-gray-50 transition-colors"
        >
          <EyeIcon className="w-4 h-4" />
          <span>View All Model Providers</span>
        </Link>
      </div>
    </div>
  );
};

export default ModelPageProviders; 