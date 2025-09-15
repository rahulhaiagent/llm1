'use client'

import { useState, useEffect } from 'react';

interface ApiKeyData {
  [key: string]: string;
}

interface SelectedModels {
  [providerId: string]: string[];
}

interface ProviderEnabled {
  [providerId: string]: boolean;
}

export function usePlaygroundStorage() {
  const [apiKeys, setApiKeys] = useState<ApiKeyData>({});
  const [selectedModels, setSelectedModels] = useState<SelectedModels>({});
  const [enabledProviders, setEnabledProviders] = useState<ProviderEnabled>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const storedKeys = localStorage.getItem('playground_api_keys');
      const storedModels = localStorage.getItem('playground_selected_models');
      const storedEnabled = localStorage.getItem('playground_enabled_providers');

      if (storedKeys) {
        setApiKeys(JSON.parse(storedKeys));
      }
      if (storedModels) {
        setSelectedModels(JSON.parse(storedModels));
      }
      if (storedEnabled) {
        setEnabledProviders(JSON.parse(storedEnabled));
      }
    } catch (error) {
      console.error('Error loading playground data:', error);
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

  // Save selected models to localStorage
  const saveSelectedModels = (newModels: SelectedModels) => {
    try {
      localStorage.setItem('playground_selected_models', JSON.stringify(newModels));
      setSelectedModels(newModels);
    } catch (error) {
      console.error('Error saving selected models:', error);
    }
  };

  // Save enabled providers to localStorage
  const saveEnabledProviders = (newEnabled: ProviderEnabled) => {
    try {
      localStorage.setItem('playground_enabled_providers', JSON.stringify(newEnabled));
      setEnabledProviders(newEnabled);
    } catch (error) {
      console.error('Error saving enabled providers:', error);
    }
  };

  // Clear all data
  const clearAllData = () => {
    localStorage.removeItem('playground_api_keys');
    localStorage.removeItem('playground_selected_models');
    localStorage.removeItem('playground_enabled_providers');
    setApiKeys({});
    setSelectedModels({});
    setEnabledProviders({});
  };

  // Validate API key format
  const validateApiKey = (providerId: string, key: string): boolean => {
    const prefixes: { [key: string]: string } = {
      openai: 'sk-',
      anthropic: 'sk-ant-',
      google: 'AIza',
      groq: 'gsk_',
      openrouter: 'sk-or-',
      xai: 'xai-',
      mistral: 'mis_'
    };
    
    const prefix = prefixes[providerId];
    if (!prefix || !key) return false;
    
    return key.startsWith(prefix) && key.length > prefix.length + 10;
  };

  // Check if provider has valid API key
  const hasValidApiKey = (providerId: string): boolean => {
    const key = apiKeys[providerId];
    return Boolean(key && validateApiKey(providerId, key));
  };

  // Get connected providers count
  const getConnectedProvidersCount = (): number => {
    return Object.keys(apiKeys).filter(key => 
      apiKeys[key] && validateApiKey(key, apiKeys[key])
    ).length;
  };

  // Get enabled providers count
  const getEnabledProvidersCount = (): number => {
    return Object.keys(enabledProviders).filter(key => 
      enabledProviders[key] && hasValidApiKey(key)
    ).length;
  };

  // Get total selected models count
  const getTotalSelectedModelsCount = (): number => {
    return Object.values(selectedModels).reduce((sum, models) => sum + models.length, 0);
  };

  return {
    // State
    apiKeys,
    selectedModels,
    enabledProviders,
    isLoaded,
    
    // Actions
    saveApiKeys,
    saveSelectedModels,
    saveEnabledProviders,
    clearAllData,
    
    // Utilities
    validateApiKey,
    hasValidApiKey,
    getConnectedProvidersCount,
    getEnabledProvidersCount,
    getTotalSelectedModelsCount
  };
}
