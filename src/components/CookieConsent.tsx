'use client';

import { useState, useEffect } from 'react';
import { X, Settings, Shield, AlertCircle } from 'lucide-react';
import { loadConsentedScripts } from '@/lib/script-loader';

type CookiePreferences = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
};

const CookieConsent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState<CookiePreferences>({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
    preferences: false,
  });

  useEffect(() => {
    // Check if user has already made cookie choices
    const consentGiven = localStorage.getItem('cookie-consent');
    
    if (!consentGiven) {
      // If no consent has been given yet, show the popup after a short delay
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Load saved preferences
      try {
        const savedPreferences = JSON.parse(consentGiven);
        setCookiePreferences(savedPreferences);
        
        // Load scripts based on existing preferences
        loadConsentedScripts();
      } catch {
        // If there's an error parsing the saved preferences, show the popup again
        setIsOpen(true);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    
    setCookiePreferences(allAccepted);
    localStorage.setItem('cookie-consent', JSON.stringify(allAccepted));
    
    // Load scripts based on accepted preferences
    loadConsentedScripts();
    
    setIsOpen(false);
  };

  const handleRejectNonEssential = () => {
    const essentialOnly = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    
    setCookiePreferences(essentialOnly);
    localStorage.setItem('cookie-consent', JSON.stringify(essentialOnly));
    setIsOpen(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(cookiePreferences));
    
    // Load scripts based on saved preferences
    loadConsentedScripts();
    
    setIsOpen(false);
    setShowPreferences(false);
  };

  const togglePreferencePanel = () => {
    setShowPreferences(!showPreferences);
  };

  const handlePreferenceChange = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return; // Cannot change necessary cookies
    
    setCookiePreferences({
      ...cookiePreferences,
      [key]: !cookiePreferences[key],
    });
  };

  const openCookieSettings = () => {
    setIsOpen(true);
    setShowPreferences(true);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={openCookieSettings}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg z-50 hover:bg-blue-700 transition-colors"
        aria-label="Cookie Settings"
      >
        <Settings className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50 p-4 md:items-center animate-fade-in">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-auto animate-slide-in">
        {!showPreferences ? (
          // Main consent dialog
          <div className="p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <Shield className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-800">Cookie Consent</h2>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="prose prose-sm text-gray-600 mb-8">
              <p className="text-base leading-relaxed">
                We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
                By clicking &quot;Accept All&quot;, you consent to our use of cookies.
              </p>
              
              <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
                <p className="font-medium text-blue-700 mb-2">
                  We use the following tracking technologies:
                </p>
                <ul className="space-y-2 text-blue-800">
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">•</span>
                    <div>
                      <span className="font-semibold">Google Analytics</span> - To analyze website traffic and user behavior
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">•</span>
                    <div>
                      <span className="font-semibold">Apollo Website Tracker</span> - For business intelligence and visitor identification
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">•</span>
                    <div>
                      <span className="font-semibold">Google Webmasters</span> - For website performance monitoring
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">•</span>
                    <div>
                      <span className="font-semibold">HubSpot</span> - For marketing automation and visitor tracking
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button 
                onClick={handleRejectNonEssential}
                className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Reject Non-Essential
              </button>
              <button 
                onClick={togglePreferencePanel}
                className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Manage Preferences
              </button>
              <button 
                onClick={handleAcceptAll}
                className="px-5 py-2.5 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors font-medium"
              >
                Accept All
              </button>
            </div>
          </div>
        ) : (
          // Detailed preferences panel
          <div className="p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <Settings className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-800">Cookie Preferences</h2>
              </div>
              <button 
                onClick={() => setShowPreferences(false)} 
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                aria-label="Back"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <p className="text-gray-600 mb-6">
              Customize your cookie preferences below. Necessary cookies are always enabled as they are essential for the website to function properly.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="p-5 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 text-lg">Necessary Cookies</h3>
                    <p className="text-sm text-gray-600 mt-1">Essential for the website to function properly</p>
                  </div>
                  <div className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                    Required
                  </div>
                </div>
              </div>
              
              <div className="p-5 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 text-lg">Analytics Cookies</h3>
                    <p className="text-sm text-gray-600 mt-1">Google Analytics to help us understand how you use the website</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={cookiePreferences.analytics}
                      onChange={() => handlePreferenceChange('analytics')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition-colors">
                      <div className="w-5 h-5 bg-white rounded-full absolute top-[2px] left-[2px] transition-all peer-checked:translate-x-5 border border-gray-300 shadow-sm"></div>
                    </div>
                  </label>
                </div>
              </div>
              
              <div className="p-5 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 text-lg">Marketing Cookies</h3>
                    <p className="text-sm text-gray-600 mt-1">HubSpot and Apollo for marketing and visitor identification</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={cookiePreferences.marketing}
                      onChange={() => handlePreferenceChange('marketing')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition-colors">
                      <div className="w-5 h-5 bg-white rounded-full absolute top-[2px] left-[2px] transition-all peer-checked:translate-x-5 border border-gray-300 shadow-sm"></div>
                    </div>
                  </label>
                </div>
              </div>
              
              <div className="p-5 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 text-lg">Preference Cookies</h3>
                    <p className="text-sm text-gray-600 mt-1">Remember your settings and preferences</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={cookiePreferences.preferences}
                      onChange={() => handlePreferenceChange('preferences')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition-colors">
                      <div className="w-5 h-5 bg-white rounded-full absolute top-[2px] left-[2px] transition-all peer-checked:translate-x-5 border border-gray-300 shadow-sm"></div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowPreferences(false)}
                className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={handleSavePreferences}
                className="px-5 py-2.5 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors font-medium"
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}
        
        <div className="bg-gray-50 px-6 py-4 text-xs text-gray-500 rounded-b-xl border-t border-gray-100">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-gray-400" />
            <p>
              This website is protected by DMCA. By using this site, you agree to our <a href="https://www.holisticai.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Privacy Policy</a> and <a href="https://www.holisticai.com/terms-conditions" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Terms of Service</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent; 