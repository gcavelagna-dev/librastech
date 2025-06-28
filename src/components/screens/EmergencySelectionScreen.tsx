
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Ambulance, Siren } from 'lucide-react';

interface EmergencySelectionScreenProps {
  onSelectEmergency: (type: string) => void;
}

const FireTruckIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="5" cy="17" r="2"></circle>
    <circle cx="17" cy="17" r="2"></circle>
    <path d="M7 17h8"></path>
    <path d="M7 12h11a2 2 0 0 1 2 2v2"></path>
    <path d="M7 12v-5h4"></path>
    <path d="M11 7l3 -3l3 3"></path>
  </svg>
);

const emergencyTypes = [
  { 
    id: 'Fire', 
    name: 'Bombeiros', 
    icon: FireTruckIcon,
    dataAiHint: "fire truck",
    tooltipText: "Para incêndios, desabamentos, resgates e afogamentos.",
    colorClass: "text-accent"
  },
  { 
    id: 'Medical', 
    name: 'SAMU', 
    icon: Ambulance, 
    dataAiHint: "ambulance medical",
    tooltipText: "Para emergências médicas, acidentes e mal súbito.",
    colorClass: "text-destructive"
  },
  { 
    id: 'PublicSafety', 
    name: 'Polícia Militar', 
    icon: Siren, 
    dataAiHint: "police siren",
    tooltipText: "Para crimes, violência, assaltos e perturbação da ordem.",
    colorClass: "text-primary"
  },
];

export function EmergencySelectionScreen({ onSelectEmergency }: EmergencySelectionScreenProps) {
  return (
    <div className="flex flex-col items-center">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Qual o tipo de Emergência?</CardTitle>
          <CardDescription>
            Sua escolha aciona a equipe correta. Toque em uma opção para mais detalhes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-6 pt-0">
          <TooltipProvider delayDuration={100}>
            {emergencyTypes.map((emergency) => (
              <Tooltip key={emergency.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-auto py-4 flex flex-col items-center justify-center space-y-2 text-lg hover:bg-accent/10 hover:border-primary/50 transition-all duration-200"
                    onClick={() => onSelectEmergency(emergency.id)}
                    data-ai-hint={emergency.dataAiHint}
                  >
                    <emergency.icon className={`w-16 h-16 mb-2 ${emergency.colorClass}`} />
                    <span className="font-semibold">{emergency.name}</span>
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
