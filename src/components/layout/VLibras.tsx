
"use client";

import React, { useEffect } from 'react';
import Script from 'next/script';

export function VLibras() {
  const vlibrasContainerId = 'vlibras-widget-container';

  useEffect(() => {
    const container = document.getElementById(vlibrasContainerId);
    if (container) {
      container.innerHTML = `
        <div vw="true" className="enabled">
          <div vw-access-button="true" className="active"></div>
          <div vw-plugin-wrapper="true">
            <div className="vw-plugin-top-wrapper"></div>
          </div>
        </div>
      `;
    }
  }, []);

  return (
    <>
      <div id={vlibrasContainerId} />
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
  );
}
