
'use client';

import { useEffect, useRef } from 'react';

export default function VLibras() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    // Se o script já foi adicionado, não faz nada.
    if (scriptRef.current) {
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
    scriptRef.current = script;

    return () => {
        if (scriptRef.current && document.body.contains(scriptRef.current)) {
            document.body.removeChild(scriptRef.current);
            scriptRef.current = null;
        }
        const widget = document.querySelector('[vw]');
        if (widget) {
            widget.remove();
        }
    };
  }, []);

  return <div ref={containerRef} />;
}
