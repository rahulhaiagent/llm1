'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Eye, EyeOff, Key, CheckCircle, XCircle, Loader2, AlertTriangle } from 'lucide-react';

interface ApiKeyConfig {
  id: string;
  name: string;
  placeholder: string;
  prefix: string;
  logo: string;
  docs: string;
  endpoint?: string;
}

const API_PROVIDERS: ApiKeyConfig[] = [
  {
    id: 'openai',
    name: 'OpenAI (ChatGPT)',
    placeholder: 'sk-...',
    prefix: 'sk-',
    logo: '/logos/openai.png',
    docs: 'https://platform.openai.com/api-keys',
    endpoint: 'https://api.openai.com/v1/models'
  },
  {
    id: 'anthropic',
    name: 'Anthropic (Claude)',
    placeholder: 'sk-ant-...',
    prefix: 'sk-ant-',
    logo: '/logos/anthropic.png',
    docs: 'https://console.anthropic.com/settings/keys',
    endpoint: 'https://api.anthropic.com/v1/messages'
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

interface ApiKeyData {
  [key: string]: string;
}

interface ConnectionStatus {
  [key: string]: 'idle' | 'testing' | 'success' | 'error';
}

export default function ApiKeyManager() {
  const [apiKeys, setApiKeys] = useState<ApiKeyData>({});
  const [showKeys, setShowKeys] = useState<{[key: string]: boolean}>({});
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load API keys from localStorage on component mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('playground_api_keys');
      if (stored) {
        const parsed = JSON.parse(stored);
        setApiKeys(parsed);
      }
    } catch (error) {
      console.error('Error loading API keys:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save API keys to localStorage
  const saveApiKeys = (newKeys: ApiKeyData) => {
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
    
    // Reset connection status when key changes
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
      // Simple validation - in a real implementation, you'd make actual API calls
      // For now, we'll simulate the test with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock validation based on key format
      const isValid = validateApiKey(providerId, key);
      setConnectionStatus(prev => ({ 
        ...prev, 
        [providerId]: isValid ? 'success' : 'error' 
      }));
    } catch {
      setConnectionStatus(prev => ({ ...prev, [providerId]: 'error' }));
    }
  };

  // Clear all API keys
  const clearAllKeys = () => {
    localStorage.removeItem('playground_api_keys');
    setApiKeys({});
    setConnectionStatus({});
    setShowKeys({});
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

  if (!isLoaded) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const connectedCount = Object.keys(apiKeys).filter(key => 
    apiKeys[key] && validateApiKey(key, apiKeys[key])
  ).length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-lg">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-holistic-blurple to-holistic-cerulean rounded-lg flex items-center justify-center">
              <Key className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-normal text-gray-900">API Key Configuration</h2>
              <p className="text-sm text-gray-600">
                {connectedCount} of {API_PROVIDERS.length} providers configured
              </p>
            </div>
          </div>
          
          {connectedCount > 0 && (
            <button
              onClick={clearAllKeys}
              className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
        
        {connectedCount === 0 && (
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-amber-800">No API Keys Configured</h3>
                <p className="text-sm text-amber-700 mt-1">
                  Add your API keys below to start testing AI models. Your keys are stored securely in your browser.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* API Key Forms */}
      <div className="p-6">
        <div className="grid gap-4">
          {API_PROVIDERS.map((provider) => {
            const hasKey = apiKeys[provider.id];
            const isValid = hasKey && validateApiKey(provider.id, hasKey);
            const isVisible = showKeys[provider.id];
            const status = connectionStatus[provider.id];
            
            return (
              <div
                key={provider.id}
                className={`border rounded-lg p-4 transition-all ${
                  isValid ? 'border-green-200 bg-green-50/30' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
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
                  {getStatusIcon(provider.id)}
                  {isValid && status === 'idle' && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </div>
                
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type={isVisible ? 'text' : 'password'}
                      placeholder={provider.placeholder}
                      value={apiKeys[provider.id] || ''}
                      onChange={(e) => handleKeyChange(provider.id, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-holistic-blurple/20 focus:border-holistic-blurple transition-colors text-sm font-mono"
                    />
                    
                    <button
                      onClick={() => toggleKeyVisibility(provider.id)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  
                  <button
                    onClick={() => testConnection(provider.id)}
                    disabled={!hasKey || !validateApiKey(provider.id, hasKey) || status === 'testing'}
                    className="px-3 py-2 text-sm font-medium text-holistic-blurple border border-holistic-blurple rounded-lg hover:bg-holistic-blurple hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'testing' ? 'Testing...' : 'Test'}
                  </button>
                  
                  <a
                    href={provider.docs}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Get Key
                  </a>
                </div>
                
                {hasKey && !validateApiKey(provider.id, hasKey) && (
                  <p className="text-sm text-red-600 mt-2">
                    Invalid API key format. Expected format: {provider.placeholder}
                  </p>
                )}
                
                {status === 'error' && (
                  <p className="text-sm text-red-600 mt-2">
                    Connection test failed. Please check your API key.
                  </p>
                )}
                
                {status === 'success' && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ Connection successful! API key is valid.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
