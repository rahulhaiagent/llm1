'use client';

import React from 'react';
import Script from 'next/script';
import { X } from 'lucide-react';

interface IssueReportPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function IssueReportPopup({ isOpen, onClose }: IssueReportPopupProps) {

  if (!isOpen) return null;

  return (
    <>
      <Script 
        src="https://js-eu1.hsforms.net/forms/embed/25785988.js" 
        strategy="lazyOnload"
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Popup */}
      <div className="relative bg-white rounded-xl shadow-lg border border-gray-200 max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Get in Touch</h2>
              <p className="text-gray-600 text-sm mt-1">
                Have questions about our rankings, want to report an issue, or submit your model for testing? We&apos;d love to hear from you.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* HubSpot Form Container */}
          <div className="hs-form-frame" data-region="eu1" data-form-id="c1d78116-0b0c-476a-a577-38ae6495ef37" data-portal-id="25785988"></div>

          {/* Cancel Button */}
          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:text-gray-900 hover:border-gray-400 font-semibold transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
