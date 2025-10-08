'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import DynamicTableOfContents from './DynamicTableOfContents';

export default function ModelPageTOC() {
  const [isMobileTOCOpen, setIsMobileTOCOpen] = useState(false);

  return (
    <>
      {/* Mobile TOC Toggle Button */}
      <div className="xl:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsMobileTOCOpen(!isMobileTOCOpen)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
        >
          {isMobileTOCOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile TOC Overlay */}
      {isMobileTOCOpen && (
        <div className="xl:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsMobileTOCOpen(false)}>
          <div className="fixed right-0 top-0 bottom-0 w-80 bg-white shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="h-full overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">On This Page</h3>
                <button
                  onClick={() => setIsMobileTOCOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <DynamicTableOfContents />
            </div>
          </div>
        </div>
      )}

      {/* Desktop Table of Contents Sidebar - Positioned in right margin */}
      <div 
        className="hidden xl:block fixed top-16 bottom-0 w-64 bg-white z-40"
        style={{
          left: 'calc(50% + 576px + 2rem)', // 50% + half of max-w-6xl + gap
        }}
      >
        <div className="h-full overflow-y-auto p-6">
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide border-b border-gray-200 pb-3">On This Page</h3>
          </div>
          <DynamicTableOfContents />
        </div>
      </div>
    </>
  );
} 