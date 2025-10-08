'use client';

import React, { useState, useMemo } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import modelsByProvider from '../data/models-by-provider.json';
import Image from 'next/image';





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

const ModelProviders: React.FC = () => {
  // Function to get provider logo
  const getProviderLogo = (providerName: string) => {
    const logoMap: Record<string, string> = {
      'Anthropic': '/anthropic.png',
      'AWS Bedrock': '/AWS-Bedrock.png',
      'Bedrock': '/AWS-Bedrock.png',
      'Google': '/google.png',
      'Google Vertex': '/google.png',
      'Google Vertex (Global)': '/google.png',
      'OpenAI': '/openai.png',
      'Azure': '/azure.png',
      'xAI': '/xai.png',
      'DeepSeek': '/deepseek.png',
      'Meta': '/meta.png',
      'Mistral': '/Mistral.png',
      'Mistral AI': '/Mistral.png',
      'Gemini': '/gemini.png',
      'Gemma': '/Gemma.png',
      'Perplexity': '/perplexity.png',
      'Together': '/Together.png',
      'Fireworks': '/Fireworks.png',
      'OpenRouter': '/open-router.jpeg',
      'Groq': '/groq.png',
      'Cerebras': '/Cerebras.png',
      'Crusoe': '/Crusoe.jpeg',
      'Nebius AI Studio': '/Nebius AI Studio.jpeg',
      'Parasail': '/Parasail.jpeg',
      'Phala': '/Phala.jpeg',
      // Providers without dedicated assets yet will use a default logo
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

  // Get available model IDs that have provider data
  const availableModelIds = useMemo(() => {
    return Object.keys(modelsByProvider);
  }, []);

  const [selectedModel, setSelectedModel] = useState<string>(availableModelIds[0] || '');
  const [sortField, setSortField] = useState<SortField>('input_price');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');



  // Format currency
  const formatCurrency = (price: number) => {
    return `$${(price * 1000000).toFixed(2)}`;
  };

  // Format latency
  const formatLatency = (latency: number | string) => {
    if (typeof latency === 'string') {
      return latency; // Return the string as is (e.g. "~11s")
    }
    return `${latency} ms`;
  };

  // Format throughput
  const formatThroughput = (throughput: number | string) => {
    if (typeof throughput === 'string') {
      return throughput;
    }
    return `${throughput} tokens/s`;
  };

  // Find current model data
  const currentModelData = useMemo(() => {
    return (modelsByProvider as Record<string, ModelByProviderData>)[selectedModel] || null;
  }, [selectedModel]);

  // Get sorted providers
  const sortedProviders = useMemo(() => {
    if (!currentModelData || !currentModelData.providers) return [];

    const providers = Object.entries(currentModelData.providers).map(([name, data]) => ({
      name,
      ...(data as ModelByProviderData['providers'][string]),
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
            aValue = typeof a.latency === 'string' ? 999999 : (a.latency ?? 999999);
            bValue = typeof b.latency === 'string' ? 999999 : (b.latency ?? 999999);
          }
          break;
        case 'throughput':
          // Handle string throughput values
          if (typeof a.throughput === 'string' && typeof b.throughput === 'string') {
            aValue = a.throughput;
            bValue = b.throughput;
          } else {
            aValue = typeof a.throughput === 'string' ? 0 : (a.throughput ?? 0);
            bValue = typeof b.throughput === 'string' ? 0 : (b.throughput ?? 0);
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

  if (!currentModelData) {
    return <div className="text-center py-8">Model not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Providers</h1>
          <p className="text-gray-600">
            Pricing, throughput, and latency for{' '}
            <span className="font-medium">{currentModelData?.modelName}</span>:
          </p>
        </div>
      </div>

      {/* Model Selector */}
      <div className="mb-6">
        <label htmlFor="model-select" className="block text-sm font-medium text-gray-700 mb-2">
          Select Model
        </label>
        <select
          id="model-select"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="block w-full max-w-md px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {availableModelIds.map((modelId) => (
            <option key={modelId} value={modelId}>
              {(modelsByProvider as Record<string, ModelByProviderData>)[modelId].modelName}
            </option>
          ))}
        </select>
      </div>

      {/* Providers Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Updated
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
                      {getProviderLogo(provider.name) ? (
                        <Image
                          src={getProviderLogo(provider.name)!}
                          alt={`${provider.name} logo`}
                          width={32}
                          height={32}
                          className="h-8 w-8 rounded object-contain"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            {provider.name.charAt(0)}
                          </span>
                        </div>
                      )}
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
                  {formatLatency(provider.latency ?? 0)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatThroughput(provider.throughput ?? 0)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {provider.updated_at}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-blue-900">Total Providers</div>
          <div className="text-2xl font-bold text-blue-600">
            {sortedProviders.length}
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-green-900">Lowest Input Price</div>
          <div className="text-2xl font-bold text-green-600">
            {sortedProviders.length > 0 && 
              formatCurrency(Math.min(...sortedProviders.map(p => p.price_per_input_token)))
            }
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-purple-900">Latency</div>
          <div className="text-2xl font-bold text-purple-600">
            {sortedProviders.length > 0 && sortedProviders[0].latency ? 
              sortedProviders.find(p => typeof p.latency === 'number') ? 
                formatLatency(Math.min(...sortedProviders
                  .filter(p => typeof p.latency === 'number')
                  .map(p => p.latency as number))) : 
                'Varies'
              : '-'
            }
          </div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-orange-900">Throughput</div>
          <div className="text-2xl font-bold text-orange-600">
            {sortedProviders.length > 0 && sortedProviders[0].throughput ?
              sortedProviders.find(p => typeof p.throughput === 'number') ?
                formatThroughput(Math.max(...sortedProviders
                  .filter(p => typeof p.throughput === 'number')
                  .map(p => p.throughput as number))) :
                'Varies'
              : '-'
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelProviders; 