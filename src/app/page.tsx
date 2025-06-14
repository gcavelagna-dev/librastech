
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { AppLayout } from '@/components/layout/AppLayout';
import { WelcomeScreen } from '@/components/screens/WelcomeScreen';
import { EmergencySelectionScreen } from '@/components/screens/EmergencySelectionScreen';
import { SosMessageScreen } from '@/components/screens/SosMessageScreen';
import { generateSosMessage, type GenerateSosMessageInput } from '@/ai/flows/generate-sos-message';
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

type AppStep = 'welcome' | 'emergency' | 'sos';
const LOCAL_STORAGE_USER_NAME_KEY = 'LibrasTech_UserName';

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState<AppStep>('welcome');
  const [userName, setUserName] = useState<string>('');
  const [emergencyType, setEmergencyType] = useState<string>('');
  const [location, setLocation] = useState<string>('Obtendo localização...');
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);
  const [sosMessage, setSosMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();

  const [isRegistrationQrVisible, setIsRegistrationQrVisible] = useState(false);
  const [registrationQrDataUrl, setRegistrationQrDataUrl] = useState<string | null>(null);


  useEffect(() => {
    setIsMounted(true);

    const storedName = localStorage.getItem(LOCAL_STORAGE_USER_NAME_KEY);
    if (storedName) {
      setUserName(storedName);
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setCoordinates({ lat, lon });
          const coordsString = `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`;
          setLocation(coordsString);
        },
        () => {
          setLocation('Não foi possível obter a localização');
          toast({
            title: "Erro de Localização",
            description: "Não foi possível obter sua localização. Verifique as permissões do navegador.",
            variant: "destructive",
          });
        }
      );
    } else {
      setLocation('Geolocalização não suportada neste navegador');
      toast({
        title: "Erro de Localização",
        description: "Geolocalização não é suportada pelo seu navegador.",
        variant: "destructive",
      });
    }
  }, [toast]);


  const handleNameSave = (name: string) => {
    const trimmedName = name.trim();
    setUserName(trimmedName);
    localStorage.setItem(LOCAL_STORAGE_USER_NAME_KEY, trimmedName);
    setCurrentStep('emergency');
  };

  const handleSelectEmergency = (type: string) => {
    setEmergencyType(type);
    setSosMessage(null);
    setCurrentStep('sos');
  };

  const handleGenerateSos = async () => {
    if (!userName || !emergencyType || location === 'Obtendo localização...' || location.startsWith('Não foi possível')) {
      toast({
        title: "Dados Incompletos",
        description: "Nome e tipo de emergência são obrigatórios. Aguarde a obtenção da localização ou verifique as permissões.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setSosMessage(null);
    try {
      const input: GenerateSosMessageInput = { userName, location, emergencyType };
      const result = await generateSosMessage(input);
      setSosMessage(result.sosMessage);
    } catch (error) {
      console.error("Error generating SOS message:", error);
      const errorMessage = "Erro ao gerar mensagem SOS. Verifique sua conexão e tente novamente.";
      setSosMessage(errorMessage);
      toast({
        title: "Erro na Geração",
        description: errorMessage,
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleSendViaWhatsApp = (message: string) => {
    if (!message || message.startsWith("Erro")) {
      toast({
        title: "Mensagem Inválida",
        description: "Não é possível enviar uma mensagem de erro ou vazia para o WhatsApp.",
        variant: "destructive",
      });
      return;
    }
    const phoneNumber = "5543999054151"; 
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "Abrindo WhatsApp",
      description: "Sua mensagem está pronta para ser enviada.",
    });
  };

  const handleBack = () => {
    setSosMessage(null); 
    if (currentStep === 'sos') {
      setCurrentStep('emergency');
    } else if (currentStep === 'emergency') {
      setCurrentStep('welcome');
    }
  };
  
  const handleConfig = () => {
    const sessionId = Date.now().toString(36) + Math.random().toString(36).substring(2);
    const qrData = JSON.stringify({ action: "registerLibrasTechDevice", sessionId: sessionId });
    const url = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrData)}&size=250x250&margin=10&ecc=H`;
    setRegistrationQrDataUrl(url);
    setIsRegistrationQrVisible(true);
  };

  const getScreenTitle = () => {
    switch (currentStep) {
      case 'welcome':
        return 'LibrasTech - Bem-vindo(a)';
      case 'emergency':
        return 'LibrasTech - Emergência';
      case 'sos':
        return 'LibrasTech - Mensagem SOS';
      default:
        return 'LibrasTech';
    }
  };

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <>
      <AppLayout
        title={getScreenTitle()}
        showBack={currentStep !== 'welcome'}
        onBack={handleBack}
        onConfig={handleConfig}
        showConfig={true}
      >
        {currentStep === 'welcome' && (
          <WelcomeScreen onNameSave={handleNameSave} initialName={userName} />
        )}
        {currentStep === 'emergency' && (
          <EmergencySelectionScreen onSelectEmergency={handleSelectEmergency} />
        )}
        {currentStep === 'sos' && (
          <SosMessageScreen
            userName={userName}
            location={location}
            emergencyType={emergencyType}
            sosMessage={sosMessage}
            onGenerateSos={handleGenerateSos}
            isLoading={isLoading}
            onSendViaWhatsApp={handleSendViaWhatsApp}
            coordinates={coordinates}
          />
        )}
      </AppLayout>

      <Dialog open={isRegistrationQrVisible} onOpenChange={setIsRegistrationQrVisible}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Registrar Dispositivo</DialogTitle>
            <DialogDescription>
              Escaneie este QR Code com o aplicativo LibrasTech no seu celular para conectar sua conta.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-4">
            {registrationQrDataUrl && (
              <Image 
                src={registrationQrDataUrl} 
                alt="QR Code para registro de dispositivo" 
                width={250} 
                height={250}
                data-ai-hint="qr code" 
              />
            )}
          </div>
          <DialogFooter className="sm:justify-center">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Fechar
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
