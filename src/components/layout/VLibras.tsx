
'use client';

import { useEffect, useRef } from 'react';

export default function VLibras() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    // Injeta o HTML do widget no container
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

    // Cria e adiciona o script do VLibras
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
      // Remove o script quando o componente desmontar
      if (scriptRef.current && document.body.contains(scriptRef.current)) {
          document.body.removeChild(scriptRef.current);
          scriptRef.current = null;
      }
      // Remove o widget para evitar duplicações
      const vlibrasElement = document.querySelector('div[vw]');
      if (vlibrasElement) {
        vlibrasElement.remove();
      }
    };
  }, []);

  return <div ref={containerRef} />;
}
