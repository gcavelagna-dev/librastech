import type React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Settings, ArrowRight } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
  currentStep?: string; 
  onBack?: () => void;
  showBack?: boolean;
  onNext?: () => void;
  showNext?: boolean;
  nextButtonText?: string;
  nextButtonDisabled?: boolean;
  onConfig?: () => void;
  showConfig?: boolean;
  title?: string;
}

export function AppLayout({
  children,
  onBack,
  showBack = false,
  onNext,
  showNext = false,
  nextButtonText = "Próximo",
  nextButtonDisabled = false,
  onConfig,
  showConfig = true,
  title = "LibrasTech"
}: AppLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 border-b shadow-sm bg-card md:px-6">
        <h1 className="text-xl font-semibold font-headline">{title}</h1>
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
          <Button variant="outline" onClick={onBack}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        ) : <div />}
        {showNext && onNext && (
          <Button onClick={onNext} disabled={nextButtonDisabled}>
            {nextButtonText}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </footer>
    </div>
  );
}
