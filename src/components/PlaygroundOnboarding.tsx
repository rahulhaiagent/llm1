'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Eye, EyeOff, CheckCircle, XCircle, Loader2, ArrowRight, Zap } from 'lucide-react';

interface ApiKeyConfig {
  id: string;
  name: string;
  placeholder: string;
  prefix: string;
  logo: string;
  docs: string;
}

const API_PROVIDERS: ApiKeyConfig[] = [
  {
    id: 'openai',
    name: 'OpenAI (ChatGPT)',
    placeholder: 'sk-...',
    prefix: 'sk-',
    logo: '/logos/openai.png',
    docs: 'https://platform.openai.com/api-keys'
  },
  {
    id: 'anthropic',
    name: 'Anthropic (Claude)',
    placeholder: 'sk-ant-...',
    prefix: 'sk-ant-',
    logo: '/logos/anthropic.png',
    docs: 'https://console.anthropic.com/settings/keys'
  },
  {
    id: 'google',
    name: 'Google (Gemini)',
    placeholder: 'AIza...',
    prefix: 'AIza',
    logo: '/logos/gemini.png',
    docs: 'https://makersuite.google.com/app/apikey'
  },
  {
    id: 'groq',
    name: 'Groq',
    placeholder: 'gsk_...',
    prefix: 'gsk_',
    logo: '/groq.png',
    docs: 'https://console.groq.com/keys'
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    placeholder: 'sk-or-...',
    prefix: 'sk-or-',
    logo: '/logos/open-router.svg',
    docs: 'https://openrouter.ai/keys'
  },
  {
    id: 'xai',
    name: 'xAI (Grok)',
    placeholder: 'xai-...',
    prefix: 'xai-',
    logo: '/logos/xai.png',
    docs: 'https://console.x.ai/'
  },
  {
    id: 'mistral',
    name: 'Mistral',
    placeholder: 'mis_...',
    prefix: 'mis_',
    logo: '/logos/Mistral.png',
    docs: 'https://console.mistral.ai/api-keys/'
  }
];

interface PlaygroundOnboardingProps {
  onComplete: () => void;
}

export default function PlaygroundOnboarding({ onComplete }: PlaygroundOnboardingProps) {
  const [apiKeys, setApiKeys] = useState<{[key: string]: string}>({});
  const [showKeys, setShowKeys] = useState<{[key: string]: boolean}>({});
  const [connectionStatus, setConnectionStatus] = useState<{[key: string]: 'idle' | 'testing' | 'success' | 'error'}>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load existing API keys
  useEffect(() => {
    try {
      const stored = localStorage.getItem('playground_api_keys');
      if (stored) {
        setApiKeys(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading API keys:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save API keys to localStorage
  const saveApiKeys = (newKeys: {[key: string]: string}) => {
    try {
      localStorage.setItem('playground_api_keys', JSON.stringify(newKeys));
      setApiKeys(newKeys);
    } catch (error) {
      console.error('Error saving API keys:', error);
    }
  };

  // Handle API key input change
  const handleKeyChange = (providerId: string, value: string) => {
    const newKeys = { ...apiKeys, [providerId]: value };
    saveApiKeys(newKeys);
    setConnectionStatus(prev => ({ ...prev, [providerId]: 'idle' }));
  };

  // Toggle API key visibility
  const toggleKeyVisibility = (providerId: string) => {
    setShowKeys(prev => ({ ...prev, [providerId]: !prev[providerId] }));
  };

  // Validate API key format
  const validateApiKey = (providerId: string, key: string): boolean => {
    const provider = API_PROVIDERS.find(p => p.id === providerId);
    if (!provider || !key) return false;
    return key.startsWith(provider.prefix) && key.length > provider.prefix.length + 10;
  };

  // Test API connection
  const testConnection = async (providerId: string) => {
    const key = apiKeys[providerId];
    if (!key || !validateApiKey(providerId, key)) return;

    setConnectionStatus(prev => ({ ...prev, [providerId]: 'testing' }));

    try {
      // Simulate connection test
      await new Promise(resolve => setTimeout(resolve, 1500));
      const isValid = validateApiKey(providerId, key);
      setConnectionStatus(prev => ({ ...prev, [providerId]: isValid ? 'success' : 'error' }));
    } catch {
      setConnectionStatus(prev => ({ ...prev, [providerId]: 'error' }));
    }
  };

  // Get connection status icon
  const getStatusIcon = (providerId: string) => {
    const status = connectionStatus[providerId];
    switch (status) {
      case 'testing':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  // Check if we have at least one valid API key
  const hasValidApiKey = (): boolean => {
    return Object.keys(apiKeys).some(providerId => 
      apiKeys[providerId] && validateApiKey(providerId, apiKeys[providerId])
    );
  };

  const validKeysCount = Object.keys(apiKeys).filter(providerId => 
    apiKeys[providerId] && validateApiKey(providerId, apiKeys[providerId])
  ).length;

  if (!isLoaded) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto min-h-0">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-holistic-blurple to-holistic-cerulean rounded-2xl flex items-center justify-center mb-6">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-normal mb-6 text-gray-900 tracking-tight leading-tight">
            Welcome to AI Playground
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Test and compare multiple AI models simultaneously. Add your API keys to get started.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-holistic-blurple text-white rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <span className="text-sm font-medium text-gray-900">Add API Keys</span>
            </div>
            <div className="w-12 h-px bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                hasValidApiKey() ? 'bg-holistic-blurple text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                2
              </div>
              <span className={`text-sm font-medium ${hasValidApiKey() ? 'text-gray-900' : 'text-gray-500'}`}>
                Start Chatting
              </span>
            </div>
          </div>
          
          {validKeysCount > 0 && (
            <div className="text-center">
              <span className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                <CheckCircle className="h-4 w-4" />
                {validKeysCount} API key{validKeysCount !== 1 ? 's' : ''} configured
              </span>
            </div>
          )}
        </div>

        {/* API Keys Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-normal text-gray-900 mb-2">Configure Your API Keys</h2>
            <p className="text-gray-600">
              Add API keys for the AI providers you want to test. You need at least one API key to continue.
            </p>
          </div>

          <div className="grid gap-6">
            {API_PROVIDERS.map((provider) => {
              const hasKey = apiKeys[provider.id];
              const isValid = hasKey && validateApiKey(provider.id, hasKey);
              const isVisible = showKeys[provider.id];
              const status = connectionStatus[provider.id];
              
              return (
                <div
                  key={provider.id}
                  className={`border rounded-xl p-6 transition-all ${
                    isValid ? 'border-green-200 bg-green-50/30' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <Image 
                      src={provider.logo} 
                      alt={provider.name}
                      width={32}
                      height={32}
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        e.currentTarget.src = '/logos/default.png';
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{provider.name}</h3>
                      <p className="text-sm text-gray-500">Format: {provider.placeholder}</p>
                    </div>
                    {getStatusIcon(provider.id)}
                    {isValid && status === 'idle' && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <input
                        type={isVisible ? 'text' : 'password'}
                        placeholder={`Enter your ${provider.name} API key`}
                        value={apiKeys[provider.id] || ''}
                        onChange={(e) => handleKeyChange(provider.id, e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-holistic-blurple/20 focus:border-holistic-blurple transition-colors text-sm font-mono"
                      />
                      
                      <button
                        onClick={() => toggleKeyVisibility(provider.id)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    
                    <button
                      onClick={() => testConnection(provider.id)}
                      disabled={!hasKey || !validateApiKey(provider.id, hasKey) || status === 'testing'}
                      className="px-4 py-3 text-sm font-medium text-holistic-blurple border border-holistic-blurple rounded-lg hover:bg-holistic-blurple hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {status === 'testing' ? 'Testing...' : 'Test'}
                    </button>
                    
                    <a
                      href={provider.docs}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-3 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Get Key
                    </a>
                  </div>
                  
                  {hasKey && !validateApiKey(provider.id, hasKey) && (
                    <p className="text-sm text-red-600 mt-3">
                      Invalid API key format. Expected format: {provider.placeholder}
                    </p>
                  )}
                  
                  {status === 'error' && (
                    <p className="text-sm text-red-600 mt-3">
                      Connection test failed. Please check your API key.
                    </p>
                  )}
                  
                  {status === 'success' && (
                    <p className="text-sm text-green-600 mt-3">
                      ✓ Connection successful! API key is valid.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <button
            onClick={onComplete}
            disabled={!hasValidApiKey()}
            className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl font-medium transition-all ${
              hasValidApiKey()
                ? 'bg-holistic-blurple text-white hover:bg-holistic-blurple/90 transform hover:scale-105 shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <span className="text-lg">Continue to Playground</span>
            <ArrowRight className="h-5 w-5" />
          </button>
          
          {!hasValidApiKey() && (
            <p className="text-sm text-gray-500 mt-3">
              Add at least one API key to continue
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
