
"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { Smartphone, Send, CheckCircle, UserCog, Phone, XCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePhoneNumber: (phoneNumber: string) => void;
  currentPhoneNumber: string;
  currentTrustedContactName: string;
  currentTrustedContactPhoneNumber: string;
  onSaveTrustedContact: (name: string, phone: string) => void;
}

export function SettingsDialog({ 
  isOpen, 
  onClose, 
  onSavePhoneNumber, 
  currentPhoneNumber,
  currentTrustedContactName,
  currentTrustedContactPhoneNumber,
  onSaveTrustedContact
}: SettingsDialogProps) {
  const [phoneNumber, setPhoneNumber] = useState(currentPhoneNumber);
  const [smsCode, setSmsCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const [trustedName, setTrustedName] = useState(currentTrustedContactName);
  const [trustedPhone, setTrustedPhone] = useState(currentTrustedContactPhoneNumber);

  const { toast } = useToast();

  useEffect(() => {
    // Reset state when dialog opens or currentPhoneNumber changes externally
    if (isOpen) {
      setPhoneNumber(currentPhoneNumber);
      setIsVerified(!!currentPhoneNumber); 
      setIsCodeSent(false); 
      setSmsCode(''); 

      setTrustedName(currentTrustedContactName);
      setTrustedPhone(currentTrustedContactPhoneNumber);
    }
  }, [currentPhoneNumber, currentTrustedContactName, currentTrustedContactPhoneNumber, isOpen]);
  
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, '');
    if (input.length > 11) input = input.substring(0, 11); 

    if (input.length > 2) {
      input = `(${input.substring(0, 2)}) ${input.substring(2)}`;
    }
    if (input.length > 9) {
      input = `${input.substring(0, 9)}-${input.substring(9)}`;
    }
    setPhoneNumber(input);
    setIsVerified(false); 
    setIsCodeSent(false);
  };

  const handleTrustedPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, '');
    if (input.length > 11) input = input.substring(0, 11);

    if (input.length > 2) {
      input = `(${input.substring(0, 2)}) ${input.substring(2)}`;
    }
    if (input.length > 9) {
      input = `${input.substring(0, 9)}-${input.substring(9)}`;
    }
    setTrustedPhone(input);
  };

  const handleSendSmsCode = async () => {
    const rawPhoneNumber = phoneNumber.replace(/\D/g, '');
    if (rawPhoneNumber.length < 10) { 
      toast({
        title: "Número Inválido",
        description: "Por favor, insira um número de telefone válido com DDD.",
        variant: "destructive",
      });
      return;
    }
    
    setIsVerifying(true); 
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    
    console.log(`Simulando envio de SMS para: ${phoneNumber}. Código: 123456`);
    toast({
      title: "Código Enviado (Simulação)",
      description: `Um código de verificação foi enviado para ${phoneNumber}. (Use 123456 para testar)`,
    });
    setIsCodeSent(true);
    setIsVerifying(false);
  };

  const handleVerifySmsCode = async () => {
    if (smsCode.trim() === '') {
       toast({
        title: "Código Necessário",
        description: "Por favor, insira o código de verificação.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); 

    if (smsCode === "123456") { 
      onSavePhoneNumber(phoneNumber); // This will update currentPhoneNumber via prop
      setIsVerified(true);
      setIsCodeSent(false); // Code has been used
      setSmsCode('');
      toast({
        title: "Número Verificado!",
        description: "Seu número de telefone foi verificado e salvo.",
        variant: "default", 
      });
    } else {
      toast({
        title: "Código Inválido",
        description: "O código de verificação está incorreto. Tente novamente.",
        variant: "destructive",
      });
      setIsVerified(false);
    }
    setIsVerifying(false);
  };
  
  const handleCancelVerification = () => {
    setPhoneNumber(currentPhoneNumber); // Reset to the last saved/verified number
    setIsCodeSent(false);
    setSmsCode('');
    setIsVerified(!!currentPhoneNumber); // Re-evaluate verified status based on currentPhoneNumber
    toast({
      title: "Verificação Cancelada",
      description: "A tentativa de verificação do novo número foi cancelada.",
    });
  };

  const handleSaveTrustedInfo = () => {
    if (!trustedName.trim() && !trustedPhone.trim()) {
      toast({
        title: "Dados Incompletos",
        description: "Preencha o nome ou telefone do contato de confiança para salvar.",
        variant: "destructive",
      });
      return;
    }
    onSaveTrustedContact(trustedName, trustedPhone);
    // Toast for this is handled in page.tsx
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Smartphone className="w-5 h-5 mr-2" /> Configurações
          </DialogTitle>
        </DialogHeader>

        {/* User Phone Number Section */}
        <div className="space-y-4 py-2">
          <DialogDescription>
            Confirme seu número para agilizar o envio de mensagens SOS via WhatsApp ou SMS pelo celular (requer app LibrasTech no celular).
          </DialogDescription>
          {isVerified && currentPhoneNumber && ( // Show verified status only if it matches the currentPhoneNumber in props
             <div className="p-3 bg-green-100 border border-green-300 rounded-md text-sm text-green-700 flex items-center">
               <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
               <span>Seu número verificado: {phoneNumber}</span>
             </div>
          )}

          <div className="space-y-1">
            <Label htmlFor="phoneNumber">Seu Número de Telefone (com DDD)</Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="(XX) XXXXX-XXXX"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              disabled={isCodeSent || isVerifying || (isVerified && phoneNumber === currentPhoneNumber) } 
            />
          </div>

          {!isCodeSent && !isVerified && (
            <Button onClick={handleSendSmsCode} className="w-full" disabled={isVerifying || phoneNumber.replace(/\D/g, '').length < 10 || phoneNumber === currentPhoneNumber}>
              {isVerifying ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" /> : <Send className="w-4 h-4 mr-2" />}
              {currentPhoneNumber && currentPhoneNumber === phoneNumber ? 'Número já verificado' : 'Enviar Código de Verificação'}
            </Button>
          )}
          
          {isCodeSent && !isVerified && (
            <>
              <div className="space-y-1">
                <Label htmlFor="smsCode">Código de Verificação</Label>
                <Input
                  id="smsCode"
                  type="text"
                  placeholder="Digite o código recebido"
                  value={smsCode}
                  onChange={(e) => setSmsCode(e.target.value)}
                  disabled={isVerifying}
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleVerifySmsCode} className="flex-1" disabled={isVerifying || smsCode.length === 0}>
                  {isVerifying ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                  Verificar Código
                </Button>
                <Button variant="outline" onClick={handleCancelVerification} disabled={isVerifying} className="flex-1">
                  <XCircle className="w-4 h-4 mr-2" />
                  Cancelar Verificação
                </Button>
              </div>
            </>
          )}
        </div>

        <Separator className="my-4" />

        {/* Trusted Contact Section */}
        <div className="space-y-4 py-2">
          <DialogHeader> {/* Re-using DialogHeader for section title styling */}
            <DialogTitle className="flex items-center text-base">
              <UserCog className="w-5 h-5 mr-2" /> Contato de Confiança
            </DialogTitle>
            <DialogDescription>
              Adicione uma pessoa para ser notificada em caso de emergência (opcional).
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-1">
            <Label htmlFor="trustedName">Nome do Contato de Confiança</Label>
            <Input
              id="trustedName"
              type="text"
              placeholder="Nome completo do contato"
              value={trustedName}
              onChange={(e) => setTrustedName(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="trustedPhone">Telefone do Contato de Confiança (com DDD)</Label>
            <Input
              id="trustedPhone"
              type="tel"
              placeholder="(XX) XXXXX-XXXX"
              value={trustedPhone}
              onChange={handleTrustedPhoneChange}
            />
          </div>
          <Button onClick={handleSaveTrustedInfo} className="w-full" variant="secondary">
            <CheckCircle className="w-4 h-4 mr-2" />
            Salvar Contato de Confiança
          </Button>
        </div>


        <DialogFooter className="sm:justify-start mt-6">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Fechar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

