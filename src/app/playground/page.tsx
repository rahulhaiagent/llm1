'use client'

import React, { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation';
import PlaygroundOnboarding from '../../components/PlaygroundOnboarding';
import PlaygroundDashboard from '../../components/PlaygroundDashboard';

export default function PlaygroundPage() {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user has already completed onboarding
  useEffect(() => {
    try {
      const onboarded = localStorage.getItem('playground_onboarded');
      const apiKeys = localStorage.getItem('playground_api_keys');
      
      if (onboarded === 'true' && apiKeys) {
        const keys = JSON.parse(apiKeys);
        const hasAnyKey = Object.values(keys).some(key => key && typeof key === 'string' && key.length > 10);
        setIsOnboarded(hasAnyKey);
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    }
    setIsLoading(false);
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('playground_onboarded', 'true');
    setIsOnboarded(true);
  };

  const handleResetOnboarding = () => {
    localStorage.removeItem('playground_onboarded');
    setIsOnboarded(false);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-gray-500">Loading playground...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white flex flex-col">
      <Navigation />
      
      {!isOnboarded ? (
        <PlaygroundOnboarding onComplete={handleOnboardingComplete} />
      ) : (
        <PlaygroundDashboard onReset={handleResetOnboarding} />
      )}
    </div>
  );
}
