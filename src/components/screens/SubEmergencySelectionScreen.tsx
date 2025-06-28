
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

interface SubEmergencySelectionScreenProps {
  emergencyType: string;
  onSelectSubEmergency: (subType: string) => void;
}

const subEmergencyOptions: Record<string, string[]> = {
  Fire: ["Incêndio em vegetação", "Incêndio em edificação", "Desabamento", "Resgate em altura", "Afogamento", "Vazamento de gás", "Outros"],
  Medical: ["Acidente de trânsito", "Engasgo", "Infarto / Dor no peito", "Convulsão", "Queda", "Mal súbito", "Outros"],
  PublicSafety: ["Roubo / Furto", "Violência doméstica", "Agressão", "Sequestro", "Perturbação da ordem", "Atitude suspeita", "Outros"],
};

const emergencyTypeMap: Record<string, string> = {
  Fire: "Bombeiros",
  Medical: "SAMU",
  PublicSafety: "Polícia Militar",
};


export function SubEmergencySelectionScreen({ emergencyType, onSelectSubEmergency }: SubEmergencySelectionScreenProps) {
  const options = subEmergencyOptions[emergencyType] || [];
  const displayEmergencyType = emergencyTypeMap[emergencyType] || emergencyType;

  return (
    <div className="flex flex-col items-center">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Detalhes da emergência</CardTitle>
          <CardDescription>
            Qual destas opções melhor descreve a situação para os <span className="font-semibold text-foreground">"{displayEmergencyType}"</span>?
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-6 pt-0">
          {options.map((option) => (
            <Button
              key={option}
              variant="outline"
              className="w-full h-auto py-3 text-base justify-between hover:bg-accent/10 hover:border-primary/50 transition-all duration-200"
              onClick={() => onSelectSubEmergency(option)}
            >
              <span className="text-left">{option}</span>
              <ArrowRight className="w-5 h-5 text-primary ml-2" />
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
