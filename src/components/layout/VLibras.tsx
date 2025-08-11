
'use client';

import { useEffect, useRef } from 'react';

export default function VLibras() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Evita a duplicação do widget se o componente for remontado.
    if (document.querySelector('[vw-access-button]')) {
        return;
    }
      
    if (containerRef.current) {
      containerRef.current.innerHTML = `
        <div vw class="enabled">
          <div vw-access-button class="active"></div>
          <div vw-plugin-wrapper>
            <div class="vw-plugin-top-wrapper"></div>
          </div>
        </div>
      `;
    }

    const script = document.createElement('script');
    script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
    script.async = true;
    script.onload = () => {
      // @ts-ignore
      if (window.VLibras) {
        // @ts-ignore
        new window.VLibras.Widget('https://vlibras.gov.br/app');
      }
    };
    document.body.appendChild(script);

    return () => {
        const vlibrasScript = document.querySelector('script[src="https://vlibras.gov.br/app/vlibras-plugin.js"]');
        if (vlibrasScript) {
            document.body.removeChild(vlibrasScript);
        }
        const widget = document.querySelector('[vw]');
        if (widget && widget.parentElement === containerRef.current) {
            containerRef.current?.removeChild(widget);
        }
    };
  }, []);

  return <div ref={containerRef} />;
}
