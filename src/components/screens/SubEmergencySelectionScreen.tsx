
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, User, Users, Droplets, ShieldBan } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';

interface SubEmergencySelectionScreenProps {
  emergencyType: string;
  onSelectSubEmergency: (subType: string, isVictim: boolean, isBleeding: boolean) => void;
  colorClass: string;
  hasBloodType: boolean;
  isStepTwo: boolean;
  setIsStepTwo: (isStepTwo: boolean) => void;
}

const subEmergencyOptions: Record<string, string[]> = {
  Fire: ["Incêndio", "Acidente de trânsito com vítima presa", "Queda de altura", "Desabamento / Soterramento", "Afogamento", "Choque elétrico", "Outros"],
  Medical: ["Engasgo", "Infarto / Dor no peito", "Convulsão", "Mal súbito", "Outros"],
  PublicSafety: ["Roubo / Furto", "Violência doméstica", "Agressão", "Sequestro", "Perturbação da ordem", "Atitude suspeita", "Outros"],
};

const fireSubOptions = ["Incêndio (Vegetação)", "Incêndio (Edificação)"];


const emergencyTypeMap: Record<string, string> = {
  Fire: "Bombeiros",
  Medical: "SAMU",
  PublicSafety: "Polícia Militar",
};


export function SubEmergencySelectionScreen({ 
    emergencyType, 
    onSelectSubEmergency, 
    colorClass, 
    hasBloodType,
    isStepTwo,
    setIsStepTwo,
}: SubEmergencySelectionScreenProps) {
  const options = subEmergencyOptions[emergencyType] || [];
  const displayEmergencyType = emergencyTypeMap[emergencyType] || emergencyType;
  
  const [selectedSubType, setSelectedSubType] = useState<string | null>(null);
  const [isVictim, setIsVictim] = useState<boolean | null>(null);
  const [isBleeding, setIsBleeding] = useState<boolean | null>(null);

  const handleNext = (subType: string) => {
    if (subType === 'Incêndio') {
      setIsStepTwo(true);
    } else {
      setSelectedSubType(subType);
    }
  }

  const handleFireSubTypeSelection = (fireSubType: string) => {
      setSelectedSubType(fireSubType);
      setIsStepTwo(false); // Go back to showing the victim/bleeding questions
  }

  const handleFinalSelection = () => {
    if (selectedSubType && isVictim !== null && isBleeding !== null) {
      onSelectSubEmergency(selectedSubType, isVictim, isBleeding);
    }
  }

  // Extrai a cor base da classe para usar no hover
  const baseColor = colorClass.split(' ')[0]; 
  const hoverClass = baseColor.replace('bg-', 'hover:bg-'); 

  if (isStepTwo && emergencyType === 'Fire') {
     return (
       <div className="flex flex-col items-center">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Qual tipo de Incêndio?</CardTitle>
            <CardDescription>
              Selecione o tipo de incêndio para os <span className="font-semibold text-foreground">"{displayEmergencyType}"</span>.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-6 pt-0">
            {fireSubOptions.map((option) => (
              <Button
                key={option}
                className={cn(
                  "w-full h-auto py-3 text-base justify-between text-white transition-all duration-200",
                  baseColor, 
                  hoverClass 
                )}
                onClick={() => handleFireSubTypeSelection(option)}
              >
                <span className="text-left">{option}</span>
                <ArrowRight className="w-5 h-5 text-white/80 ml-2" />
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
     )
  }

  if (selectedSubType) {
    return (
       <div className="flex flex-col items-center">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Mais detalhes</CardTitle>
            <CardDescription>
              Forneça mais algumas informações para agilizar o atendimento.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6 p-6 pt-0">
            <div className='space-y-3 text-left'>
                <Label>Quem é a vítima?</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button
                        variant={isVictim === true ? 'default' : 'outline'}
                        onClick={() => setIsVictim(true)}
                        className="h-auto py-3 text-base justify-center"
                    >
                        <User className="mr-2" /> Eu sou a vítima
                    </Button>
                    <Button
                         variant={isVictim === false ? 'default' : 'outline'}
                         onClick={() => setIsVictim(false)}
                         className="h-auto py-3 text-base justify-center"
                    >
                        <Users className="mr-2" /> Outra pessoa
                    </Button>
                </div>
            </div>
            <div className='space-y-3 text-left'>
                <Label>Há sangramento no local?</Label>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button
                         variant={isBleeding === true ? 'destructive' : 'outline'}
                         onClick={() => setIsBleeding(true)}
                         className="h-auto py-3 text-base justify-center"
                    >
                        <Droplets className="mr-2" /> Sim
                    </Button>
                    <Button
                         variant={isBleeding === false ? 'default' : 'outline'}
                         onClick={() => setIsBleeding(false)}
                         className="h-auto py-3 text-base justify-center"
                    >
                        <ShieldBan className="mr-2" /> Não
                    </Button>
                </div>
                {isBleeding && hasBloodType && (
                    <p className="text-xs text-muted-foreground px-1 pt-1 text-center">
                        Seu tipo sanguíneo será adicionado à mensagem.
                    </p>
                )}
            </div>

            <Button 
              onClick={handleFinalSelection}
              disabled={isVictim === null || isBleeding === null}
              className={cn("w-full h-auto py-3 text-base justify-center mt-4", baseColor, hoverClass, "text-white")}
            >
              Confirmar e Gerar Mensagem
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
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
              className={cn(
                "w-full h-auto py-3 text-base justify-between text-white transition-all duration-200",
                baseColor, 
                hoverClass 
              )}
              onClick={() => handleNext(option)}
            >
              <span className="text-left">{option}</span>
              <ArrowRight className="w-5 h-5 text-white/80 ml-2" />
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
