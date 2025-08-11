"use client";

import React, { useEffect } from 'react';

export function VLibras() {
  const vlibrasContainerId = 'vlibras-widget-container';

  useEffect(() => {
    // Evita a duplicação do widget se o componente for remontado.
    if (document.getElementById(vlibrasContainerId)?.children.length > 0) {
      return;
    }

    const container = document.getElementById(vlibrasContainerId);
    if (container) {
      // Injeta o HTML necessário para o widget, incluindo os atributos não-padrão.
      container.innerHTML = `
        <div vw="true" class="enabled">
          <div vw-access-button="true" class="active"></div>
          <div vw-plugin-wrapper="true">
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

    // Função de limpeza para remover o script quando o componente for desmontado.
    return () => {
      const existingScript = document.querySelector('script[src="https://vlibras.gov.br/app/vlibras-plugin.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
      const widget = document.querySelector('[vw="true"]');
      if(widget) {
        widget.parentElement?.remove();
      }
    };
  }, []);

  // O container será preenchido pelo useEffect.
  return <div id={vlibrasContainerId} />;
}
