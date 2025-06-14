
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Send, Info, MapPin, ClipboardCopy, QrCode } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

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

  const handleShowQrCode = () => {
    if (!canSendMessage || !sosMessage) {
       toast({
        title: "Gere a Mensagem Primeiro",
        description: "Você precisa gerar uma mensagem SOS válida antes de mostrar o QR Code.",
        variant: "destructive",
      });
      setQrCodeUrl(null);
      return;
    }
    const qrData = JSON.stringify({
      sosMessage,
      userName,
      location,
      emergencyType: displayEmergencyType,
      coordinates,
    });
    const url = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrData)}&size=220x220&margin=10`;
    setQrCodeUrl(url);
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

          {qrCodeUrl && canSendMessage && (
            <div className="mt-4 p-4 border rounded-md flex flex-col items-center bg-card">
              <p className="text-sm text-center mb-2 text-muted-foreground">
                Escaneie com seu celular para enviar via WhatsApp/SMS (requer app LibrasTech no celular).
              </p>
              <Image src={qrCodeUrl} alt="QR Code para mensagem SOS" width={220} height={220} data-ai-hint="qr code" />
              <Button variant="outline" size="sm" onClick={() => setQrCodeUrl(null)} className="mt-3">
                Fechar QR Code
              </Button>
            </div>
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
          {canSendMessage && (
             <Button
                onClick={handleShowQrCode}
                variant="outline"
                className="w-full"
              >
                <QrCode className="w-4 h-4 mr-2" />
                {qrCodeUrl ? "Atualizar QR Code" : "QR Code para Celular"}
              </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
