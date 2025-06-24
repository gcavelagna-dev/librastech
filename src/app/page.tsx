
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { AppLayout } from '@/components/layout/AppLayout';
import { WelcomeScreen } from '@/components/screens/WelcomeScreen';
import { EmergencySelectionScreen } from '@/components/screens/EmergencySelectionScreen';
import { SubEmergencySelectionScreen } from '@/components/screens/SubEmergencySelectionScreen';
import { SosMessageScreen } from '@/components/screens/SosMessageScreen';
import { SettingsDialog } from '@/components/dialogs/SettingsDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { generateSosMessage, type GenerateSosMessageInput } from '@/ai/flows/generate-sos-message';
import { useToast } from "@/hooks/use-toast";

type AppStep = 'welcome' | 'emergency' | 'sub-emergency' | 'sos';
const LOCAL_STORAGE_USER_NAME_KEY = 'LibrasTech_UserName';
const LOCAL_STORAGE_GENDER_KEY = 'LibrasTech_Gender';
const LOCAL_STORAGE_DATE_OF_BIRTH_KEY = 'LibrasTech_DateOfBirth';
const LOCAL_STORAGE_PHONE_NUMBER_KEY = 'LibrasTech_PhoneNumber';
const LOCAL_STORAGE_DOCUMENT_TYPE_KEY = 'LibrasTech_DocumentType';
const LOCAL_STORAGE_DOCUMENT_NUMBER_KEY = 'LibrasTech_DocumentNumber';
const LOCAL_STORAGE_CITY_KEY = 'LibrasTech_City';
const LOCAL_STORAGE_TRUSTED_CONTACT_NAME_KEY = 'LibrasTech_TrustedContactName';
const LOCAL_STORAGE_TRUSTED_CONTACT_PHONE_KEY = 'LibrasTech_TrustedContactPhone';


export default function HomePage() {
  const [currentStep, setCurrentStep] = useState<AppStep>('welcome');
  const [userName, setUserName] = useState<string>('');
  const [gender, setGender] = useState<string | undefined>(undefined);
  const [dateOfBirth, setDateOfBirth] = useState<string>(''); // Storing as ISO string
  const [userPhoneNumber, setUserPhoneNumber] = useState<string>('');
  const [documentType, setDocumentType] = useState<string | undefined>(undefined);
  const [documentNumber, setDocumentNumber] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [trustedContactName, setTrustedContactName] = useState<string>('');
  const [trustedContactPhoneNumber, setTrustedContactPhoneNumber] = useState<string>('');

  const [emergencyType, setEmergencyType] = useState<string>('');
  const [subEmergencyType, setSubEmergencyType] = useState<string>('');
  const [location, setLocation] = useState<string>('Obtendo localização...');
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);
  const [sosMessage, setSosMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isSettingsDialogVisible, setIsSettingsDialogVisible] = useState(false);
  const [showPhoneNumberPrompt, setShowPhoneNumberPrompt] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);

    const storedName = localStorage.getItem(LOCAL_STORAGE_USER_NAME_KEY);
    if (storedName) setUserName(storedName);

    const storedGender = localStorage.getItem(LOCAL_STORAGE_GENDER_KEY);
    if (storedGender) setGender(storedGender);

    const storedDob = localStorage.getItem(LOCAL_STORAGE_DATE_OF_BIRTH_KEY);
    if (storedDob) setDateOfBirth(storedDob);

    const storedPhoneNumber = localStorage.getItem(LOCAL_STORAGE_PHONE_NUMBER_KEY);
    if (storedPhoneNumber) setUserPhoneNumber(storedPhoneNumber);
    else if (storedName) setShowPhoneNumberPrompt(true);

    const storedDocType = localStorage.getItem(LOCAL_STORAGE_DOCUMENT_TYPE_KEY);
    if (storedDocType) setDocumentType(storedDocType);

    const storedDocNumber = localStorage.getItem(LOCAL_STORAGE_DOCUMENT_NUMBER_KEY);
    if (storedDocNumber) setDocumentNumber(storedDocNumber);
    
    const storedCity = localStorage.getItem(LOCAL_STORAGE_CITY_KEY);
    if (storedCity) setCity(storedCity);

    const storedTrustedName = localStorage.getItem(LOCAL_STORAGE_TRUSTED_CONTACT_NAME_KEY);
    if (storedTrustedName) setTrustedContactName(storedTrustedName);

    const storedTrustedPhone = localStorage.getItem(LOCAL_STORAGE_TRUSTED_CONTACT_PHONE_KEY);
    if (storedTrustedPhone) setTrustedContactPhoneNumber(storedTrustedPhone);


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


  const handleNameSave = (name: string, userGender?: string, docType?: string, docNumber?: string, userCity?: string, dob?: Date) => {
    const trimmedName = name.trim();
    setUserName(trimmedName);
    localStorage.setItem(LOCAL_STORAGE_USER_NAME_KEY, trimmedName);

    if (userGender) {
      setGender(userGender);
      localStorage.setItem(LOCAL_STORAGE_GENDER_KEY, userGender);
    } else {
      localStorage.removeItem(LOCAL_STORAGE_GENDER_KEY);
      setGender(undefined);
    }

    if (docType) {
      setDocumentType(docType);
      localStorage.setItem(LOCAL_STORAGE_DOCUMENT_TYPE_KEY, docType);
    } else {
      localStorage.removeItem(LOCAL_STORAGE_DOCUMENT_TYPE_KEY);
      setDocumentType(undefined);
    }
    if (docNumber) {
      setDocumentNumber(docNumber);
      localStorage.setItem(LOCAL_STORAGE_DOCUMENT_NUMBER_KEY, docNumber);
    } else {
      localStorage.removeItem(LOCAL_STORAGE_DOCUMENT_NUMBER_KEY);
      setDocumentNumber('');
    }
    if (userCity) {
      setCity(userCity);
      localStorage.setItem(LOCAL_STORAGE_CITY_KEY, userCity);
    } else {
      localStorage.removeItem(LOCAL_STORAGE_CITY_KEY);
      setCity('');
    }

    if (dob) {
      const dobISOString = dob.toISOString();
      setDateOfBirth(dobISOString);
      localStorage.setItem(LOCAL_STORAGE_DATE_OF_BIRTH_KEY, dobISOString);
    } else {
      localStorage.removeItem(LOCAL_STORAGE_DATE_OF_BIRTH_KEY);
      setDateOfBirth('');
    }


    setCurrentStep('emergency');
    const storedPhoneNumber = localStorage.getItem(LOCAL_STORAGE_PHONE_NUMBER_KEY);
    if (!storedPhoneNumber) {
      setShowPhoneNumberPrompt(true);
    }
  };

  const handleSelectEmergency = (type: string) => {
    setEmergencyType(type);
    setCurrentStep('sub-emergency');
  };

  const handleSelectSubEmergency = (subType: string) => {
    setSubEmergencyType(subType);
    setSosMessage(null); 
    setCurrentStep('sos');
  };

  const handleGenerateSos = async () => {
    if (!userName || !emergencyType || !subEmergencyType || location === 'Obtendo localização...' || location.startsWith('Não foi possível')) {
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
      const input: GenerateSosMessageInput = {
        userName,
        location,
        emergencyType,
        subEmergencyType,
        ...(gender && { gender }),
        ...(dateOfBirth && { dateOfBirth: new Date(dateOfBirth).toLocaleDateString('pt-BR') }),
        ...(userPhoneNumber && { userPhoneNumber: userPhoneNumber.replace(/\D/g, '') }),
        ...(documentType && { documentType }),
        ...(documentNumber && { documentNumber }),
        ...(city && { city }),
      };
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

    const defaultPhoneNumber = "5543999054151"; 
    const targetPhoneNumber = userPhoneNumber || defaultPhoneNumber;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${targetPhoneNumber.replace(/\D/g, '')}&text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');

    toast({
      title: "Abrindo WhatsApp",
      description: `Sua mensagem está pronta para ser enviada para ${targetPhoneNumber}.`,
    });
  };

  const handleBack = () => {
    if (currentStep === 'sos') {
      setCurrentStep('sub-emergency');
    } else if (currentStep === 'sub-emergency') {
        setCurrentStep('emergency');
    } else if (currentStep === 'emergency') {
      setCurrentStep('welcome');
    }
  };

  const handleConfig = () => {
    setIsSettingsDialogVisible(true);
  };

  const handleSavePhoneNumber = (phoneNumber: string) => {
    setUserPhoneNumber(phoneNumber);
    localStorage.setItem(LOCAL_STORAGE_PHONE_NUMBER_KEY, phoneNumber);
    toast({
      title: "Número Salvo",
      description: "Seu número de telefone foi salvo para futuras emergências.",
    });
    setShowPhoneNumberPrompt(false); 
  };
  
  const handleSaveTrustedContact = (name: string, phone: string) => {
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    if (trimmedName) {
      setTrustedContactName(trimmedName);
      localStorage.setItem(LOCAL_STORAGE_TRUSTED_CONTACT_NAME_KEY, trimmedName);
    } else {
      setTrustedContactName('');
      localStorage.removeItem(LOCAL_STORAGE_TRUSTED_CONTACT_NAME_KEY);
    }

    if (trimmedPhone) {
      setTrustedContactPhoneNumber(trimmedPhone);
      localStorage.setItem(LOCAL_STORAGE_TRUSTED_CONTACT_PHONE_KEY, trimmedPhone);
    } else {
      setTrustedContactPhoneNumber('');
      localStorage.removeItem(LOCAL_STORAGE_TRUSTED_CONTACT_PHONE_KEY);
    }
    
    toast({
      title: "Contato de Confiança Salvo",
      description: "As informações do seu contato de confiança foram atualizadas.",
    });
  };


  const getScreenTitle = () => {
    switch (currentStep) {
      case 'welcome':
        return 'LibrasTech - Bem-vindo(a)';
      case 'emergency':
        return 'LibrasTech - Emergência';
      case 'sub-emergency':
        return 'LibrasTech - Detalhes';
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
          <WelcomeScreen
            onNameSave={handleNameSave}
            initialName={userName}
            initialGender={gender}
            initialDocumentType={documentType}
            initialDocumentNumber={documentNumber}
            initialCity={city}
            initialDateOfBirth={dateOfBirth}
          />
        )}
        {currentStep === 'emergency' && (
          <EmergencySelectionScreen onSelectEmergency={handleSelectEmergency} />
        )}
        {currentStep === 'sub-emergency' && (
           <SubEmergencySelectionScreen 
             emergencyType={emergencyType}
             onSelectSubEmergency={handleSelectSubEmergency}
           />
        )}
        {currentStep === 'sos' && (
          <SosMessageScreen
            userName={userName}
            location={location}
            emergencyType={emergencyType}
            subEmergencyType={subEmergencyType}
            gender={gender}
            documentType={documentType}
            documentNumber={documentNumber}
            city={city}
            dateOfBirth={dateOfBirth ? new Date(dateOfBirth).toLocaleDateString('pt-BR') : undefined}
            sosMessage={sosMessage}
            onGenerateSos={handleGenerateSos}
            isLoading={isLoading}
            onSendViaWhatsApp={handleSendViaWhatsApp}
            coordinates={coordinates}
          />
        )}
      </AppLayout>
      <SettingsDialog
        isOpen={isSettingsDialogVisible}
        onClose={() => setIsSettingsDialogVisible(false)}
        onSavePhoneNumber={handleSavePhoneNumber}
        currentPhoneNumber={userPhoneNumber}
        currentTrustedContactName={trustedContactName}
        currentTrustedContactPhoneNumber={trustedContactPhoneNumber}
        onSaveTrustedContact={handleSaveTrustedContact}
      />
       <AlertDialog open={showPhoneNumberPrompt} onOpenChange={setShowPhoneNumberPrompt}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Adicionar Número de Telefone?</AlertDialogTitle>
            <AlertDialogDescription>
              Adicionar seu número de telefone permite que ele seja incluído automaticamente nas mensagens SOS, agilizando o contato em uma emergência. Você também poderá usá-lo para enviar alertas via WhatsApp/SMS pelo celular (requer app LibrasTech no celular).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowPhoneNumberPrompt(false)}>Lembrar Depois</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              setShowPhoneNumberPrompt(false);
              setIsSettingsDialogVisible(true);
            }}>Adicionar Agora</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
