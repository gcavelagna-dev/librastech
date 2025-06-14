
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Flame, HeartPulse, ShieldAlert } from 'lucide-react';

interface EmergencySelectionScreenProps {
  onSelectEmergency: (type: string) => void;
}

const emergencyTypes = [
  { 
    id: 'Fire', 
    name: 'Incêndio/Resgate', 
    icon: Flame, 
    dataAiHint: "fire flames",
    tooltipText: "Para incêndios, desabamentos, resgate em locais de difícil acesso."
  },
  { 
    id: 'Medical', 
    name: 'Médica', 
    icon: HeartPulse, 
    dataAiHint: "medical cross",
    tooltipText: "Para emergências médicas, acidentes, necessidade de ambulância."
  },
  { 
    id: 'PublicSafety', 
    name: 'Segurança Pública', 
    icon: ShieldAlert, 
    dataAiHint: "police shield",
    tooltipText: "Para situações de perigo, assaltos, violência, perturbação da ordem."
  },
];

export function EmergencySelectionScreen({ onSelectEmergency }: EmergencySelectionScreenProps) {
  return (
    <div className="flex flex-col items-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-headline text-center">Tipo de Emergência</CardTitle>
          <CardDescription className="text-center">
            Escolha o tipo de emergência. Vamos acionar ajuda imediatamente com base na sua localização.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <TooltipProvider delayDuration={300}>
            {emergencyTypes.map((emergency) => (
              <Tooltip key={emergency.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-auto py-4 flex flex-col items-center justify-center space-y-2 text-lg hover:bg-accent/10"
                    onClick={() => onSelectEmergency(emergency.id)}
                    data-ai-hint={emergency.dataAiHint}
                  >
                    <emergency.icon className="w-12 h-12 mb-2 text-primary" />
                    <span>{emergency.name}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{emergency.tooltipText}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </CardContent>
      </Card>
    </div>
  );
}
