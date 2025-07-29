
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Send, Info, MapPin, ClipboardCopy, User, FileText, Building, VenetianMask, Cake, Siren, Droplet } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';

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
  bloodType?: string;
  sendDocumentsConfirmed?: boolean;
  sosMessage: string | null;
  onGenerateSos: () => void;
  isLoading: boolean;
  onSendToEmergency: (message: string) => void;
  onSendToTrustedContact: (phone: string, message: string) => void;
  trustedContacts: { name: string; phone: string }[];
}

const emergencyTypeMap: Record<string, string> = {
  Fire: "Bombeiros",
  Medical: "SAMU",
  PublicSafety: "Polícia Militar",
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
  bloodType,
  sendDocumentsConfirmed,
  sosMessage,
  onGenerateSos,
  isLoading,
  onSendToEmergency,
  onSendToTrustedContact,
  trustedContacts,
}: SosMessageScreenProps) {
  const { toast } = useToast();

  const displayEmergencyType = emergencyTypeMap[emergencyType] || emergencyType;
  
  const canSendMessage = sosMessage && !sosMessage.startsWith("Erro") && !isLoading;

  const isLocationLoading = location === 'Obtendo localização...';
  const hasLocationError = location.startsWith('Não foi possível') || location === 'Geolocalização não suportada neste navegador';
  const isLocationReady = !isLocationLoading && !hasLocationError;

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
    return <p className="text-foreground">{location}</p>;
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

  const getGenerateButtonText = () => {
    if (isLoading) return "Gerando mensagem...";
    if (sosMessage && !sosMessage.startsWith("Erro")) return "Gerar Novamente";
    if (!isLocationReady) return "Aguardando Localização...";
    return "Gerar Mensagem SOS";
  };


  return (
    <div className="flex flex-col items-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Revisão Final</CardTitle>
          <CardDescription>
            Confirme seus dados e gere a mensagem de SOS.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <h3 className="font-semibold flex items-center text-muted-foreground"><User className="w-4 h-4 mr-1.5"/>Nome:</h3>
                <p className="text-foreground">{userName}</p>
              </div>
               <div className="space-y-1">
                <h3 className="font-semibold flex items-center text-muted-foreground"><Cake className="w-4 h-4 mr-1.5"/>Nascimento:</h3>
                <p className="text-foreground">{dateOfBirth || 'N/A'}</p>
              </div>
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {gender && (
                <div className="space-y-1">
                  <h3 className="font-semibold flex items-center text-muted-foreground"><VenetianMask className="w-4 h-4 mr-1.5"/>Sexo:</h3>
                  <p className="text-foreground">{gender}</p>
                </div>
              )}
              {bloodType && (
                <div className="space-y-1">
                    <h3 className="font-semibold flex items-center text-muted-foreground"><Droplet className="w-4 h-4 mr-1.5"/>Tipo Sanguíneo:</h3>
                    <p className="text-foreground">{bloodType}</p>
                </div>
              )}
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {documentType && documentNumber && sendDocumentsConfirmed && (
                <div className="space-y-1">
                  <h3 className="font-semibold flex items-center text-muted-foreground"><FileText className="w-4 h-4 mr-1.5"/>Documento:</h3>
                  <p className="text-foreground">{documentType}: {documentNumber}</p>
                </div>
              )}
               {city && (
                 <div className="space-y-1">
                  <h3 className="font-semibold flex items-center text-muted-foreground"><Building className="w-4 h-4 mr-1.5"/>Cidade:</h3>
                  <p className="text-foreground">{city}</p>
                </div>
              )}
            </div>

            <div className="space-y-1">
                <h3 className="font-semibold flex items-center text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-1.5" /> Localização:
                </h3>
                {getLocationDisplay()}
            </div>

             <div className="space-y-1">
                <h3 className="font-semibold flex items-center text-muted-foreground">
                    <Siren className="w-4 h-4 mr-1.5 text-destructive" /> Emergência:
                </h3>
                <p className="text-foreground font-medium">{displayEmergencyType}: <span className="font-normal">{subEmergencyType}</span></p>
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
              <AlertDescription className="whitespace-pre-wrap text-base">{sosMessage}</AlertDescription>
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
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {getGenerateButtonText()}
          </Button>
          
          {canSendMessage && (
            <div className="flex flex-col gap-2 w-full">
              <div className="grid grid-cols-2 gap-2 w-full">
                <Button onClick={handleCopySosMessage} variant="outline" className="w-full">
                  <ClipboardCopy className="w-4 h-4 mr-2" />
                  Copiar
                </Button>
                <Button
                  onClick={() => onSendToEmergency(sosMessage!)}
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Enviar p/ Emergência
                </Button>
              </div>

              {trustedContacts.length > 0 && (
                <div className="w-full space-y-2 pt-2">
                  <Separator />
                  <h4 className="text-sm font-medium text-center text-muted-foreground pt-1">Notificar Contatos de Confiança</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                    {trustedContacts.map((contact, index) => (
                      <Button
                        key={index}
                        variant="secondary"
                        onClick={() => onSendToTrustedContact(contact.phone, sosMessage!)}
                        disabled={!canSendMessage}
                      >
                        <User className="w-4 h-4 mr-2" />
                        {contact.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
