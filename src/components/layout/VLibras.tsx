
'use client';

import { useEffect } from 'react';

export default function VLibras() {
  useEffect(() => {
    // 1. Cria o contêiner do widget se não existir
    let vwContainer = document.querySelector('div[vw]');
    if (!vwContainer) {
      vwContainer = document.createElement('div');
      vwContainer.setAttribute('vw', '');
      vwContainer.classList.add('enabled');
      vwContainer.innerHTML = `
        <div vw-access-button class="active"></div>
        <div vw-plugin-wrapper>
          <div class="vw-plugin-top-wrapper"></div>
        </div>
      `;
      document.body.appendChild(vwContainer);
    }

    // 2. Adiciona o script do VLibras
    const script = document.createElement('script');
    script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
    script.async = true;
    script.onload = () => {
      // 3. Inicializa o widget
      // @ts-ignore
      if (window.VLibras) {
        // @ts-ignore
        new window.VLibras.Widget('https://vlibras.gov.br/app');
      }
    };
    document.body.appendChild(script);

    // 4. Função de limpeza para remover script e widget ao desmontar
    return () => {
      const existingScript = document.querySelector('script[src="https://vlibras.gov.br/app/vlibras-plugin.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
      const widgetElement = document.querySelector('div[vw]');
      if (widgetElement) {
        document.body.removeChild(widgetElement);
      }
    };
  }, []);

  return null; // O componente não renderiza nada diretamente
}
