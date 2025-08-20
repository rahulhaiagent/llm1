'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';
import { useState } from 'react';
import AuthModal from './auth/AuthModal';

interface NavigationProps {
  className?: string;
}

export default function Navigation({ className = "" }: NavigationProps) {
  const pathname = usePathname();
  const { user, signOut } = useAuthContext();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const isActive = (path: string) => {
    if (!pathname) return false;
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const openAuthModal = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const getLinkClasses = (path: string) => {
    if (path === '/test-your-llm') {
      return "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200";
    }
    
    const baseClasses = "transition-colors duration-200";
    return isActive(path) 
      ? `text-gray-900 hover:text-blue-600 font-medium ${baseClasses}`
      : `text-gray-600 hover:text-blue-600 ${baseClasses}`;
  };

  return (
    <nav className={`bg-white border-b border-gray-200 sticky top-0 z-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 relative">
              <div className="h-10 w-10 rounded-lg overflow-hidden flex-shrink-0 bg-white flex items-center justify-center border border-gray-100 shadow-sm">
                <Image 
                  src="/HAI Favicon.png" 
                  alt="HAI Logo" 
                  width={40}
                  height={40}
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="font-semibold text-gray-900 text-lg">LLM Leaderboard</span>
              <div className="absolute -top-1 -right-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-[10px] font-bold px-1 py-0.5 rounded-full shadow-sm">
                BETA
              </div>
            </Link>
          </div>
          <div className="flex items-center space-x-8">
          <Link href="/" className={getLinkClasses('/')}>
              Leaderboard
            </Link>
            <Link href="/recommendations" className={getLinkClasses('/recommendations')}>
              Recommendations
            </Link>
            <Link href="/compare" className={getLinkClasses('/compare')}>
              Compare
            </Link>
            <Link href="/providers" className={getLinkClasses('/providers')}>
              Providers
            </Link>
           
            <Link href="/red-teaming" className={getLinkClasses('/red-teaming')}>
              Red Teaming
            </Link>

            <Link href="/test-your-llm" className={getLinkClasses('/test-your-llm')}>
              Test Your LLM
            </Link>
            
            {/* User Info & Sign Out */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-2">
                  <div 
                    className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full hover:bg-green-200 transition-colors duration-200 cursor-pointer group relative"
                    title={user.email}
                  >
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {/* Tooltip */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                      {user.email}
                    </div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-1 text-sm text-gray-600 hover:text-red-600 transition-colors duration-200 px-2 py-1.5 rounded-lg hover:bg-gray-50"
                    title="Sign Out"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => openAuthModal('login')}
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-gray-50"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => openAuthModal('signup')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </nav>
  );
} 