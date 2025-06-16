import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
// import Script from 'next/script'; // Removido

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
        {/* Script do Plugin Hand Talk Removido daqui */}
      </body>
    </html>
  );
}
