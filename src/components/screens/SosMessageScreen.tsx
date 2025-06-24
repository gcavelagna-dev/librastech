
"use client";

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Send, Info, MapPin, ClipboardCopy, User, FileText, Building, VenetianMask, Cake } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface SosMessageScreenProps {
  userName: string;
  location: string;
  emergencyType: string;
  subEmergencyType: string;
  gender?: string;
  documentType?: string;
  documentNumber?: string;
  city?: string;
  dateOfBirth?: string;
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
  subEmergencyType,
  gender,
  documentType,
  documentNumber,
  city,
  dateOfBirth,
  sosMessage,
  onGenerateSos,
  isLoading,
  onSendViaWhatsApp,
  coordinates,
}: SosMessageScreenProps) {
  const { toast } = useToast();

  const displayEmergencyType = emergencyTypeMap[emergencyType] || emergencyType;
  
  const canSendMessage = sosMessage && !sosMessage.startsWith("Erro") && !isLoading;

  const isLocationLoading = location === 'Obtendo localização...';
  const hasLocationError = location.startsWith('Não foi possível') || location === 'Geolocalização não suportada neste navegador';
  const isLocationReady = !isLocationLoading && !hasLocationError && coordinates !== null;

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
    return <p>{location}</p>;
  };

  const handleCopySosMessage = async () => {
    if (!sosMessage || sosMessage.startsWith("Erro")) {
      toast({
        title: "Mensagem Inválida",
        description: "Não há mensagem válida para copiar.",
        variant: "destructive",
      });
      return;
    }
    try {
      await navigator.clipboard.writeText(sosMessage);
      toast({
        title: "Copiado!",
        description: "Mensagem SOS copiada para a área de transferência.",
      });
    } catch (err) {
      toast({
        title: "Erro ao Copiar",
        description: "Não foi possível copiar a mensagem.",
        variant: "destructive",
      });
    }
  };

  const isGenerateButtonDisabled = isLoading || !isLocationReady;

  const getGenerateButtonContent = () => {
    if (isLoading) {
      return { text: "Gerando mensagem...", icon: <Loader2 className="w-4 h-4 mr-2 animate-spin" /> };
    }
    
    let baseText = (sosMessage && !sosMessage.startsWith("Erro")) ? "Gerar Novamente" : "Gerar Mensagem SOS";
    let locationStatus = "";
    if ((!sosMessage || sosMessage.startsWith("Erro")) && !isLocationReady) {
      locationStatus = " (Aguardando Localização)";
    }
    return { text: `${baseText}${locationStatus}`, icon: null };
  };

  const generateButtonContent = getGenerateButtonContent();

  return (
    <div className="flex flex-col items-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-headline text-center">Mensagem SOS</CardTitle>
          <CardDescription className="text-center">
            Verifique seus dados e gere a mensagem de SOS.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <h3 className="font-semibold flex items-center"><User className="w-4 h-4 mr-1 text-primary"/>Nome:</h3>
            <p>{userName}</p>
          </div>
          {gender && (
            <div>
              <h3 className="font-semibold flex items-center"><VenetianMask className="w-4 h-4 mr-1 text-primary"/>Sexo:</h3>
              <p>{gender}</p>
            </div>
          )}
           {dateOfBirth && (
            <div>
              <h3 className="font-semibold flex items-center"><Cake className="w-4 h-4 mr-1 text-primary"/>Data de Nascimento:</h3>
              <p>{dateOfBirth}</p>
            </div>
          )}
          {documentType && documentNumber && (
            <div>
              <h3 className="font-semibold flex items-center"><FileText className="w-4 h-4 mr-1 text-primary"/>Documento:</h3>
              <p>{documentType}: {documentNumber}</p>
            </div>
          )}
          {city && (
             <div>
              <h3 className="font-semibold flex items-center"><Building className="w-4 h-4 mr-1 text-primary"/>Cidade:</h3>
              <p>{city}</p>
            </div>
          )}
          <div>
            <h3 className="font-semibold flex items-center">
              <MapPin className="w-4 h-4 mr-1 text-primary" /> Localização:
            </h3>
            {getLocationDisplay()}
          </div>
          <div>
            <h3 className="font-semibold">Tipo de Emergência:</h3>
            <p>{displayEmergencyType}: {subEmergencyType}</p>
          </div>

          {isLoading && !sosMessage && ( 
            <div className="flex items-center justify-center p-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="ml-2">Gerando mensagem...</p>
            </div>
          )}

          {sosMessage && ( 
            <Alert variant={sosMessage.startsWith("Erro") ? "destructive" : "default"} className="mt-4">
              <AlertTitle>{sosMessage.startsWith("Erro") ? "Erro" : "Mensagem SOS Gerada"}</AlertTitle>
              <AlertDescription className="whitespace-pre-wrap">{sosMessage}</AlertDescription>
            </Alert>
          )}

        </CardContent>
        <CardFooter className="flex flex-col space-y-2 pt-4">
          <Button 
            onClick={onGenerateSos} 
            disabled={isGenerateButtonDisabled} 
            className="w-full"
            variant={(sosMessage && !sosMessage.startsWith("Erro")) ? "secondary" : "default"}
          >
            {generateButtonContent.icon}
            {generateButtonContent.text}
          </Button>
          
          {canSendMessage && (
            <div className="grid grid-cols-2 gap-2 w-full">
              <Button
                onClick={handleCopySosMessage}
                variant="outline"
                className="w-full"
              >
                <ClipboardCopy className="w-4 h-4 mr-2" />
                Copiar
              </Button>
              {onSendViaWhatsApp && (
                 <Button
                   onClick={() => onSendViaWhatsApp(sosMessage!)}
                   className="w-full"
                   variant="default"
                 >
                   <Send className="w-4 h-4 mr-2" />
                   WhatsApp
                 </Button>
               )}
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
