'use client';

import React, { useState } from 'react';

interface ModelRecommendation {
  model: {
    Model: string;
    'Input Cost/M': string;
    'Output Cost/M': string;
    OperationalRank?: string;
    SafeResponses?: string;
    CodeLMArena?: string;
    MathLiveBench?: string;
    'Org.': string;
    License?: string;
    Size?: string;
    Released?: string;
    Latency?: string;
  };
  score: number;
  reason: string;
  isProviderComparison?: boolean;
  providerData?: {
    providerName: string;
    modelId: string;
    inputCost: number;
    outputCost: number;
    latency: number;
    throughput: number;
  };
}

interface DataTableProps {
  recommendations: ModelRecommendation[];
  title: string;
}

type SortField = 'provider' | 'modelName' | 'score' | 'inputCost' | 'outputCost' | 'latency' | 'throughput';
type SortDirection = 'asc' | 'desc';

export default function DataTable({ recommendations, title }: DataTableProps) {
  const [sortField, setSortField] = useState<SortField>('score');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [searchTerm, setSearchTerm] = useState('');

  // Extract numeric value helper
  const extractNumeric = (value: string | number): number => {
    if (typeof value === 'number') return value;
    if (!value || value === '-' || value === 'N/A') return 0;
    const match = value.toString().match(/(\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[1]) : 0;
  };

  // Check if this is a provider comparison table
  const isProviderComparison = recommendations.length > 0 && recommendations.some(rec => rec.isProviderComparison || rec.providerData);

  // Extract provider name from model name or use providerData
  const getProviderName = (rec: ModelRecommendation): string => {
    if (rec.providerData) {
      return rec.providerData.providerName;
    }
    // Extract provider from model name like "DeepSeek R1 (DeepSeek)"
    const match = rec.model.Model.match(/\(([^)]+)\)$/);
    return match ? match[1] : rec.model['Org.'] || 'Unknown';
  };

  // Extract model base name (without provider suffix)
  const getModelBaseName = (rec: ModelRecommendation): string => {
    if (rec.providerData) {
      // Remove provider suffix from model name
      return rec.model.Model.replace(/\s*\([^)]+\)$/, '');
    }
    return rec.model.Model;
  };

  // Generate model detail page URL (placeholder for now)
  const getModelDetailUrl = (modelName: string): string => {
    const slugName = modelName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return `/model/${slugName}`;
  };

  // Filter and sort data
  const sortedData = React.useMemo(() => {
    const filtered = recommendations.filter(rec => {
      const providerName = getProviderName(rec);
      const modelName = getModelBaseName(rec);
      return providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
             modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
             rec.reason.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return filtered.sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;

      switch (sortField) {
        case 'provider':
          aValue = getProviderName(a);
          bValue = getProviderName(b);
          break;
        case 'modelName':
          aValue = getModelBaseName(a);
          bValue = getModelBaseName(b);
          break;
        case 'score':
          aValue = a.score;
          bValue = b.score;
          break;
        case 'inputCost':
          aValue = a.providerData ? a.providerData.inputCost : extractNumeric(a.model['Input Cost/M']);
          bValue = b.providerData ? b.providerData.inputCost : extractNumeric(b.model['Input Cost/M']);
          break;
        case 'outputCost':
          aValue = a.providerData ? a.providerData.outputCost : extractNumeric(a.model['Output Cost/M']);
          bValue = b.providerData ? b.providerData.outputCost : extractNumeric(b.model['Output Cost/M']);
          break;
        case 'latency':
          aValue = a.providerData ? a.providerData.latency : extractNumeric(a.model.Latency || '');
          bValue = b.providerData ? b.providerData.latency : extractNumeric(b.model.Latency || '');
          break;
        case 'throughput':
          aValue = a.providerData ? a.providerData.throughput : 0;
          bValue = b.providerData ? b.providerData.throughput : 0;
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
  }, [recommendations, searchTerm, sortField, sortDirection]);

  // Handle sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Get sort icon
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    return sortDirection === 'asc' ? 
      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg> : 
      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>;
  };

  // Get score badge color
  const getScoreBadge = (score: number) => {
    if (score >= 95) return 'bg-green-100 text-green-800';
    if (score >= 90) return 'bg-blue-100 text-blue-800';
    if (score >= 85) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  // Get provider badge color
  const getProviderBadge = (provider: string) => {
    const colors = {
      'DeepSeek': 'bg-purple-100 text-purple-800',
      'Together': 'bg-blue-100 text-blue-800',
      'Fireworks': 'bg-orange-100 text-orange-800',
      'OpenAI': 'bg-green-100 text-green-800',
      'Anthropic': 'bg-red-100 text-red-800',
      'Google': 'bg-yellow-100 text-yellow-800',
      'Replicate': 'bg-indigo-100 text-indigo-800',
    };
    return colors[provider as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  // Export CSV functionality
  const handleExportCSV = () => {
    const headers = isProviderComparison 
      ? ['Provider', 'Model', 'Input Cost ($/M)', 'Output Cost ($/M)', 'Latency (s)', 'Throughput', 'Match Score', 'Details']
      : ['Model', 'Organization', 'Input Cost', 'Output Cost', 'Match Score', 'Reason'];
    
    const csvData = sortedData.map(rec => {
      if (isProviderComparison) {
        return [
          getProviderName(rec),
          getModelBaseName(rec),
          rec.providerData ? `$${rec.providerData.inputCost.toFixed(4)}` : rec.model['Input Cost/M'],
          rec.providerData ? `$${rec.providerData.outputCost.toFixed(4)}` : rec.model['Output Cost/M'],
          rec.providerData ? `${rec.providerData.latency}s` : rec.model.Latency || 'N/A',
          rec.providerData ? rec.providerData.throughput : 'N/A',
          rec.score,
          rec.reason
        ];
      } else {
        return [
          rec.model.Model,
          rec.model['Org.'],
          rec.model['Input Cost/M'],
          rec.model['Output Cost/M'],
          rec.score,
          rec.reason
        ];
      }
    });

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `model-recommendations-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mt-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900">{title} - Detailed Data</h3>
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder={isProviderComparison ? "Search providers..." : "Search models..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Export button */}
          <button 
            onClick={handleExportCSV}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {isProviderComparison && (
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('provider')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Provider</span>
                    {getSortIcon('provider')}
                  </div>
                </th>
              )}
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('modelName')}
              >
                <div className="flex items-center space-x-1">
                  <span>Model</span>
                  {getSortIcon('modelName')}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('inputCost')}
              >
                <div className="flex items-center space-x-1">
                  <span>Input Cost</span>
                  {getSortIcon('inputCost')}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('outputCost')}
              >
                <div className="flex items-center space-x-1">
                  <span>Output Cost</span>
                  {getSortIcon('outputCost')}
                </div>
              </th>
              {isProviderComparison && (
                <>
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
                </>
              )}
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('score')}
              >
                <div className="flex items-center space-x-1">
                  <span>Match Score</span>
                  {getSortIcon('score')}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((rec, index) => {
              const providerName = getProviderName(rec);
              const modelBaseName = getModelBaseName(rec);
              const modelDetailUrl = getModelDetailUrl(modelBaseName);
              
              return (
                <tr key={`${providerName}-${modelBaseName}-${index}`} className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                  {isProviderComparison && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getProviderBadge(providerName)}`}>
                        {providerName}
                      </span>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <a 
                        href={modelDetailUrl}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                        title={`View details for ${modelBaseName}`}
                      >
                        {modelBaseName}
                      </a>
                      <div className="text-sm text-gray-500">{rec.model['Org.']}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {rec.providerData ? `$${rec.providerData.inputCost.toFixed(4)}` : rec.model['Input Cost/M']}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {rec.providerData ? `$${rec.providerData.outputCost.toFixed(4)}` : rec.model['Output Cost/M']}
                  </td>
                  {isProviderComparison && (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {rec.providerData ? `${rec.providerData.latency}s` : rec.model.Latency || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {rec.providerData ? rec.providerData.throughput : 'N/A'}
                      </td>
                    </>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getScoreBadge(rec.score)}`}>
                      {rec.score.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate" title={rec.reason}>
                      {rec.reason}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
        <div>
          Showing {sortedData.length} of {recommendations.length} {isProviderComparison ? 'providers' : 'models'}
        </div>
        <div>
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="text-blue-600 hover:text-blue-800"
            >
              Clear search
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 