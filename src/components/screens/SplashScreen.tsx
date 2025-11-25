
"use client";

import React from 'react';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

export function SplashScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-48 h-48 sm:w-64 sm:h-64">
            <Image
              src="https://i.postimg.cc/Y0zLsc0X/removebg-preview.png"
              alt="LibrasTech Logo"
              fill
              style={{ objectFit: 'contain' }}
              priority // Load this image first
              data-ai-hint="app logo"
            />
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            <p className="text-lg">Carregando...</p>
        </div>
      </div>
    </div>
  );
}
