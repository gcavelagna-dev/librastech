"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from 'lucide-react';

interface SosMessageScreenProps {
  userName: string;
  location: string;
  emergencyType: string;
  sosMessage: string | null;
  onGenerateSos: () => void;
  isLoading: boolean;
}

const emergencyTypeMap: Record<string, string> = {
  Fire: "Incêndio/Resgate",
  Medical: "Médica",
  PublicSafety: "Segurança Pública",
};


export function SosMessageScreen({
  userName,
  location,
  emergencyType,
  sosMessage,
  onGenerateSos,
  isLoading,
}: SosMessageScreenProps) {
  const displayEmergencyType = emergencyTypeMap[emergencyType] || emergencyType;

  return (
    <div className="flex flex-col items-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-headline text-center">Mensagem SOS</CardTitle>
          <CardDescription className="text-center">
            Verifique seus dados e gere a mensagem de SOS.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">Nome:</h3>
            <p>{userName}</p>
          </div>
          <div>
            <h3 className="font-semibold">Localização (Estimada):</h3>
            <p>{location}</p>
          </div>
          <div>
            <h3 className="font-semibold">Tipo de Emergência:</h3>
            <p>{displayEmergencyType}</p>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="ml-2">Gerando mensagem...</p>
            </div>
          )}

          {sosMessage && !isLoading && (
            <Alert variant={sosMessage.startsWith("Erro") ? "destructive" : "default"}>
              <AlertTitle>{sosMessage.startsWith("Erro") ? "Erro" : "Mensagem SOS Gerada"}</AlertTitle>
              <AlertDescription className="whitespace-pre-wrap">{sosMessage}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          {!sosMessage && !isLoading && (
             <Button onClick={onGenerateSos} disabled={isLoading} className="w-full">
                Gerar Mensagem SOS
            </Button>
          )}
           {(sosMessage || isLoading) && ( // Show button to regenerate if there was an error or if user wants to try again
            <Button onClick={onGenerateSos} disabled={isLoading} className="w-full" variant="secondary">
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {sosMessage && sosMessage.startsWith("Erro") ? "Tentar Novamente" : "Gerar Novamente"}
            </Button>
           )}
        </CardFooter>
      </Card>
    </div>
  );
}
