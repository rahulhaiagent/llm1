'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { 
  Send, 
  Settings, 
  MessageSquare, 
  Clock, 
  Copy, 
  RotateCcw, 
  User, 
  LogOut,
  Zap,
  Check,
  GripVertical,
  ArrowLeft,
  ArrowRight,
  Download,
  Upload,
  FileText,
  BarChart3,
  Lightbulb
} from 'lucide-react';

interface ChatMessage {
  id: string;
  content: string;
  timestamp: Date;
  type: 'user' | 'assistant';
}

interface ModelResponse {
  modelId: string;
  providerId: string;
  content: string;
  isStreaming: boolean;
  isComplete: boolean;
  startTime?: Date;
  endTime?: Date;
  error?: string;
}

interface ChatSession {
  messages: ChatMessage[];
  responses: { [messageId: string]: ModelResponse[] };
}

const PROVIDER_INFO = {
  openai: { name: 'OpenAI', logo: '/logos/openai.png' },
  anthropic: { name: 'Anthropic', logo: '/logos/anthropic.png' },
  google: { name: 'Google', logo: '/logos/gemini.png' },
  groq: { name: 'Groq', logo: '/groq.png' },
  openrouter: { name: 'OpenRouter', logo: '/logos/open-router.svg' },
  xai: { name: 'xAI', logo: '/logos/xai.png' },
  mistral: { name: 'Mistral', logo: '/logos/Mistral.png' }
};

const PROVIDER_MODELS: { [providerId: string]: { id: string; name: string; }[] } = {
  openai: [
    { id: 'gpt-4o', name: 'GPT-4o' },
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
    { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' }
  ],
  anthropic: [
    { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet' },
    { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku' },
    { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus' }
  ],
  google: [
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
    { id: 'gemini-pro', name: 'Gemini Pro' }
  ],
  groq: [
    { id: 'llama-3.2-90b-text-preview', name: 'Llama 3.2 90B' },
    { id: 'llama-3.1-70b-versatile', name: 'Llama 3.1 70B' },
    { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B' }
  ],
  openrouter: [
    { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet' },
    { id: 'openai/gpt-4o', name: 'GPT-4o' },
    { id: 'meta-llama/llama-3.2-90b-instruct', name: 'Llama 3.2 90B' }
  ],
  xai: [
    { id: 'grok-beta', name: 'Grok Beta' },
    { id: 'grok-2-latest', name: 'Grok 2' }
  ],
  mistral: [
    { id: 'mistral-large-latest', name: 'Mistral Large' },
    { id: 'mistral-small-latest', name: 'Mistral Small' },
    { id: 'codestral-latest', name: 'Codestral' }
  ]
};

interface PlaygroundDashboardProps {
  onReset: () => void;
}

export default function PlaygroundDashboard({ onReset }: PlaygroundDashboardProps) {
  const [apiKeys, setApiKeys] = useState<{[key: string]: string}>({});
  const [selectedModels, setSelectedModels] = useState<{[key: string]: boolean}>({});
  const [chatSession, setChatSession] = useState<ChatSession>({ messages: [], responses: {} });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [columnOrder, setColumnOrder] = useState<string[]>([]);
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load user preferences
  useEffect(() => {
    try {
      const storedKeys = localStorage.getItem('playground_api_keys');
      if (storedKeys) {
        setApiKeys(JSON.parse(storedKeys));
      }
    } catch (error) {
      console.error('Error loading API keys:', error);
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatSession.messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

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

  // Get available providers (those with valid API keys)
  const getAvailableProviders = useCallback((): string[] => {
    return Object.keys(apiKeys).filter(providerId => 
      apiKeys[providerId] && validateApiKey(providerId, apiKeys[providerId])
    );
  }, [apiKeys]);

  // Get all available models
  const getAllAvailableModels = useCallback((): Array<{ providerId: string; modelId: string; modelName: string; providerName: string; logo: string }> => {
    const availableProviders = getAvailableProviders();
    const models: Array<{ providerId: string; modelId: string; modelName: string; providerName: string; logo: string }> = [];
    
    availableProviders.forEach(providerId => {
      const providerModels = PROVIDER_MODELS[providerId] || [];
      providerModels.forEach(model => {
        models.push({
          providerId,
          modelId: model.id,
          modelName: model.name,
          providerName: PROVIDER_INFO[providerId as keyof typeof PROVIDER_INFO]?.name || providerId,
          logo: PROVIDER_INFO[providerId as keyof typeof PROVIDER_INFO]?.logo || '/logos/default.png'
        });
      });
    });
    
    return models;
  }, [getAvailableProviders]);

  // Toggle model selection
  const toggleModel = (modelKey: string) => {
    setSelectedModels(prev => ({
      ...prev,
      [modelKey]: !prev[modelKey]
    }));
  };

  // Get selected models
  const getSelectedModels = () => {
    return getAllAvailableModels().filter(model => 
      selectedModels[`${model.providerId}-${model.modelId}`]
    );
  };

  // Update column order when selected models change
  useEffect(() => {
    const allModels = getAllAvailableModels();
    const selected = allModels.filter(model => 
      selectedModels[`${model.providerId}-${model.modelId}`]
    );
    const newOrder = selected.map(model => `${model.providerId}-${model.modelId}`);
    
    setColumnOrder(prevOrder => {
      // Preserve existing order for models that are still selected
      const preservedOrder = prevOrder.filter(modelKey => 
        newOrder.includes(modelKey)
      );
      
      // Add new models to the end
      const addedModels = newOrder.filter(modelKey => 
        !preservedOrder.includes(modelKey)
      );
      
      return [...preservedOrder, ...addedModels];
    });
  }, [selectedModels, getAllAvailableModels]);

  // Drag and drop handlers
  const handleDragStart = (modelKey: string) => {
    setDraggedColumn(modelKey);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetModelKey: string) => {
    if (!draggedColumn || draggedColumn === targetModelKey) {
      setDraggedColumn(null);
      return;
    }

    const newOrder = [...columnOrder];
    const draggedIndex = newOrder.indexOf(draggedColumn);
    const targetIndex = newOrder.indexOf(targetModelKey);

    // Remove dragged item and insert at target position
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedColumn);

    setColumnOrder(newOrder);
    setDraggedColumn(null);
  };

  const handleDragEnd = () => {
    setDraggedColumn(null);
  };

  // Move column left/right
  const moveColumn = (modelKey: string, direction: 'left' | 'right') => {
    const currentIndex = columnOrder.indexOf(modelKey);
    if (currentIndex === -1) return;

    const newOrder = [...columnOrder];
    const targetIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= newOrder.length) return;

    // Swap positions
    [newOrder[currentIndex], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[currentIndex]];
    setColumnOrder(newOrder);
  };

  // Move column to first position
  const moveToFirst = (modelKey: string) => {
    const newOrder = columnOrder.filter(key => key !== modelKey);
    setColumnOrder([modelKey, ...newOrder]);
  };

  // Get responses for a specific model
  const getModelResponses = (modelKey: string): Array<{messageId: string, response: ModelResponse, userMessage: ChatMessage}> => {
    const results: Array<{messageId: string, response: ModelResponse, userMessage: ChatMessage}> = [];
    
    chatSession.messages.forEach(message => {
      if (message.type === 'user') {
        const responses = chatSession.responses[message.id] || [];
        const modelResponse = responses.find(r => `${r.providerId}-${r.modelId}` === modelKey);
        if (modelResponse) {
          results.push({
            messageId: message.id,
            response: modelResponse,
            userMessage: message
          });
        }
      }
    });
    
    return results;
  };

  // Simulate API call
  const simulateApiCall = async (
    providerId: string, 
    modelId: string, 
    modelName: string,
    prompt: string,
    messageId: string
  ): Promise<void> => {
    const words = [
      'I understand your question about', 'Let me help you with that.', 'Here\'s what I think:',
      'Based on my analysis,', 'The answer depends on several factors.',
      'From my perspective,', 'I\'d be happy to explain this.',
      'This is an interesting question.', 'Let me break this down for you.',
      'In my experience,', 'The key consideration here is',
      'I should mention that', 'It\'s worth noting that',
      'The main point is', 'To summarize,', 'In conclusion,'
    ];
    
    const response = `${words[Math.floor(Math.random() * words.length)]} ${prompt.substring(0, 50)}... This is a simulated response from ${modelName}. In a real implementation, this would be streaming from the actual ${PROVIDER_INFO[providerId as keyof typeof PROVIDER_INFO]?.name} API with real model responses.`;
    
    // Simulate streaming
    const chunks = response.split(' ');
    let currentContent = '';
    
    for (let i = 0; i < chunks.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
      currentContent += (i > 0 ? ' ' : '') + chunks[i];
      
      setChatSession(prev => {
        const newResponses = { ...prev.responses };
        if (!newResponses[messageId]) {
          newResponses[messageId] = [];
        }
        
        const responseIndex = newResponses[messageId].findIndex(
          r => r.providerId === providerId && r.modelId === modelId
        );
        
        if (responseIndex >= 0) {
          newResponses[messageId][responseIndex] = {
            ...newResponses[messageId][responseIndex],
            content: currentContent,
            isStreaming: i < chunks.length - 1,
            isComplete: i === chunks.length - 1,
            endTime: i === chunks.length - 1 ? new Date() : undefined
          };
        } else {
          newResponses[messageId].push({
            modelId,
            providerId,
            content: currentContent,
            isStreaming: i < chunks.length - 1,
            isComplete: i === chunks.length - 1,
            startTime: new Date(),
            endTime: i === chunks.length - 1 ? new Date() : undefined
          });
        }
        
        return { ...prev, responses: newResponses };
      });
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const selectedModelsList = getSelectedModels();
    if (selectedModelsList.length === 0) {
      alert('Please select at least one model from the sidebar.');
      return;
    }

    const messageId = Date.now().toString();
    const userMessage: ChatMessage = {
      id: messageId,
      content: input.trim(),
      timestamp: new Date(),
      type: 'user'
    };

    // Add user message
    setChatSession(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      responses: { ...prev.responses, [messageId]: [] }
    }));

    setInput('');
    setIsLoading(true);

    // Simulate API calls for all selected models
    const promises = selectedModelsList.map(({ providerId, modelId, modelName }) =>
      simulateApiCall(providerId, modelId, modelName, userMessage.content, messageId)
    );

    try {
      await Promise.all(promises);
    } catch (error) {
      console.error('Error in API calls:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const clearChat = () => {
    setChatSession({ messages: [], responses: {} });
  };

  // Export conversation to JSON
  const exportConversation = () => {
    if (chatSession.messages.length === 0) {
      alert('No conversation to export');
      return;
    }

    const exportData = {
      timestamp: new Date().toISOString(),
      models: getSelectedModels().map(m => ({
        providerId: m.providerId,
        modelId: m.modelId,
        modelName: m.modelName
      })),
      conversation: chatSession
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `playground-conversation-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Import conversation from JSON
  const importConversation = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target?.result as string);
        
        if (importData.conversation && importData.conversation.messages) {
          // Parse dates back from strings for messages
          const parsedMessages = importData.conversation.messages.map((msg: ChatMessage) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          
          // Parse dates back from strings for responses
          const parsedResponses: {[key: string]: ModelResponse[]} = {};
          
          if (importData.conversation.responses) {
            Object.keys(importData.conversation.responses).forEach(messageId => {
              parsedResponses[messageId] = importData.conversation.responses[messageId].map((response: ModelResponse) => ({
                ...response,
                startTime: response.startTime ? new Date(response.startTime) : undefined,
                endTime: response.endTime ? new Date(response.endTime) : undefined
              }));
            });
          }
          
          setChatSession({
            messages: parsedMessages,
            responses: parsedResponses
          });
          
          alert(`Imported conversation with ${parsedMessages.length} messages`);
        } else {
          alert('Invalid conversation file format');
        }
      } catch (error) {
        alert('Error importing conversation file');
        console.error('Import error:', error);
      }
    };
    reader.readAsText(file);
    
    // Reset input
    event.target.value = '';
  };

  // Get conversation statistics
  const getConversationStats = () => {
    const userMessages = chatSession.messages.filter(m => m.type === 'user').length;
    const totalResponses = Object.values(chatSession.responses).reduce(
      (sum, responses) => sum + responses.length, 0
    );
    
    // Calculate average response time with proper date handling
    const responseTimes = Object.values(chatSession.responses)
      .flat()
      .filter(r => r.startTime && r.endTime)
      .map(r => {
        try {
          // Ensure we have Date objects
          const startTime = r.startTime instanceof Date ? r.startTime : new Date(r.startTime!);
          const endTime = r.endTime instanceof Date ? r.endTime : new Date(r.endTime!);
          return endTime.getTime() - startTime.getTime();
        } catch (error) {
          console.warn('Error calculating response time:', error);
          return 0;
        }
      })
      .filter(time => time > 0);
    
    const avgResponseTime = responseTimes.length > 0 
      ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length 
      : 0;

    return {
      userMessages,
      totalResponses,
      avgResponseTime: avgResponseTime ? (avgResponseTime / 1000).toFixed(1) : '0'
    };
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getResponseTime = (response: ModelResponse): string => {
    if (!response.startTime || !response.endTime) return '';
    const ms = response.endTime.getTime() - response.startTime.getTime();
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const allModels = getAllAvailableModels();
  const selectedCount = getSelectedModels().length;

  return (
    <div className="flex-1 flex bg-gray-50 min-h-0">
      {/* Left Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col min-h-0">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-normal text-gray-900">AI Playground</h1>
            <button
              onClick={onReset}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Reset API Keys"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>
          
          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-sm text-gray-600">
                {selectedCount} of {allModels.length} models selected
              </p>
              {selectedCount > 0 && (
                <p className="text-xs text-gray-500">
                  Chatting with {selectedCount} model{selectedCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>

            {/* Chat Controls */}
            {selectedCount > 0 && (
              <div className="flex flex-wrap gap-2">
                {chatSession.messages.length > 0 && (
                  <>
                    <button
                      onClick={clearChat}
                      className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                      title="Clear Chat"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Clear
                    </button>
                    
                    <button
                      onClick={exportConversation}
                      className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                      title="Export Conversation"
                    >
                      <Download className="h-3 w-3" />
                      Export
                    </button>
                    
                    <button
                      onClick={() => setShowStats(!showStats)}
                      className="flex items-center gap-1 px-2 py-1 text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-md transition-colors"
                      title="View Statistics"
                    >
                      <BarChart3 className="h-3 w-3" />
                      Stats
                    </button>

                    <button
                      onClick={() => setShowComparison(!showComparison)}
                      className="flex items-center gap-1 px-2 py-1 text-xs text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-md transition-colors"
                      title="Compare Latest Responses"
                    >
                      <FileText className="h-3 w-3" />
                      Compare
                    </button>
                  </>
                )}
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-green-600 hover:text-green-700 hover:bg-green-50 rounded-md transition-colors"
                  title="Import Conversation"
                >
                  <Upload className="h-3 w-3" />
                  Import
                </button>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={importConversation}
                  className="hidden"
                />
              </div>
            )}

            {/* Statistics Panel */}
            {showStats && chatSession.messages.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-3 text-xs space-y-2">
                <div className="font-medium text-gray-700 flex items-center gap-1">
                  <BarChart3 className="h-3 w-3" />
                  Conversation Stats
                </div>
                {(() => {
                  const stats = getConversationStats();
                  return (
                    <div className="space-y-1 text-gray-600">
                      <div>Messages: {stats.userMessages}</div>
                      <div>Responses: {stats.totalResponses}</div>
                      <div>Avg. Response: {stats.avgResponseTime}s</div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Comparison Panel */}
            {showComparison && chatSession.messages.length > 0 && (
              <div className="bg-orange-50 rounded-lg p-3 text-xs space-y-2">
                <div className="font-medium text-orange-700 flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  Latest Response Comparison
                </div>
                {(() => {
                  const lastUserMessage = chatSession.messages.filter(m => m.type === 'user').slice(-1)[0];
                  if (!lastUserMessage) return <div className="text-orange-600">No messages to compare</div>;
                  
                  const responses = chatSession.responses[lastUserMessage.id] || [];
                  if (responses.length < 2) return <div className="text-orange-600">Need at least 2 responses to compare</div>;
                  
                  const avgLength = responses.reduce((sum, r) => sum + r.content.length, 0) / responses.length;
                  const longest = responses.reduce((max, r) => r.content.length > max.content.length ? r : max);
                  const shortest = responses.reduce((min, r) => r.content.length < min.content.length ? r : min);
                  
                  return (
                    <div className="space-y-1 text-orange-600">
                      <div>Responses: {responses.length}</div>
                      <div>Avg. Length: {Math.round(avgLength)} chars</div>
                      <div>Longest: {PROVIDER_MODELS[longest.providerId]?.find(m => m.id === longest.modelId)?.name || longest.modelId}</div>
                      <div>Shortest: {PROVIDER_MODELS[shortest.providerId]?.find(m => m.id === shortest.modelId)?.name || shortest.modelId}</div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>

        {/* Models List */}
        <div className="flex-1 overflow-y-auto p-4 min-h-0">
          {allModels.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-8 w-8 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No models available</p>
              <button
                onClick={onReset}
                className="text-sm text-holistic-blurple hover:text-holistic-blurple/80 font-medium mt-2"
              >
                Add API Keys
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {allModels.map((model) => {
                const modelKey = `${model.providerId}-${model.modelId}`;
                const isSelected = selectedModels[modelKey];
                
                return (
                  <button
                    key={modelKey}
                    onClick={() => toggleModel(modelKey)}
                    className={`w-full p-3 rounded-lg border text-left transition-all ${
                      isSelected 
                        ? 'border-holistic-blurple bg-blue-50 text-holistic-blurple' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src={model.logo}
                        alt={model.providerName}
                        width={20}
                        height={20}
                        className="w-5 h-5 object-contain flex-shrink-0"
                        onError={(e) => {
                          e.currentTarget.src = '/logos/default.png';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{model.modelName}</div>
                        <div className="text-xs opacity-75 truncate">{model.providerName}</div>
                      </div>
                      {isSelected && (
                        <Check className="h-4 w-4 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Chat Templates */}
        {selectedCount > 0 && (
          <div className="border-t border-gray-200 p-4 flex-shrink-0">
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-medium text-gray-700">Quick Prompts</span>
              </div>
              <div className="space-y-2">
                {[
                  {
                    name: "Compare & Explain",
                    prompt: "Compare these two approaches and explain the pros and cons of each:"
                  },
                  {
                    name: "Creative Writing",
                    prompt: "Write a creative short story about:"
                  },
                  {
                    name: "Code Review",
                    prompt: "Review this code and suggest improvements for readability, performance, and best practices:"
                  },
                  {
                    name: "Analysis",
                    prompt: "Analyze the following and provide insights:"
                  },
                  {
                    name: "Problem Solving",
                    prompt: "Help me solve this problem step by step:"
                  }
                ].map((template, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(template.prompt)}
                    className="w-full text-left px-2 py-1.5 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                    title={template.prompt}
                  >
                    {template.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={onReset}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Reset API Keys
          </button>
        </div>
      </div>

      {/* Right Chat Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Chat Messages - Column Layout */}
        <div className="flex-1 bg-gray-50 min-h-0">
          {chatSession.messages.length === 0 || selectedCount === 0 ? (
            <div className="flex-1 flex items-center justify-center h-full p-6">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 mx-auto bg-gray-200 rounded-2xl flex items-center justify-center mb-4">
                  <MessageSquare className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-normal text-gray-900 mb-2">
                  {selectedCount > 0 ? 'Start a conversation' : 'Select models to begin'}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {selectedCount > 0 
                    ? 'Type your message below to get responses from all selected AI models simultaneously.'
                    : 'Choose AI models from the sidebar, then start chatting to compare their responses side-by-side.'
                  }
                </p>
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-0">
              {columnOrder.map((modelKey, columnIndex) => {
                const model = getAllAvailableModels().find(m => `${m.providerId}-${m.modelId}` === modelKey);
                if (!model) return null;

                const modelResponses = getModelResponses(modelKey);
                const isFirst = columnIndex === 0;
                const isLast = columnIndex === columnOrder.length - 1;

                return (
                  <div
                    key={modelKey}
                    className={`flex-1 min-w-0 border-r border-gray-200 bg-white flex flex-col min-h-0 ${
                      draggedColumn === modelKey ? 'opacity-50' : ''
                    }`}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(modelKey)}
                  >
                    {/* Column Header */}
                    <div 
                      className="bg-white border-b border-gray-200 p-4 cursor-move flex-shrink-0"
                      draggable
                      onDragStart={() => handleDragStart(modelKey)}
                      onDragEnd={handleDragEnd}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                          <GripVertical className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <Image
                            src={model.logo}
                            alt={model.providerName}
                            width={20}
                            height={20}
                            className="w-5 h-5 object-contain flex-shrink-0"
                            onError={(e) => {
                              e.currentTarget.src = '/logos/default.png';
                            }}
                          />
                          <div className="min-w-0">
                            <div className="font-medium text-sm text-gray-900 truncate">{model.modelName}</div>
                            <div className="text-xs text-gray-500 truncate">{model.providerName}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          {!isFirst && (
                            <button
                              onClick={() => moveColumn(modelKey, 'left')}
                              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                              title="Move left"
                            >
                              <ArrowLeft className="h-3 w-3" />
                            </button>
                          )}
                          {!isLast && (
                            <button
                              onClick={() => moveColumn(modelKey, 'right')}
                              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                              title="Move right"
                            >
                              <ArrowRight className="h-3 w-3" />
                            </button>
                          )}
                          {!isFirst && (
                            <button
                              onClick={() => moveToFirst(modelKey)}
                              className="p-1 text-xs text-holistic-blurple hover:text-holistic-blurple/80 transition-colors font-medium"
                              title="Move to first"
                            >
                              1st
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Column Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                      {modelResponses.length === 0 ? (
                        <div className="text-center py-8">
                          <div className="w-12 h-12 mx-auto bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                            <MessageSquare className="w-6 h-6 text-gray-400" />
                          </div>
                          <p className="text-sm text-gray-500">No messages yet</p>
                        </div>
                      ) : (
                        <>
                          {modelResponses.map(({ messageId, response, userMessage }) => (
                            <div key={messageId} className="space-y-3">
                              {/* User Message */}
                              <div className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="w-6 h-6 bg-holistic-blurple rounded-lg flex items-center justify-center">
                                    <User className="w-3 h-3 text-white" />
                                  </div>
                                  <span className="text-xs text-gray-500">{formatTimestamp(userMessage.timestamp)}</span>
                                </div>
                                <div className="text-sm text-gray-900 leading-relaxed font-roobert">
                                  {userMessage.content}
                                </div>
                              </div>

                              {/* AI Response */}
                              <div className="bg-white border border-gray-200 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <Image
                                      src={model.logo}
                                      alt={model.providerName}
                                      width={16}
                                      height={16}
                                      className="w-4 h-4 object-contain"
                                    />
                                    {response.isStreaming && (
                                      <div className="flex items-center gap-1 text-blue-600">
                                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></div>
                                        <span className="text-xs font-medium">Generating...</span>
                                      </div>
                                    )}
                                    {response.isComplete && (
                                      <div className="flex items-center gap-1 text-green-600">
                                        <Clock className="w-3 h-3" />
                                        <span className="text-xs font-medium">{getResponseTime(response)}</span>
                                      </div>
                                    )}
                                  </div>
                                  
                                  <button
                                    onClick={() => copyToClipboard(response.content)}
                                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                  >
                                    <Copy className="h-3 w-3" />
                                  </button>
                                </div>
                                
                              <div className="text-sm text-gray-900 leading-relaxed font-roobert">
                                {response.content}
                                {response.isStreaming && (
                                  <span className="inline-block w-2 h-4 bg-holistic-blurple ml-1 animate-pulse"></span>
                                )}
                              </div>
                              
                              {/* Response Metrics */}
                              {response.isComplete && (
                                <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                                  <span>{response.content.length} chars</span>
                                  <span>{response.content.split(' ').length} words</span>
                                  <span>{response.content.split('\n').length} lines</span>
                                </div>
                              )}
                              
                              {response.error && (
                                <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                                  Error: {response.error}
                                </div>
                              )}
                              </div>
                            </div>
                          ))}
                          <div ref={messagesEndRef} />
                        </>
                       )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="bg-white border-t border-gray-200 p-6 flex-shrink-0">
          <div className="max-w-4xl mx-auto">
            {selectedCount > 0 ? (
              <div className="flex items-end gap-3">
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
                    className="w-full min-h-[56px] max-h-32 px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-holistic-blurple/20 focus:border-holistic-blurple transition-colors resize-none text-sm font-roobert leading-relaxed"
                    disabled={isLoading}
                  />
                </div>
                
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className={`p-4 rounded-xl transition-all ${
                    !input.trim() || isLoading
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-holistic-blurple text-white hover:bg-holistic-blurple/90 transform hover:scale-105'
                  }`}
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Zap className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-500 mb-3">Select models from the sidebar to start chatting</p>
              </div>
            )}
            
            {selectedCount > 0 && (
              <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">
                <Zap className="h-3 w-3" />
                <span>
                  Sending to {selectedCount} model{selectedCount !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
