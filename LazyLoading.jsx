// hooks/useLazyLoading.js
import { useState, useEffect } from 'react';

export const useLazyLoading = () => {
  const [loadedScripts, setLoadedScripts] = useState({});
  const [loadedStyles, setLoadedStyles] = useState({});

  const loadScript = (url) => {
    return new Promise((resolve, reject) => {
      if (loadedScripts[url]) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      
      script.onload = () => {
        setLoadedScripts(prev => ({ ...prev, [url]: true }));
        resolve();
      };
      
      script.onerror = () => {
        reject(new Error(`Failed to load script: ${url}`));
      };
      
      document.body.appendChild(script);
    });
  };

  const loadStyle = (url) => {
    return new Promise((resolve, reject) => {
      if (loadedStyles[url]) {
        resolve();
        return;
      }

      const link = document.createElement('link');
      link.href = url;
      link.rel = 'stylesheet';
      
      link.onload = () => {
        setLoadedStyles(prev => ({ ...prev, [url]: true }));
        resolve();
      };
      
      link.onerror = () => {
        reject(new Error(`Failed to load style: ${url}`));
      };
      
      document.head.appendChild(link);
    });
  };

  return { loadScript, loadStyle };
};
