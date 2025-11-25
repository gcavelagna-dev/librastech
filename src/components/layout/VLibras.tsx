
'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    VLibras: any;
  }
}

// Função para verificar se o widget já existe no DOM
function vLibrasIsActive() {
    return !!document.querySelector('[vw-plugin-wrapper]');
}

// Função para remover completamente o widget e o script
function cleanupVLibras() {
    const widget = document.querySelector('[vw]');
    if (widget && widget.parentNode) {
        widget.parentNode.removeChild(widget);
    }
    const script = document.querySelector('script[src="https://vlibras.gov.br/app/vlibras-plugin.js"]');
    if (script && script.parentNode) {
        script.parentNode.removeChild(script);
    }
}


export default function VLibras() {
  const isInitialized = useRef(false);

  useEffect(() => {
    // Roda apenas no lado do cliente
    if (typeof window === 'undefined') {
        return;
    }

    const initVLibras = () => {
        // Se já estiver ativo, não faz nada
        if (vLibrasIsActive()) {
            return;
        }

        // Limpa instâncias anteriores para garantir um início limpo
        cleanupVLibras();

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

        // Cria e adiciona o script do VLibras
        const script = document.createElement('script');
        script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
        script.async = true;
        script.onload = () => {
          // Inicializa o widget após o carregamento do script
          if (window.VLibras) {
            try {
                new window.VLibras.Widget('https://vlibras.gov.br/app');
                isInitialized.current = true;
            } catch(e) {
                console.error("Erro ao inicializar o widget VLibras", e);
                cleanupVLibras(); // Limpa se a inicialização falhar
            }
          }
        };
        script.onerror = () => {
            console.error("Falha ao carregar o script do VLibras.");
            cleanupVLibras(); // Limpa se o script não carregar
        }
        document.body.appendChild(script);
    }

    // Tenta inicializar ao montar o componente
    initVLibras();
    
    // Configura um intervalo para verificar se o widget ainda está ativo.
    // Isso ajuda a recuperá-lo se ele for removido por alguma renderização do React.
    const intervalId = setInterval(() => {
        if (isInitialized.current && !vLibrasIsActive()) {
            console.log("VLibras widget não encontrado, tentando reinstalar.");
            initVLibras();
        }
    }, 3000); // Verifica a cada 3 segundos


    // Função de limpeza para quando o componente for desmontado
    return () => {
      clearInterval(intervalId);
      // Não removemos na desmontagem para persistir entre navegações de página
      // cleanupVLibras(); 
    };
  }, []);

  return null; // O componente em si não renderiza nada visível
}
