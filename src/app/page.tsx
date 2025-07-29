
"use client";

import React, { useState, useEffect } from 'react';
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
import { reverseGeocode } from '@/ai/flows/reverse-geocode-flow';
import { useToast } from "@/hooks/use-toast";

type AppStep = 'welcome' | 'emergency' | 'sub-emergency' | 'sos';
type TrustedContact = { name: string; phone: string };

const LOCAL_STORAGE_USER_NAME_KEY = 'LibrasTech_UserName';
const LOCAL_STORAGE_GENDER_KEY = 'LibrasTech_Gender';
const LOCAL_STORAGE_DATE_OF_BIRTH_KEY = 'LibrasTech_DateOfBirth';
const LOCAL_STORAGE_PHONE_NUMBER_KEY = 'LibrasTech_PhoneNumber';
const LOCAL_STORAGE_DOCUMENT_TYPE_KEY = 'LibrasTech_DocumentType';
const LOCAL_STORAGE_DOCUMENT_NUMBER_KEY = 'LibrasTech_DocumentNumber';
const LOCAL_STORAGE_CITY_KEY = 'LibrasTech_City';
const LOCAL_STORAGE_TRUSTED_CONTACTS_KEY = 'LibrasTech_TrustedContacts';
const LOCAL_STORAGE_BLOOD_TYPE_KEY = 'LibrasTech_BloodType';
const LOCAL_STORAGE_SEND_DOCUMENTS_KEY = 'LibrasTech_SendDocuments';


// Deprecated keys for migration
const OLD_LOCAL_STORAGE_TRUSTED_CONTACT_NAME_KEY = 'LibrasTech_TrustedContactName';
const OLD_LOCAL_STORAGE_TRUSTED_CONTACT_PHONE_KEY = 'LibrasTech_TrustedContactPhone';

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState<AppStep>('welcome');
  const [userName, setUserName] = useState<string>('');
  const [gender, setGender] = useState<string | undefined>(undefined);
  const [dateOfBirth, setDateOfBirth] = useState<string>(''); 
  const [userPhoneNumber, setUserPhoneNumber] = useState<string>('');
  const [documentType, setDocumentType] = useState<string | undefined>(undefined);
  const [documentNumber, setDocumentNumber] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [trustedContacts, setTrustedContacts] = useState<TrustedContact[]>([]);
  const [bloodType, setBloodType] = useState<string | undefined>(undefined);
  const [sendDocumentsConfirmed, setSendDocumentsConfirmed] = useState<boolean>(true);

  const [emergencyType, setEmergencyType] = useState<string>('');
  const [emergencyColor, setEmergencyColor] = useState<string>('');
  const [subEmergencyType, setSubEmergencyType] = useState<string>('');
  const [location, setLocation] = useState<string>('Obtendo localização...');
  const [coordinates, setCoordinates] = useState<{latitude: number; longitude: number} | null>(null);
  const [sosMessage, setSosMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isSettingsDialogVisible, setIsSettingsDialogVisible] = useState(false);
  const [showPhoneNumberPrompt, setShowPhoneNumberPrompt] = useState(false);


  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);

    const storedName = localStorage.getItem(LOCAL_STORAGE_USER_NAME_KEY);
    if (storedName) {
      setUserName(storedName);
      // Only proceed if the user is already set up
      setCurrentStep('emergency');
    }

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

    const storedBloodType = localStorage.getItem(LOCAL_STORAGE_BLOOD_TYPE_KEY);
    if (storedBloodType) setBloodType(storedBloodType);

    const storedSendDocuments = localStorage.getItem(LOCAL_STORAGE_SEND_DOCUMENTS_KEY);
    if (storedSendDocuments) {
        setSendDocumentsConfirmed(JSON.parse(storedSendDocuments));
    }
    
    // Handle trusted contacts (new array format with migration from old format)
    const storedContacts = localStorage.getItem(LOCAL_STORAGE_TRUSTED_CONTACTS_KEY);
    if (storedContacts) {
      setTrustedContacts(JSON.parse(storedContacts));
    } else {
      const oldName = localStorage.getItem(OLD_LOCAL_STORAGE_TRUSTED_CONTACT_NAME_KEY);
      const oldPhone = localStorage.getItem(OLD_LOCAL_STORAGE_TRUSTED_CONTACT_PHONE_KEY);
      if (oldName && oldPhone) {
        const migratedContact = { name: oldName, phone: oldPhone };
        setTrustedContacts([migratedContact]);
        localStorage.setItem(LOCAL_STORAGE_TRUSTED_CONTACTS_KEY, JSON.stringify([migratedContact]));
        localStorage.removeItem(OLD_LOCAL_STORAGE_TRUSTED_CONTACT_NAME_KEY);
        localStorage.removeItem(OLD_LOCAL_STORAGE_TRUSTED_CONTACT_PHONE_KEY);
      }
    }
     
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          setCoordinates({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          try {
            const result = await reverseGeocode({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            setLocation(result.address);
          } catch (error) {
            console.error("Erro na geocodificação reversa:", error);
            setLocation(`Lat: ${position.coords.latitude}, Lon: ${position.coords.longitude}`);
          }
        },
        (error) => {
          console.error("Erro na geolocalização:", error);
          setLocation('Não foi possível obter a localização. Verifique as permissões.');
        }
      );
    } else {
      setLocation('Geolocalização não suportada neste navegador');
    }
  }, []);

  const handleSaveName = (
    newName: string, 
    newGender?: string, 
    newDocType?: string, 
    newDocNumber?: string, 
    newCity?: string,
    newDob?: Date,
    newBloodType?: string,
    newSendDocuments?: boolean
  ) => {
    localStorage.setItem(LOCAL_STORAGE_USER_NAME_KEY, newName);
    setUserName(newName);

    if (newGender) {
        localStorage.setItem(LOCAL_STORAGE_GENDER_KEY, newGender);
        setGender(newGender);
    } else {
        localStorage.removeItem(LOCAL_STORAGE_GENDER_KEY);
        setGender(undefined);
    }
    
    if (newDocType) {
        localStorage.setItem(LOCAL_STORAGE_DOCUMENT_TYPE_KEY, newDocType);
        setDocumentType(newDocType);
    } else {
        localStorage.removeItem(LOCAL_STORAGE_DOCUMENT_TYPE_KEY);
        setDocumentType(undefined);
    }

    if (newDocNumber) {
        localStorage.setItem(LOCAL_STORAGE_DOCUMENT_NUMBER_KEY, newDocNumber);
        setDocumentNumber(newDocNumber);
    } else {
        localStorage.removeItem(LOCAL_STORAGE_DOCUMENT_NUMBER_KEY);
        setDocumentNumber('');
    }
    
    if (newCity) {
        localStorage.setItem(LOCAL_STORAGE_CITY_KEY, newCity);
        setCity(newCity);
    } else {
        localStorage.removeItem(LOCAL_STORAGE_CITY_KEY);
        setCity('');
    }

    if (newDob) {
        const formattedDob = newDob.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
        localStorage.setItem(LOCAL_STORAGE_DATE_OF_BIRTH_KEY, formattedDob);
        setDateOfBirth(formattedDob);
    } else {
        localStorage.removeItem(LOCAL_STORAGE_DATE_OF_BIRTH_KEY);
        setDateOfBirth('');
    }

    if (newBloodType) {
        localStorage.setItem(LOCAL_STORAGE_BLOOD_TYPE_KEY, newBloodType);
        setBloodType(newBloodType);
    } else {
        localStorage.removeItem(LOCAL_STORAGE_BLOOD_TYPE_KEY);
        setBloodType(undefined);
    }

    localStorage.setItem(LOCAL_STORAGE_SEND_DOCUMENTS_KEY, JSON.stringify(newSendDocuments));
    setSendDocumentsConfirmed(newSendDocuments ?? true);

    setCurrentStep('emergency');
  };

  const handleSelectEmergency = (type: string, colorClass: string) => {
    setEmergencyType(type);
    setEmergencyColor(colorClass);
    setCurrentStep('sub-emergency');
  };

  const handleSelectSubEmergency = (subType: string) => {
    setSubEmergencyType(subType);
    setCurrentStep('sos');
    setSosMessage(null); // Clear previous message
  };

  const handleGenerateSos = async () => {
    if (!userName || !location || !emergencyType || !subEmergencyType) {
      toast({
        title: "Dados Incompletos",
        description: "Por favor, preencha todas as informações antes de gerar a mensagem.",
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
        latitude: coordinates?.latitude,
        longitude: coordinates?.longitude,
        emergencyType,
        subEmergencyType,
        gender: gender,
        dateOfBirth: dateOfBirth,
        userPhoneNumber: userPhoneNumber,
        documentType: documentType,
        documentNumber: documentNumber,
        city: city,
        bloodType: bloodType,
        sendDocumentsConfirmed: sendDocumentsConfirmed,
      };
      const result = await generateSosMessage(input);
      setSosMessage(result.sosMessage);
    } catch (error) {
      console.error('Erro ao gerar mensagem SOS:', error);
      setSosMessage('Erro: Não foi possível gerar a mensagem. Tente novamente.');
      toast({
        title: "Erro de Geração",
        description: "Ocorreu um erro ao tentar gerar a mensagem de SOS.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep === 'sos') {
      setCurrentStep('sub-emergency');
    } else if (currentStep === 'sub-emergency') {
      setCurrentStep('emergency');
    }
  };
  
  const handleSavePhoneNumber = (phoneNumber: string) => {
    if (phoneNumber) {
      localStorage.setItem(LOCAL_STORAGE_PHONE_NUMBER_KEY, phoneNumber);
      setUserPhoneNumber(phoneNumber);
      toast({ title: "Sucesso!", description: "Seu número de telefone foi salvo." });
    } else {
      localStorage.removeItem(LOCAL_STORAGE_PHONE_NUMBER_KEY);
      setUserPhoneNumber('');
      toast({ title: "Telefone Removido", description: "Seu número foi removido com sucesso." });
    }
  };

  const handleSaveTrustedContacts = (contacts: TrustedContact[]) => {
    const filteredContacts = contacts.filter(c => c.name.trim() !== '' && c.phone.trim() !== '');
    localStorage.setItem(LOCAL_STORAGE_TRUSTED_CONTACTS_KEY, JSON.stringify(filteredContacts));
    setTrustedContacts(filteredContacts);
    toast({
      title: "Contatos Salvos!",
      description: "Sua lista de contatos de confiança foi atualizada.",
    });
  };

  const handleSendToEmergency = (message: string) => {
    const targetPhoneNumber = "554399054151";
    const whatsappUrl = `https://wa.me/${targetPhoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    toast({
        title: "Enviando para o WhatsApp",
        description: `Abrindo conversa para enviar a mensagem.`,
    });
  };
  
  const handleSendToTrustedContact = (phone: string, message: string) => {
    const targetPhoneNumber = "554399054151";
    const whatsappUrl = `https://wa.me/${targetPhoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };
  
  const handleEditProfile = () => {
    setIsSettingsDialogVisible(false);
    setCurrentStep('welcome');
  };

  const renderStep = () => {
    if (!isMounted) return null;

    switch (currentStep) {
      case 'welcome':
        return (
          <WelcomeScreen
            onNameSave={handleSaveName}
            initialName={userName}
            initialGender={gender}
            initialDocumentType={documentType}
            initialDocumentNumber={documentNumber}
            initialCity={city}
            initialDateOfBirth={dateOfBirth}
            initialBloodType={bloodType}
            initialSendDocuments={sendDocumentsConfirmed}
          />
        );
      case 'emergency':
        return <EmergencySelectionScreen onSelectEmergency={handleSelectEmergency} />;
      case 'sub-emergency':
        return (
          <SubEmergencySelectionScreen
            emergencyType={emergencyType}
            onSelectSubEmergency={handleSelectSubEmergency}
            colorClass={emergencyColor}
          />
        );
      case 'sos':
        return (
          <SosMessageScreen
            userName={userName}
            location={location}
            emergencyType={emergencyType}
            subEmergencyType={subEmergencyType}
            gender={gender}
            documentType={documentType}
            documentNumber={documentNumber}
            city={city}
            dateOfBirth={dateOfBirth}
            bloodType={bloodType}
            sendDocumentsConfirmed={sendDocumentsConfirmed}
            sosMessage={sosMessage}
            onGenerateSos={handleGenerateSos}
            isLoading={isLoading}
            onSendToEmergency={handleSendToEmergency}
            onSendToTrustedContact={handleSendToTrustedContact}
            trustedContacts={trustedContacts}
          />
        );
      default:
        return <WelcomeScreen onNameSave={handleSaveName} />;
    }
  };
  
  const handlePhoneNumberSave = (number: string) => {
      handleSavePhoneNumber(number);
      setShowPhoneNumberPrompt(false);
  }

  return (
    <>
      <AppLayout
        title={currentStep === 'welcome' ? 'Bem-Vindo(a)' : 'LibrasTech'}
        showBack={currentStep === 'sos' || currentStep === 'sub-emergency'}
        onBack={handleBack}
        onConfig={() => setIsSettingsDialogVisible(true)}
      >
        {renderStep()}
      </AppLayout>
      <SettingsDialog 
        isOpen={isSettingsDialogVisible}
        onClose={() => setIsSettingsDialogVisible(false)}
        onSavePhoneNumber={handleSavePhoneNumber}
        currentPhoneNumber={userPhoneNumber}
        currentTrustedContacts={trustedContacts}
        onSaveTrustedContacts={handleSaveTrustedContacts}
        onEditProfile={handleEditProfile}
      />
      
      <AlertDialog open={showPhoneNumberPrompt} onOpenChange={setShowPhoneNumberPrompt}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Adicionar seu telefone?</AlertDialogTitle>
                  <AlertDialogDescription>
                      Vimos que você não tem um número de telefone salvo. Adicioná-lo agora pode agilizar o envio de mensagens de emergência. Você pode fazer isso mais tarde nas configurações.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel>Agora não</AlertDialogCancel>
                  <AlertDialogAction onClick={() => {
                      setShowPhoneNumberPrompt(false);
                      setIsSettingsDialogVisible(true);
                  }}>
                      Adicionar
                  </AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

    
    

    