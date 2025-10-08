'use client'

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Send, Square, Copy, RotateCcw, MessageSquare, Clock, Zap, User } from 'lucide-react';

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
  tokenCount?: number;
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

const MODEL_NAMES: { [key: string]: string } = {
  'gpt-4o': 'GPT-4o',
  'gpt-4o-mini': 'GPT-4o Mini',
  'gpt-4-turbo': 'GPT-4 Turbo',
  'gpt-3.5-turbo': 'GPT-3.5 Turbo',
  'claude-3-5-sonnet-20241022': 'Claude 3.5 Sonnet',
  'claude-3-5-haiku-20241022': 'Claude 3.5 Haiku',
  'claude-3-opus-20240229': 'Claude 3 Opus',
  'gemini-1.5-pro': 'Gemini 1.5 Pro',
  'gemini-1.5-flash': 'Gemini 1.5 Flash',
  'gemini-pro': 'Gemini Pro',
  'llama-3.2-90b-text-preview': 'Llama 3.2 90B',
  'llama-3.1-70b-versatile': 'Llama 3.1 70B',
  'mixtral-8x7b-32768': 'Mixtral 8x7B',
  'anthropic/claude-3.5-sonnet': 'Claude 3.5 Sonnet',
  'openai/gpt-4o': 'GPT-4o',
  'meta-llama/llama-3.2-90b-instruct': 'Llama 3.2 90B',
  'grok-beta': 'Grok Beta',
  'grok-2-latest': 'Grok 2',
  'mistral-large-latest': 'Mistral Large',
  'mistral-small-latest': 'Mistral Small',
  'codestral-latest': 'Codestral'
};

export default function ChatInterface() {
  const [input, setInput] = useState('');
  const [chatSession, setChatSession] = useState<ChatSession>({ messages: [], responses: {} });
  const [selectedModels, setSelectedModels] = useState<{[providerId: string]: string[]}>({});
  const [enabledProviders, setEnabledProviders] = useState<{[providerId: string]: boolean}>({});
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load user preferences
  useEffect(() => {
    try {
      const storedModels = localStorage.getItem('playground_selected_models');
      const storedEnabled = localStorage.getItem('playground_enabled_providers');

      if (storedModels) {
        setSelectedModels(JSON.parse(storedModels));
      }
      if (storedEnabled) {
        setEnabledProviders(JSON.parse(storedEnabled));
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
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

  // Get active models (from enabled providers)
  const getActiveModels = (): Array<{ providerId: string, modelId: string }> => {
    const activeModels: Array<{ providerId: string, modelId: string }> = [];
    
    Object.keys(enabledProviders).forEach(providerId => {
      if (enabledProviders[providerId] && selectedModels[providerId]) {
        selectedModels[providerId].forEach(modelId => {
          activeModels.push({ providerId, modelId });
        });
      }
    });
    
    return activeModels;
  };

  // Simulate API call (in real implementation, this would call actual APIs)
  const simulateApiCall = async (
    providerId: string, 
    modelId: string, 
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
    
    const response = `${words[Math.floor(Math.random() * words.length)]} ${prompt.substring(0, 50)}... This is a simulated response from ${MODEL_NAMES[modelId] || modelId}. In a real implementation, this would be streaming from the actual ${PROVIDER_INFO[providerId as keyof typeof PROVIDER_INFO]?.name} API with real model responses.`;
    
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
    
    const activeModels = getActiveModels();
    if (activeModels.length === 0) {
      alert('Please select at least one model to get responses.');
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

    // Simulate API calls for all active models
    const promises = activeModels.map(({ providerId, modelId }) =>
      simulateApiCall(providerId, modelId, userMessage.content, messageId)
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

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getResponseTime = (response: ModelResponse): string => {
    if (!response.startTime || !response.endTime) return '';
    const ms = response.endTime.getTime() - response.startTime.getTime();
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const activeModels = getActiveModels();

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-lg">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-holistic-blurple to-holistic-cerulean rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-normal text-gray-900">AI Chat Interface</h2>
              <p className="text-sm text-gray-600">
                {activeModels.length} models active • {chatSession.messages.filter(m => m.type === 'user').length} messages sent
              </p>
            </div>
          </div>

          {chatSession.messages.length > 0 && (
            <button
              onClick={clearChat}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              Clear Chat
            </button>
          )}
        </div>

        {activeModels.length === 0 && (
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <MessageSquare className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-amber-800">No Models Selected</h3>
                <p className="text-sm text-amber-700 mt-1">
                  Enable providers and select models above to start chatting.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 min-h-[400px] max-h-[600px] overflow-y-auto p-6">
        {chatSession.messages.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-normal text-gray-900 mb-2">
              Start a Conversation
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed max-w-md mx-auto">
              Type your message below to get responses from all selected AI models simultaneously.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {chatSession.messages.map((message) => (
              <div key={message.id} className="space-y-4">
                {/* User Message */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-holistic-blurple rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">You</span>
                      <span className="text-xs text-gray-500">{formatTimestamp(message.timestamp)}</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-900 leading-relaxed font-roobert">
                      {message.content}
                    </div>
                  </div>
                </div>

                {/* Model Responses */}
                {chatSession.responses[message.id] && (
                  <div className="grid gap-4 ml-11">
                    {chatSession.responses[message.id].map((response, index) => (
                      <div
                        key={`${response.providerId}-${response.modelId}-${index}`}
                        className="border border-gray-200 rounded-lg p-4 bg-white"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Image
                              src={PROVIDER_INFO[response.providerId as keyof typeof PROVIDER_INFO]?.logo || '/logos/default.png'}
                              alt={response.providerId}
                              width={16}
                              height={16}
                              className="w-4 h-4 object-contain"
                            />
                            <span className="text-sm font-medium text-gray-900">
                              {MODEL_NAMES[response.modelId] || response.modelId}
                            </span>
                            {response.isStreaming && (
                              <div className="flex items-center gap-1 text-blue-600">
                                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                                <span className="text-xs font-medium">Generating...</span>
                              </div>
                            )}
                            {response.isComplete && (
                              <div className="flex items-center gap-2 text-green-600">
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
                        
                        {response.error && (
                          <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                            Error: {response.error}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      {activeModels.length > 0 && (
        <div className="border-t border-gray-200 p-6">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
                className="w-full min-h-[44px] max-h-32 px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-holistic-blurple/20 focus:border-holistic-blurple transition-colors resize-none text-sm font-roobert leading-relaxed"
                disabled={isLoading}
              />
            </div>
            
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={`p-3 rounded-lg transition-all ${
                !input.trim() || isLoading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-holistic-blurple text-white hover:bg-holistic-blurple/90 transform hover:scale-105'
              }`}
            >
              {isLoading ? (
                <Square className="h-4 w-4" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
          
          {activeModels.length > 0 && (
            <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">
              <Zap className="h-3 w-3" />
              <span>
                Sending to {activeModels.length} model{activeModels.length !== 1 ? 's' : ''}: {' '}
                {activeModels.slice(0, 3).map(m => MODEL_NAMES[m.modelId] || m.modelId).join(', ')}
                {activeModels.length > 3 && ` +${activeModels.length - 3} more`}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
