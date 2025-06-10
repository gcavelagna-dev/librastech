
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { WelcomeScreen } from '@/components/screens/WelcomeScreen';
import { EmergencySelectionScreen } from '@/components/screens/EmergencySelectionScreen';
import { SosMessageScreen } from '@/components/screens/SosMessageScreen';
import { generateSosMessage, type GenerateSosMessageInput } from '@/ai/flows/generate-sos-message';
import { useToast } from "@/hooks/use-toast";

type AppStep = 'welcome' | 'emergency' | 'sos';
const LOCAL_STORAGE_USER_NAME_KEY = 'LibrasTech_UserName';
const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY'; // ATENÇÃO: Substitua pela sua API Key

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

  const fetchAddressFromCoordinates = useCallback(async (lat: number, lon: number) => {
    if (GOOGLE_MAPS_API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY') {
      const coordsString = `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`;
      setLocation(coordsString + ' (API Key do Google Maps não configurada para buscar endereço)');
      toast({
        title: "API Key Necessária",
        description: "Configure sua API Key do Google Maps para obter o endereço.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();

      if (data.status === 'OK' && data.results && data.results.length > 0) {
        const address = data.results[0].formatted_address;
        setLocation(address);
        toast({
          title: "Endereço Obtido",
          description: "Endereço aproximado encontrado.",
        });
      } else {
        const coordsString = `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`;
        setLocation(coordsString + ' (Endereço não encontrado)');
        toast({
          title: "Erro ao Buscar Endereço",
          description: data.error_message || "Não foi possível converter coordenadas em endereço. Exibindo Lat/Lon.",
          variant: "destructive",
        });
        console.error("Google Geocoding API error:", data.status, data.error_message);
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      const coordsString = `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`;
      setLocation(coordsString + ' (Erro na API)');
      toast({
        title: "Erro de Rede",
        description: "Falha ao comunicar com a API de geocodificação.",
        variant: "destructive",
      });
    }
  }, [toast]);

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
          setLocation(coordsString); // Define inicialmente com lat/lon
          toast({
            title: "Coordenadas Obtidas",
            description: "Latitude e longitude capturadas. Buscando endereço...",
          });
          fetchAddressFromCoordinates(lat, lon);
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
  }, [toast, fetchAddressFromCoordinates]);


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
    if (!userName || !location || !emergencyType || location === 'Obtendo localização...' || location.startsWith('Não foi possível')) {
      toast({
        title: "Erro de Validação",
        description: "Nome e tipo de emergência são necessários. Aguarde a obtenção da localização.",
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
          coordinates={coordinates}
        />
      )}
    </AppLayout>
  );
}
