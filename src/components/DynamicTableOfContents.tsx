'use client';

import { useEffect, useState } from 'react';

// Predefined main sections to show in navigation
const mainSections = [
  { id: 'overview', text: 'Overview', icon: 'overview' },
  { id: 'information', text: 'Model Information', icon: 'information' },
  { id: 'benchmarks', text: 'Performance Benchmarks', icon: 'benchmark' },
  { id: 'safety', text: 'Jailbreaking & Red Teaming Analysis', icon: 'safety' },
  { id: 'pricing', text: 'Cost Calculator', icon: 'pricing' },
  { id: 'providers', text: 'Providers', icon: 'providers' },
  { id: 'business-guide', text: 'Business Decision Guide', icon: 'business' },
  { id: 'use-cases', text: 'Business Use Cases', icon: 'use case' },
  { id: 'model-comparison', text: 'Model Comparison', icon: 'chart' }
];

// Dynamic Table of Contents Component
export default function DynamicTableOfContents() {
  const [activeId, setActiveId] = useState<string>('overview');

  useEffect(() => {
    // Handle hash in URL on initial load
    const initialHash = window.location.hash.substring(1);
    if (initialHash && mainSections.some(section => section.id === initialHash)) {
      setActiveId(initialHash);
      // Scroll to hash with delay to ensure page is loaded
      setTimeout(() => {
        const element = document.getElementById(initialHash);
        if (element) {
          const navbarHeight = 64;
          const extraPadding = 24;
          const totalOffset = navbarHeight + extraPadding;
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - totalOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 300);
    }

    // Intersection Observer for active section tracking
    const observer = new IntersectionObserver(
      (entries) => {
        // Sort entries by intersection ratio (descending) to prioritize most visible section
        const visibleEntries = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        
        if (visibleEntries.length > 0) {
          setActiveId(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: '-10% 0% -70% 0%',
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1]
      }
    );

    // Observe all main sections
    mainSections.forEach(section => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    // Set initial active section based on scroll position
    const checkInitialSection = () => {
      let currentActive = 'overview';
      let minDistance = Infinity;
      
      // Check if we're near the bottom of the page - if so, prioritize the last sections
      const isNearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;
      
      if (isNearBottom) {
        // When near bottom, check if model-comparison section exists
        const modelComparisonElement = document.getElementById('model-comparison');
        if (modelComparisonElement) {
          setActiveId('model-comparison');
          return;
        }
      }
      
      mainSections.forEach(section => {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          const distanceFromTop = Math.abs(rect.top - 100); // 100px from top
          
          if (rect.top <= window.innerHeight * 0.5 && distanceFromTop < minDistance) {
            minDistance = distanceFromTop;
            currentActive = section.id;
          }
        }
      });
      setActiveId(currentActive);
    };

    // Check initial section after a short delay and on scroll
    setTimeout(checkInitialSection, 100);
    window.addEventListener('scroll', checkInitialSection);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', checkInitialSection);
    };
  }, []);

  const handleClick = (id: string) => {
    // Immediately set active state for responsive feedback
    setActiveId(id);
    
    const element = document.getElementById(id);
    if (element) {
      // Calculate offset to account for navbar height plus some padding
      const navbarHeight = 64; // Height of the fixed navbar (4rem = 64px)
      const extraPadding = 24; // Additional padding for better readability
      const totalOffset = navbarHeight + extraPadding;
      
      // Get element position and scroll with offset
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - totalOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Update URL hash without triggering scroll
      if (window.history.replaceState) {
        window.history.replaceState(null, '', `#${id}`);
      }
    }
  };

  const getIcon = (iconType: string) => {
    const type = iconType.toLowerCase();
    if (type.includes('overview')) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
    if (type.includes('information')) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    }
    if (type.includes('benchmark')) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      );
    }
    if (type.includes('safety')) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    }
    if (type.includes('pricing')) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      );
    }
    if (type.includes('providers')) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0h3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      );
    }
    if (type.includes('business')) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
        </svg>
      );
    }
    if (type.includes('use case')) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      );
    }
    if (type.includes('chart')) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  };

  return (
    <nav className="space-y-1">
      {mainSections.map((section, index) => (
        <button
          key={section.id}
          onClick={() => handleClick(section.id)}
          className={`flex items-center w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 group relative ${
            activeId === section.id
              ? section.id === 'model-comparison'
                ? 'text-blue-700 bg-blue-50 border-l-4 border-blue-600 shadow-sm ring-1 ring-blue-100 transform translate-x-1 font-semibold'
                : 'text-blue-700 bg-blue-50 border-l-4 border-blue-600 shadow-sm ring-1 ring-blue-100 transform translate-x-1'
              : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50 hover:shadow-sm hover:transform hover:translate-x-1'
          }`}
          style={{
            animationDelay: `${index * 50}ms`
          }}
        >
          <span className={`mr-3 transition-all duration-200 ${
            activeId === section.id 
              ? section.id === 'model-comparison'
                ? 'text-blue-600 scale-125'
                : 'text-blue-600 scale-110'
              : 'text-gray-400 group-hover:text-blue-500 group-hover:scale-105'
          }`}>
            {getIcon(section.icon)}
          </span>
          <span className="text-sm leading-tight font-medium">{section.text}</span>
          {activeId === section.id && (
            <div className="ml-auto">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          )}
        </button>
      ))}
    </nav>
  );
} 