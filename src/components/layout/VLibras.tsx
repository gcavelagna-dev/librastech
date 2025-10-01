
'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    VLibras: any;
  }
}

export default function VLibras() {
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const vwRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Evita a duplicação do script e do widget
    if (scriptRef.current || document.querySelector('script[src="https://vlibras.gov.br/app/vlibras-plugin.js"]')) {
      return;
    }

    // Cria o container do widget
    const vwContainer = document.createElement('div');
    vwContainer.setAttribute('vw', '');
    vwContainer.classList.add('enabled');
    vwContainer.innerHTML = `
      <div vw-access-button class="active"></div>
      <div vw-plugin-wrapper>
        <div class="vw-plugin-top-wrapper"></div>
      </div>
    `;
    document.body.appendChild(vwContainer);
    vwRef.current = vwContainer;

    // Cria e adiciona o script do VLibras
    const script = document.createElement('script');
    script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
    script.async = true;
    script.onload = () => {
      // Inicializa o widget após o carregamento do script
      if (window.VLibras) {
        new window.VLibras.Widget('https://vlibras.gov.br/app');
      }
    };
    document.body.appendChild(script);
    scriptRef.current = script;

    // Função de limpeza robusta
    return () => {
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
        scriptRef.current = null;
      }
      if (vwRef.current && vwRef.current.parentNode) {
         vwRef.current.parentNode.removeChild(vwRef.current);
         vwRef.current = null;
      }
       // Adicionalmente, busca por qualquer outro resquício do widget
      const strayWidget = document.querySelector('[vw]');
      if (strayWidget && strayWidget.parentNode) {
        strayWidget.parentNode.removeChild(strayWidget);
      }
    };
  }, []);

  return null; // O componente em si não renderiza nada visível
}
