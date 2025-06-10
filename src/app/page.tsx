
"use client";

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { WelcomeScreen } from '@/components/screens/WelcomeScreen';
import { EmergencySelectionScreen } from '@/components/screens/EmergencySelectionScreen';
import { SosMessageScreen } from '@/components/screens/SosMessageScreen';
import { generateSosMessage, type GenerateSosMessageInput } from '@/ai/flows/generate-sos-message';
import { useToast } from "@/hooks/use-toast";

type AppStep = 'welcome' | 'emergency' | 'sos';
const LOCAL_STORAGE_USER_NAME_KEY = 'LibrasTech_UserName';

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState<AppStep>('welcome');
  const [userName, setUserName] = useState<string>('');
  const [emergencyType, setEmergencyType] = useState<string>('');
  const [location, setLocation] = useState<string>('Localização não informada');
  const [sosMessage, setSosMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);

    const storedName = localStorage.getItem(LOCAL_STORAGE_USER_NAME_KEY);
    if (storedName) {
      setUserName(storedName);
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation('Proximidades da localização atual');
        },
        () => {
          setLocation('Não foi possível obter a localização');
        }
      );
    }
  }, []);


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
    if (!userName || !location || !emergencyType) {
      toast({
        title: "Erro de Validação",
        description: "Nome, localização e tipo de emergência são necessários.",
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
      toast({
        title: "Mensagem SOS Gerada",
        description: "Sua mensagem de emergência foi criada.",
      });
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
    toast({
        title: "Configurações",
        description: "Funcionalidade de configurações ainda não implementada.",
    });
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
        />
      )}
    </AppLayout>
  );
}
