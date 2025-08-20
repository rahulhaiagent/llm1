'use client';

import React, { useState } from 'react';

import ChatbotInterface from '@/components/ChatbotInterface';
import CostAnalytics from '@/components/CostAnalytics';
import Navigation from '@/components/Navigation';

interface UserRequirements {
  companyName: string;
  industry: string;
  monthlyTokens: number;
  priorities: string[];
}

export default function EnterpriseCostOptimizer() {
  const [currentStep, setCurrentStep] = useState<'chat' | 'analytics'>('chat');
  const [userRequirements, setUserRequirements] = useState<UserRequirements | null>(null);

  const handleChatComplete = (requirements: UserRequirements) => {
    setUserRequirements(requirements);
    setCurrentStep('analytics');
  };

  const resetOptimizer = () => {
    setCurrentStep('chat');
    setUserRequirements(null);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <Navigation />

      {/* Content */}
      {currentStep === 'chat' && (
        <ChatbotInterface 
          onComplete={handleChatComplete}
          onBack={() => window.history.back()}
        />
      )}

      {currentStep === 'analytics' && userRequirements && (
        <CostAnalytics 
          requirements={userRequirements}
          onReset={resetOptimizer}
        />
      )}
    </div>
  );
} 