
"use client";

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface EmergencySelectionScreenProps {
  onSelectEmergency: (type: string, colorClass: string) => void;
}

const emergencyTypes = [
  { 
    id: 'Fire', 
    name: 'Bombeiros', 
    Icon: null,
    imageUrl: 'https://i.postimg.cc/nh1NsWpr/download.png',
    tooltipText: "Para incêndios, desabamentos, resgates e afogamentos.",
    colorClass: "bg-[#FF4500] hover:bg-[#FF4500]/90 text-white"
  },
  { 
    id: 'Medical', 
    name: 'SAMU', 
    Icon: null,
    imageUrl: 'https://i.postimg.cc/Xv9m6hJj/samu-icon.png',
    tooltipText: "Para emergências médicas, acidentes e mal súbito.",
    colorClass: "bg-[#E53935] hover:bg-[#E53935]/90 text-white"
  },
  { 
    id: 'PublicSafety', 
    name: 'Polícia Militar', 
    Icon: null,
    imageUrl: 'https://i.postimg.cc/632FjLGs/Whats-App-Image-2025-06-30-at-10-54-29-AM.jpg',
    tooltipText: "Para crimes, violência, assaltos e perturbação da ordem.",
    colorClass: "bg-[#003366] hover:bg-[#003366]/90 text-white"
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
                    className={`w-full h-auto py-4 flex flex-col items-center justify-center space-y-2 text-lg transition-all duration-200 ${emergency.colorClass}`}
                    onClick={() => onSelectEmergency(emergency.id, emergency.colorClass)}
                  >
                    {emergency.Icon ? (
                      <emergency.Icon className="w-20 h-20 mb-2 text-white" />
                    ) : (
                      <div className="w-20 h-20 mb-2 relative">
                        <Image
                            src={emergency.imageUrl!}
                            alt={`${emergency.name} icon`}
                            fill
                            style={{ objectFit: 'contain' }}
                            data-ai-hint="emergency service logo"
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
