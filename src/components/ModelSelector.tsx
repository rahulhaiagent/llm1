'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Settings, ChevronDown, ChevronUp, Zap, Eye, Brain, Code, Globe } from 'lucide-react';

interface ModelInfo {
  id: string;
  name: string;
  capabilities: ('text' | 'vision' | 'code' | 'reasoning' | 'multilingual')[];
  contextLength: string;
  maxTokens: string;
  description: string;
}

interface ProviderModels {
  [providerId: string]: ModelInfo[];
}

const PROVIDER_MODELS: ProviderModels = {
  openai: [
    {
      id: 'gpt-4o',
      name: 'GPT-4o',
      capabilities: ['text', 'vision', 'code', 'reasoning'],
      contextLength: '128K',
      maxTokens: '4K',
      description: 'Most advanced multimodal model'
    },
    {
      id: 'gpt-4o-mini',
      name: 'GPT-4o Mini',
      capabilities: ['text', 'vision', 'code'],
      contextLength: '128K',
      maxTokens: '16K',
      description: 'Fast and cost-efficient'
    },
    {
      id: 'gpt-4-turbo',
      name: 'GPT-4 Turbo',
      capabilities: ['text', 'vision', 'code', 'reasoning'],
      contextLength: '128K',
      maxTokens: '4K',
      description: 'Latest GPT-4 with vision'
    },
    {
      id: 'gpt-3.5-turbo',
      name: 'GPT-3.5 Turbo',
      capabilities: ['text', 'code'],
      contextLength: '16K',
      maxTokens: '4K',
      description: 'Fast and reliable'
    }
  ],
  anthropic: [
    {
      id: 'claude-3-5-sonnet-20241022',
      name: 'Claude 3.5 Sonnet',
      capabilities: ['text', 'vision', 'code', 'reasoning'],
      contextLength: '200K',
      maxTokens: '8K',
      description: 'Most intelligent Claude model'
    },
    {
      id: 'claude-3-5-haiku-20241022',
      name: 'Claude 3.5 Haiku',
      capabilities: ['text', 'vision', 'code'],
      contextLength: '200K',
      maxTokens: '8K',
      description: 'Fast and cost-effective'
    },
    {
      id: 'claude-3-opus-20240229',
      name: 'Claude 3 Opus',
      capabilities: ['text', 'vision', 'code', 'reasoning'],
      contextLength: '200K',
      maxTokens: '4K',
      description: 'Top-level performance'
    }
  ],
  google: [
    {
      id: 'gemini-1.5-pro',
      name: 'Gemini 1.5 Pro',
      capabilities: ['text', 'vision', 'code', 'reasoning', 'multilingual'],
      contextLength: '2M',
      maxTokens: '8K',
      description: 'Advanced multimodal model'
    },
    {
      id: 'gemini-1.5-flash',
      name: 'Gemini 1.5 Flash',
      capabilities: ['text', 'vision', 'code', 'multilingual'],
      contextLength: '1M',
      maxTokens: '8K',
      description: 'Fast multimodal model'
    },
    {
      id: 'gemini-pro',
      name: 'Gemini Pro',
      capabilities: ['text', 'code', 'reasoning'],
      contextLength: '32K',
      maxTokens: '8K',
      description: 'High-performance text model'
    }
  ],
  groq: [
    {
      id: 'llama-3.2-90b-text-preview',
      name: 'Llama 3.2 90B',
      capabilities: ['text', 'reasoning', 'multilingual'],
      contextLength: '128K',
      maxTokens: '8K',
      description: 'Ultra-fast inference'
    },
    {
      id: 'llama-3.1-70b-versatile',
      name: 'Llama 3.1 70B',
      capabilities: ['text', 'code', 'reasoning'],
      contextLength: '128K',
      maxTokens: '8K',
      description: 'Versatile large model'
    },
    {
      id: 'mixtral-8x7b-32768',
      name: 'Mixtral 8x7B',
      capabilities: ['text', 'code', 'multilingual'],
      contextLength: '32K',
      maxTokens: '8K',
      description: 'Mixture of experts model'
    }
  ],
  openrouter: [
    {
      id: 'anthropic/claude-3.5-sonnet',
      name: 'Claude 3.5 Sonnet',
      capabilities: ['text', 'vision', 'code', 'reasoning'],
      contextLength: '200K',
      maxTokens: '8K',
      description: 'Via OpenRouter'
    },
    {
      id: 'openai/gpt-4o',
      name: 'GPT-4o',
      capabilities: ['text', 'vision', 'code', 'reasoning'],
      contextLength: '128K',
      maxTokens: '4K',
      description: 'Via OpenRouter'
    },
    {
      id: 'meta-llama/llama-3.2-90b-instruct',
      name: 'Llama 3.2 90B',
      capabilities: ['text', 'reasoning', 'multilingual'],
      contextLength: '128K',
      maxTokens: '8K',
      description: 'Via OpenRouter'
    }
  ],
  xai: [
    {
      id: 'grok-beta',
      name: 'Grok Beta',
      capabilities: ['text', 'reasoning', 'multilingual'],
      contextLength: '131K',
      maxTokens: '8K',
      description: 'X.AI\'s conversational model'
    },
    {
      id: 'grok-2-latest',
      name: 'Grok 2',
      capabilities: ['text', 'vision', 'reasoning'],
      contextLength: '131K',
      maxTokens: '8K',
      description: 'Latest Grok model'
    }
  ],
  mistral: [
    {
      id: 'mistral-large-latest',
      name: 'Mistral Large',
      capabilities: ['text', 'code', 'reasoning', 'multilingual'],
      contextLength: '128K',
      maxTokens: '8K',
      description: 'Flagship model'
    },
    {
      id: 'mistral-small-latest',
      name: 'Mistral Small',
      capabilities: ['text', 'code', 'multilingual'],
      contextLength: '128K',
      maxTokens: '8K',
      description: 'Cost-efficient option'
    },
    {
      id: 'codestral-latest',
      name: 'Codestral',
      capabilities: ['code', 'text'],
      contextLength: '32K',
      maxTokens: '8K',
      description: 'Specialized for coding'
    }
  ]
};

const PROVIDER_INFO = {
  openai: { name: 'OpenAI (ChatGPT)', logo: '/logos/openai.png' },
  anthropic: { name: 'Anthropic (Claude)', logo: '/logos/anthropic.png' },
  google: { name: 'Google (Gemini)', logo: '/logos/gemini.png' },
  groq: { name: 'Groq', logo: '/groq.png' },
  openrouter: { name: 'OpenRouter', logo: '/logos/open-router.svg' },
  xai: { name: 'xAI (Grok)', logo: '/logos/xai.png' },
  mistral: { name: 'Mistral', logo: '/logos/Mistral.png' }
};

interface SelectedModels {
  [providerId: string]: string[];
}

interface ProviderEnabled {
  [providerId: string]: boolean;
}

export default function ModelSelector() {
  const [apiKeys, setApiKeys] = useState<{[key: string]: string}>({});
  const [enabledProviders, setEnabledProviders] = useState<ProviderEnabled>({});
  const [selectedModels, setSelectedModels] = useState<SelectedModels>({});
  const [expandedProviders, setExpandedProviders] = useState<{[key: string]: boolean}>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load API keys and previous selections
  useEffect(() => {
    try {
      const storedKeys = localStorage.getItem('playground_api_keys');
      const storedEnabled = localStorage.getItem('playground_enabled_providers');
      const storedModels = localStorage.getItem('playground_selected_models');

      if (storedKeys) {
        setApiKeys(JSON.parse(storedKeys));
      }
      if (storedEnabled) {
        setEnabledProviders(JSON.parse(storedEnabled));
      }
      if (storedModels) {
        setSelectedModels(JSON.parse(storedModels));
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save enabled providers to localStorage
  const saveEnabledProviders = (newEnabled: ProviderEnabled) => {
    try {
      localStorage.setItem('playground_enabled_providers', JSON.stringify(newEnabled));
      setEnabledProviders(newEnabled);
    } catch (error) {
      console.error('Error saving enabled providers:', error);
    }
  };

  // Save selected models to localStorage
  const saveSelectedModels = (newModels: SelectedModels) => {
    try {
      localStorage.setItem('playground_selected_models', JSON.stringify(newModels));
      setSelectedModels(newModels);
    } catch (error) {
      console.error('Error saving selected models:', error);
    }
  };

  // Toggle provider enabled/disabled
  const toggleProvider = (providerId: string) => {
    const newEnabled = { ...enabledProviders, [providerId]: !enabledProviders[providerId] };
    saveEnabledProviders(newEnabled);

    // If disabling provider, clear its selected models
    if (!newEnabled[providerId]) {
      const newModels = { ...selectedModels };
      delete newModels[providerId];
      saveSelectedModels(newModels);
    }
  };

  // Toggle model selection
  const toggleModel = (providerId: string, modelId: string) => {
    const currentModels = selectedModels[providerId] || [];
    const newModels = { ...selectedModels };

    if (currentModels.includes(modelId)) {
      newModels[providerId] = currentModels.filter(id => id !== modelId);
    } else {
      newModels[providerId] = [...currentModels, modelId];
    }

    saveSelectedModels(newModels);
  };

  // Toggle provider expansion
  const toggleExpansion = (providerId: string) => {
    setExpandedProviders(prev => ({ ...prev, [providerId]: !prev[providerId] }));
  };

  // Check if provider has valid API key
  const hasValidApiKey = (providerId: string): boolean => {
    const key = apiKeys[providerId];
    return Boolean(key && key.length > 10);
  };

  // Get capability icon
  const getCapabilityIcon = (capability: string) => {
    switch (capability) {
      case 'text': return <Brain className="h-3 w-3" />;
      case 'vision': return <Eye className="h-3 w-3" />;
      case 'code': return <Code className="h-3 w-3" />;
      case 'reasoning': return <Zap className="h-3 w-3" />;
      case 'multilingual': return <Globe className="h-3 w-3" />;
      default: return null;
    }
  };

  if (!isLoaded) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const availableProviders = Object.keys(PROVIDER_INFO).filter(hasValidApiKey);
  const enabledCount = availableProviders.filter(id => enabledProviders[id]).length;
  const totalSelectedModels = Object.values(selectedModels).reduce((sum, models) => sum + models.length, 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-lg">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-holistic-blurple to-holistic-cerulean rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-normal text-gray-900">Model Selection</h2>
              <p className="text-sm text-gray-600">
                {enabledCount} providers enabled • {totalSelectedModels} models selected
              </p>
            </div>
          </div>
        </div>

        {availableProviders.length === 0 && (
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Settings className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-amber-800">No API Keys Configured</h3>
                <p className="text-sm text-amber-700 mt-1">
                  Configure your API keys above to select models for testing.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Model Selection */}
      <div className="p-6">
        <div className="space-y-4">
          {availableProviders.map((providerId) => {
            const provider = PROVIDER_INFO[providerId as keyof typeof PROVIDER_INFO];
            const models = PROVIDER_MODELS[providerId] || [];
            const isEnabled = enabledProviders[providerId];
            const isExpanded = expandedProviders[providerId];
            const providerSelectedModels = selectedModels[providerId] || [];

            return (
              <div
                key={providerId}
                className={`border rounded-lg transition-all ${
                  isEnabled ? 'border-green-200 bg-green-50/30' : 'border-gray-200'
                }`}
              >
                {/* Provider Header */}
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Image
                        src={provider.logo}
                        alt={provider.name}
                        width={24}
                        height={24}
                        className="w-6 h-6 object-contain"
                        onError={(e) => {
                          e.currentTarget.src = '/logos/default.png';
                        }}
                      />
                      <span className="font-medium text-gray-900">{provider.name}</span>
                      {isEnabled && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          {providerSelectedModels.length} selected
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleExpansion(providerId)}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => toggleProvider(providerId)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          isEnabled ? 'bg-holistic-blurple' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            isEnabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Model List */}
                {isEnabled && isExpanded && (
                  <div className="border-t border-gray-200 p-4">
                    <div className="grid gap-3">
                      {models.map((model) => {
                        const isSelected = providerSelectedModels.includes(model.id);
                        
                        return (
                          <div
                            key={model.id}
                            onClick={() => toggleModel(providerId, model.id)}
                            className={`p-3 border rounded-lg cursor-pointer transition-all ${
                              isSelected 
                                ? 'border-holistic-blurple bg-blue-50' 
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-gray-900">{model.name}</span>
                                  <span className="text-xs text-gray-500">
                                    {model.contextLength} context • {model.maxTokens} output
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{model.description}</p>
                                <div className="flex items-center gap-2">
                                  {model.capabilities.map((capability) => (
                                    <div
                                      key={capability}
                                      className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full"
                                    >
                                      {getCapabilityIcon(capability)}
                                      <span className="capitalize">{capability}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className={`w-4 h-4 rounded border-2 transition-colors ${
                                isSelected 
                                  ? 'bg-holistic-blurple border-holistic-blurple' 
                                  : 'border-gray-300'
                              }`}>
                                {isSelected && (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
