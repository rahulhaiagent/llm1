'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowLeft, Send, Bot, User, CheckCircle } from 'lucide-react';

interface UserRequirements {
  companyName: string;
  industry: string;
  monthlyTokens: number;
  priorities: string[];
}

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface ChatbotInterfaceProps {
  onComplete: (requirements: UserRequirements) => void;
  onBack: () => void;
}

const QUESTIONS = [
  {
    id: 'companyName',
    question: "What's your company name?",
    placeholder: "Enter your company name...",
    type: 'text'
  },
  {
    id: 'industry',
    question: "What industry are you in?",
    options: [
      'Technology & Software',
      'Healthcare & Life Sciences',
      'Financial Services',
      'E-commerce & Retail',
      'Education',
      'Manufacturing',
      'Media & Entertainment',
      'Government & Public Sector',
      'Legal Services',
      'Consulting',
      'Other'
    ],
    type: 'select'
  },
  {
    id: 'monthlyTokens',
    question: "What's your estimated monthly token usage?",
    options: [
      'Less than 1M tokens',
      '1M - 10M tokens',
      '10M - 100M tokens',
      '100M - 1B tokens',
      'More than 1B tokens'
    ],
    type: 'select'
  },
  {
    id: 'priorities',
    question: "What are your key priorities? (Select all that apply)",
    options: [
      'Budget & Cost Efficiency',
      'Speed & Low Latency',
      'Security & Data Privacy',
      'Compliance (SOC2, HIPAA, etc.)',
      'High Accuracy',
      'Scalability',
      'Reliability & Uptime',
      'Easy Integration',
      'Custom Fine-tuning',
      'Multilingual Support'
    ],
    type: 'multiselect'
  }
];

export default function ChatbotInterface({ onComplete, onBack }: ChatbotInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi! I'm your AI Cost Optimization Assistant. I'll help you find the best AI models for your needs while minimizing costs. I just need 4 quick questions about your company and priorities.",
      timestamp: new Date()
    }
  ]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<UserRequirements>>({});
  const [isTyping, setIsTyping] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const questionAskedRef = useRef<boolean>(false);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    // Only scroll to bottom for new messages, not initial load
    if (messages.length > 1) {
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [messages]);

  const completeChat = useCallback(() => {
    setIsTyping(true);
    setTimeout(() => {
      const completionMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: "Perfect! I have all the information I need. Let me analyze your requirements and find the best AI models for your use case. This will take just a moment...",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, completionMessage]);
      setIsTyping(false);
      
      // Simulate analysis time
      setTimeout(() => {
        onComplete(answers as UserRequirements);
      }, 2000);
    }, 1000);
  }, [answers, onComplete]);

  const askQuestion = useCallback((questionIndex: number) => {
    if (questionIndex >= QUESTIONS.length) {
      completeChat();
      return;
    }

    setIsTyping(true);
    setTimeout(() => {
      const question = QUESTIONS[questionIndex];
      const newMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: question.question,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newMessage]);
      setIsTyping(false);
      setCurrentQuestionIndex(questionIndex);
    }, 1000);
  }, [completeChat]);

  useEffect(() => {
    // Ask the first question after initial greeting
    if (messages.length === 1 && !questionAskedRef.current) {
      questionAskedRef.current = true;
      setTimeout(() => {
        askQuestion(0);
      }, 1000);
    }
  }, [messages.length, askQuestion]);

  const handleAnswer = (answer: string | string[]) => {
    const question = QUESTIONS[currentQuestionIndex];
    const answerText = Array.isArray(answer) ? answer.join(', ') : answer;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: answerText,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    // Update answers
    const newAnswers = { ...answers };
    if (question.id === 'priorities') {
      newAnswers.priorities = Array.isArray(answer) ? answer : [answer];
    } else if (question.id === 'monthlyTokens') {
      const tokenMap: { [key: string]: number } = {
        'Less than 1M tokens': 500000,
        '1M - 10M tokens': 5000000,
        '10M - 100M tokens': 50000000,
        '100M - 1B tokens': 500000000,
        'More than 1B tokens': 2000000000
      };
      newAnswers.monthlyTokens = tokenMap[answer as string] || 5000000;
    } else {
      (newAnswers as Record<string, unknown>)[question.id] = answer;
    }
    setAnswers(newAnswers);

    // Clear inputs
    setUserInput('');
    setSelectedOptions([]);

    // Ask next question
    setTimeout(() => {
      askQuestion(currentQuestionIndex + 1);
    }, 500);
  };



  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const isWaitingForAnswer = currentQuestionIndex < QUESTIONS.length && messages.length > 1;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Overview
        </button>
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Holistic AI Assistant</h2>
            <p className="text-sm text-gray-500">Analyzing your requirements...</p>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 h-[600px] flex flex-col">
        {/* Messages */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex space-x-3 max-w-xs lg:max-w-md ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user' 
                    ? 'bg-blue-600' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600'
                }`}>
                  {message.type === 'user' ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-white" />
                  )}
                </div>
                <div className={`px-4 py-2 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex space-x-3 max-w-xs lg:max-w-md">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="px-4 py-2 rounded-2xl bg-gray-100">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        {isWaitingForAnswer && currentQuestion && !isTyping && (
          <div className="border-t border-gray-200 p-6">
            {currentQuestion.type === 'text' && (
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && userInput.trim() && handleAnswer(userInput.trim())}
                  placeholder={currentQuestion.placeholder}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={() => userInput.trim() && handleAnswer(userInput.trim())}
                  disabled={!userInput.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            )}

            {currentQuestion.type === 'select' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentQuestion.options?.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswer(option)}
                    className="p-3 text-left border border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {currentQuestion.type === 'multiselect' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {currentQuestion.options?.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        if (selectedOptions.includes(option)) {
                          setSelectedOptions(prev => prev.filter(o => o !== option));
                        } else {
                          setSelectedOptions(prev => [...prev, option]);
                        }
                      }}
                      className={`p-3 text-left border rounded-xl transition-colors ${
                        selectedOptions.includes(option)
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                      }`}
                    >
                      <div className="flex items-center">
                        {selectedOptions.includes(option) && (
                          <CheckCircle className="h-4 w-4 text-blue-600 mr-2" />
                        )}
                        {option}
                      </div>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => selectedOptions.length > 0 && handleAnswer(selectedOptions)}
                  disabled={selectedOptions.length === 0}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue ({selectedOptions.length} selected)
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 