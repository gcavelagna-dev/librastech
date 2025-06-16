import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'LibrasTech',
  description: 'App de assistência emergencial acessível',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
        {/* Script do Plugin Hand Talk */}
        <Script src="https://plugin.handtalk.me/web/latest/handtalk.min.js" strategy="afterInteractive" />
        <Script id="handtalk-init" strategy="afterInteractive">
          {`
            var ht = new HT({
              token: "SEU_TOKEN_AQUI_FORNECIDO_PELA_HANDTALK" // IMPORTANTE: Substitua pelo seu token real
            });
          `}
        </Script>
      </body>
    </html>
  );
}
