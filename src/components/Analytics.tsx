import { useEffect } from "react";
import { useLocation } from "react-router";
import { initGoogleAnalytics, initMicrosoftClarity, trackEvent } from "@/lib/seo";

const GA_ID = import.meta.env.VITE_GA_ID || 'G-XXXXXXXXXX';
const CLARITY_ID = import.meta.env.VITE_CLARITY_ID || 'xxxxxxxxxx';

export default function Analytics() {
  const location = useLocation();

  useEffect(() => {
    // Initialize GA4
    if (GA_ID && GA_ID !== 'G-XXXXXXXXXX') {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      document.head.appendChild(script);

      const initScript = document.createElement('script');
      initScript.innerHTML = initGoogleAnalytics(GA_ID);
      document.head.appendChild(initScript);
    }

    // Initialize Microsoft Clarity
    if (CLARITY_ID && CLARITY_ID !== 'xxxxxxxxxx') {
      const clarityScript = document.createElement('script');
      clarityScript.innerHTML = initMicrosoftClarity(CLARITY_ID);
      document.head.appendChild(clarityScript);
    }
  }, []);

  useEffect(() => {
    // Track page views
    trackEvent('page_view', {
      page_path: location.pathname,
      page_title: document.title,
      page_location: window.location.href,
    });
  }, [location]);

  return null;
}
