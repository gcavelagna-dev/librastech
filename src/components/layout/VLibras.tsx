
"use client";

import Script from 'next/script';

export function VLibras() {
  return (
    <>
      {/* Widget VLibras - Bonequinho de Libras */}
      <div vw="true" className="enabled">
        <div vw-access-button="true" className="active"></div>
        <div vw-plugin-wrapper="true">
          <div className="vw-plugin-top-wrapper"></div>
        </div>
      </div>

      {/* Script oficial do VLibras */}
      <Script
        src="https://vlibras.gov.br/app/vlibras-plugin.js"
        strategy="afterInteractive"
        onLoad={() => {
          // @ts-ignore
          new window.VLibras.Widget('https://vlibras.gov.br/app');
        }}
      />
    </>
  );
}
