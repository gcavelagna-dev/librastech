
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Send, Info, MapPin } from 'lucide-react';

interface SosMessageScreenProps {
  userName: string;
  location: string;
  emergencyType: string;
  sosMessage: string | null;
  onGenerateSos: () => void;
  isLoading: boolean;
  onSendViaWhatsApp?: (message: string) => void;
  coordinates: { lat: number; lon: number } | null;
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
  onSendViaWhatsApp,
  coordinates,
}: SosMessageScreenProps) {
  const displayEmergencyType = emergencyTypeMap[emergencyType] || emergencyType;
  const canSendMessage = sosMessage && !sosMessage.startsWith("Erro") && !isLoading;
  const isLocationLoading = location === 'Obtendo localização...';
  const hasLocationError = location.startsWith('Não foi possível') || location === 'Geolocalização não suportada neste navegador';
  const isLocationReady = !isLocationLoading && !hasLocationError && !location.includes('(API Key do Google Maps não configurada');

  const getLocationDisplay = () => {
    if (isLocationLoading) {
      return (
        <div className="flex items-center text-sm text-muted-foreground mt-1">
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          <span>{location}</span>
        </div>
      );
    }
    if (hasLocationError) {
      return (
        <div className="flex items-center text-sm text-destructive mt-1">
          <Info className="w-4 h-4 mr-2" />
          <span>{location}</span>
        </div>
      );
    }
    if (location.includes('(API Key do Google Maps não configurada')) {
         return (
            <>
                <p>{location.split('(API Key')[0].trim()}</p>
                <div className="flex items-center text-sm text-amber-600 dark:text-amber-500 mt-1">
                    <Info className="w-4 h-4 mr-2" />
                    <span>API Key do Google Maps não configurada para buscar endereço.</span>
                </div>
            </>
         );
    }
     if (location.includes('(Endereço não encontrado)')) {
         return (
            <>
                <p>{location.split('(Endereço não encontrado)')[0].trim()}</p>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <Info className="w-4 h-4 mr-2" />
                    <span>Endereço não encontrado, exibindo coordenadas.</span>
                </div>
            </>
         );
    }
    if (location.includes('(Erro na API)')) {
        return (
           <>
               <p>{location.split('(Erro na API)')[0].trim()}</p>
               <div className="flex items-center text-sm text-destructive mt-1">
                   <Info className="w-4 h-4 mr-2" />
                   <span>Erro ao buscar endereço, exibindo coordenadas.</span>
               </div>
           </>
        );
   }
    return <p>{location}</p>;
  };

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
            <h3 className="font-semibold flex items-center">
              <MapPin className="w-4 h-4 mr-1 text-primary" /> Localização:
            </h3>
            {getLocationDisplay()}
          </div>
          <div>
            <h3 className="font-semibold">Tipo de Emergência:</h3>
            <p>{displayEmergencyType}</p>
          </div>

          {isLoading && !sosMessage && ( // Mostrar apenas se estiver carregando e não houver mensagem ainda
            <div className="flex items-center justify-center p-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="ml-2">Gerando mensagem...</p>
            </div>
          )}

          {sosMessage && ( // Mostrar sempre que houver uma mensagem, mesmo durante o carregamento de uma nova
            <Alert variant={sosMessage.startsWith("Erro") ? "destructive" : "default"} className="mt-4">
              <AlertTitle>{sosMessage.startsWith("Erro") ? "Erro" : "Mensagem SOS"}</AlertTitle>
              <AlertDescription className="whitespace-pre-wrap">{sosMessage}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 pt-4">
          <Button 
            onClick={onGenerateSos} 
            disabled={isLoading || !isLocationReady} 
            className="w-full"
            variant={sosMessage && !sosMessage.startsWith("Erro") ? "secondary" : "default"}
          >
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            {sosMessage && !sosMessage.startsWith("Erro") ? "Gerar Novamente" : "Gerar Mensagem SOS"}
            {(!sosMessage || sosMessage.startsWith("Erro")) && !isLocationReady && !isLoading && " (Aguardando Localização)"}
          </Button>
          
           {canSendMessage && onSendViaWhatsApp && (
             <Button
               onClick={() => onSendViaWhatsApp(sosMessage!)}
               className="w-full"
               variant="default"
             >
               <Send className="w-4 h-4 mr-2" />
               Enviar via WhatsApp
             </Button>
           )}
        </CardFooter>
      </Card>
    </div>
  );
}
