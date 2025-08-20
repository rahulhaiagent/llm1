'use client';

// Type declaration for window.dataLayer and gtag
declare global {
  interface Window {
    dataLayer: unknown[][];
    gtag: (...args: unknown[]) => void;
  }
}

// Function to load Google Analytics
export const loadGoogleAnalytics = () => {
  // Check if Google Analytics is already loaded
  if (document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
    return; // Already loaded
  }

  // Google Analytics script
  const script = document.createElement('script');
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-R9DTJCLWTZ';
  script.async = true;
  document.head.appendChild(script);
  
  // Initialize dataLayer and gtag function
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(...args: unknown[]) {
    window.dataLayer.push(args);
  };
  
  // Initialize Google Analytics
  window.gtag('js', new Date());
  window.gtag('config', 'G-R9DTJCLWTZ');
};

// Function to check cookie consent and load appropriate scripts
export const loadConsentedScripts = () => {
  try {
    const consentData = localStorage.getItem('cookie-consent');
    if (consentData) {
      const preferences = JSON.parse(consentData);
      
      // Load Google Analytics if analytics cookies are accepted
      if (preferences.analytics) {
        loadGoogleAnalytics();
      }
      
      // Add other tracking scripts here based on preferences
      // if (preferences.marketing) { loadMarketingScripts(); }
    }
  } catch (error) {
    console.error('Error loading scripts based on consent:', error);
  }
}; 