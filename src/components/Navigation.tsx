'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface NavigationProps {
  className?: string;
}

export default function Navigation({ className = "" }: NavigationProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (!pathname) return false;
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  const getLinkClasses = (path: string) => {
    if (path === '/test-your-llm') {
      return "bg-holistic-blurple hover:bg-holistic-deepblue text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 font-roobert";
    }
    
    const baseClasses = "transition-colors duration-200 font-roobert";
    return isActive(path) 
      ? `text-holistic-deepblue hover:text-holistic-blurple font-medium ${baseClasses}`
      : `text-gray-600 hover:text-holistic-blurple ${baseClasses}`;
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
              <span className="font-semibold text-holistic-deepblue text-lg font-roobert">LLM Decision Hub</span>
            </Link>
          </div>
          <div className="flex items-center space-x-8">
            <Link href="/" className={getLinkClasses('/')}>
              Home
            </Link>
            <Link href="/leaderboard" className={getLinkClasses('/leaderboard')}>
              Leaderboard
            </Link>
            
            <Link href="/red-teaming" className={getLinkClasses('/red-teaming')}>
              Red Teaming
            </Link>
            <Link href="/recommendations" className={getLinkClasses('/recommendations')}>
              Recommendations
            </Link>
            <Link href="/compare" className={getLinkClasses('/compare')}>
              Compare
            </Link>
            <Link href="/playground" className={getLinkClasses('/playground')}>
              Playground
            </Link>
            <Link href="/providers" className={getLinkClasses('/providers')}>
              Providers
            </Link>
           

            <Link href="/test-your-llm" className={getLinkClasses('/test-your-llm')}>
              Test Your LLM
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}