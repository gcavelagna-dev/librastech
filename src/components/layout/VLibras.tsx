
"use client";

import Script from 'next/script';
import { useEffect } from 'react';

export function VLibras() {

  useEffect(() => {
    // This effect ensures the script is re-initialized on component mount if needed,
    // especially during client-side navigation.
    const initializeVLibras = () => {
      // @ts-ignore
      if (window.VLibras && typeof window.VLibras.Widget === 'function') {
        // @ts-ignore
        new window.VLibras.Widget('https://vlibras.gov.br/app');
      }
    };
    
    // Check if the script is already loaded
    const script = document.querySelector('script[src="https://vlibras.gov.br/app/vlibras-plugin.js"]');
    if (script) {
      // If script is loaded but widget not initialized, try initializing
      // @ts-ignore
      if (!window.VLibras) {
         script.addEventListener('load', initializeVLibras);
      } else {
         initializeVLibras();
      }
    }

    return () => {
       if (script) {
         script.removeEventListener('load', initializeVLibras);
       }
    }
  }, []);

  return (
    <>
      <div vw-access-button="true" className="active"></div>
      <div vw-plugin-wrapper="true">
        <div className="vw-plugin-top-wrapper"></div>
      </div>
      <Script 
        src="https://vlibras.gov.br/app/vlibras-plugin.js" 
        strategy="afterInteractive"
        onLoad={() => {
          // @ts-ignore
          if (window.VLibras) {
            // @ts-ignore
            new window.VLibras.Widget('https://vlibras.gov.br/app');
          }
        }}
      />
    </>
  )
}
