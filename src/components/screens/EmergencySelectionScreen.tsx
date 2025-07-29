
"use client";

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Flame, Ambulance, Siren } from 'lucide-react';

interface EmergencySelectionScreenProps {
  onSelectEmergency: (type: string) => void;
}

const emergencyTypes = [
  { 
    id: 'Fire', 
    name: 'Bombeiros', 
    Icon: Flame,
    tooltipText: "Para incêndios, desabamentos, resgates e afogamentos.",
    colorClass: "text-accent"
  },
  { 
    id: 'Medical', 
    name: 'SAMU', 
    Icon: Ambulance,
    tooltipText: "Para emergências médicas, acidentes e mal súbito.",
    colorClass: "text-destructive"
  },
  { 
    id: 'PublicSafety', 
    name: 'Polícia Militar', 
    Icon: null,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/PMPR.png/819px-PMPR.png',
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
                  >
                    {emergency.Icon ? (
                      <emergency.Icon className={`w-20 h-20 mb-2 ${emergency.colorClass}`} />
                    ) : (
                      <div className="w-20 h-20 mb-2 relative">
                        <Image
                            src={emergency.imageUrl!}
                            alt={`${emergency.name} icon`}
                            fill
                            style={{ objectFit: 'contain' }}
                            data-ai-hint="police shield"
                        />
                      </div>
                    )}
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
