"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, HeartPulse, ShieldAlert } from 'lucide-react';

interface EmergencySelectionScreenProps {
  onSelectEmergency: (type: string) => void;
}

const emergencyTypes = [
  { id: 'Fire', name: 'Incêndio/Resgate', icon: Flame, dataAiHint: "fire flames" },
  { id: 'Medical', name: 'Médica', icon: HeartPulse, dataAiHint: "medical cross" },
  { id: 'PublicSafety', name: 'Segurança Pública', icon: ShieldAlert, dataAiHint: "police shield" },
];

export function EmergencySelectionScreen({ onSelectEmergency }: EmergencySelectionScreenProps) {
  return (
    <div className="flex flex-col items-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-headline text-center">Tipo de Emergência</CardTitle>
          <CardDescription className="text-center">
            Selecione o tipo de emergência para podermos ajudar melhor.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {emergencyTypes.map((emergency) => (
            <Button
              key={emergency.id}
              variant="outline"
              className="w-full h-auto py-4 flex flex-col items-center justify-center space-y-2 text-lg hover:bg-accent/10"
              onClick={() => onSelectEmergency(emergency.id)}
              data-ai-hint={emergency.dataAiHint}
            >
              <emergency.icon className="w-12 h-12 mb-2 text-primary" />
              <span>{emergency.name}</span>
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
