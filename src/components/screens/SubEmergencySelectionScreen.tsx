
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
  Fire: ["Incêndio", "Desabamento", "Resgate em altura", "Afogamento", "Vazamento de gás", "Outros"],
  Medical: ["Acidente de trânsito", "Engasgo", "Infarto / Dor no peito", "Convulsão", "Mal súbito", "Outros"],
  PublicSafety: ["Roubo / Furto", "Violência doméstica", "Agressão", "Sequestro", "Perturbação da ordem", "Outros"],
};

const emergencyTypeMap: Record<string, string> = {
  Fire: "Incêndio/Resgate",
  Medical: "Médica",
  PublicSafety: "Segurança Pública",
};


export function SubEmergencySelectionScreen({ emergencyType, onSelectSubEmergency }: SubEmergencySelectionScreenProps) {
  const options = subEmergencyOptions[emergencyType] || [];
  const displayEmergencyType = emergencyTypeMap[emergencyType] || emergencyType;

  return (
    <div className="flex flex-col items-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-headline text-center">Qual o tipo de emergência "{displayEmergencyType}"?</CardTitle>
          <CardDescription className="text-center">
            Selecione a opção que melhor descreve a situação para um atendimento mais rápido e eficaz.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {options.map((option) => (
            <Button
              key={option}
              variant="outline"
              className="w-full h-auto py-4 text-base justify-between hover:bg-accent/10"
              onClick={() => onSelectSubEmergency(option)}
            >
              <span>{option}</span>
              <ArrowRight className="w-5 h-5 text-primary" />
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
