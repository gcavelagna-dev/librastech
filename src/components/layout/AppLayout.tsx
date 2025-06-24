import type React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Settings, ArrowRight } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
  onBack?: () => void;
  showBack?: boolean;
  onConfig?: () => void;
  showConfig?: boolean;
  title?: string;
}

export function AppLayout({
  children,
  onBack,
  showBack = false,
  onConfig,
  showConfig = true,
  title = "LibrasTech"
}: AppLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 border-b shadow-sm bg-card md:px-6">
        <div className="flex items-center gap-2">
            {showBack && onBack ? (
              <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden">
                <ChevronLeft className="w-5 h-5" />
                 <span className="sr-only">Voltar</span>
              </Button>
            ) : <div className="w-10 h-10 md:hidden"/>}
            <h1 className="text-xl font-semibold font-headline">{title}</h1>
        </div>
        
        {showConfig && onConfig && (
          <Button variant="ghost" size="icon" onClick={onConfig} aria-label="Configurações">
            <Settings className="w-5 h-5" />
          </Button>
        )}
      </header>
      <main className="flex-1 w-full max-w-2xl p-4 mx-auto md:p-6">
        {children}
      </main>
      <footer className="sticky bottom-0 z-10 flex items-center justify-between h-16 px-4 border-t bg-card md:px-6">
        {showBack && onBack ? (
          <Button variant="outline" onClick={onBack} className="hidden md:flex">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        ) : <div />}
        
        {/* Placeholder for potential next button if needed in the future */}
        <div />
      </footer>
    </div>
  );
}
