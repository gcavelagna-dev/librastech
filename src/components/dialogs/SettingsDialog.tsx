
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
import { Smartphone, Send, CheckCircle } from 'lucide-react';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePhoneNumber: (phoneNumber: string) => void;
  currentPhoneNumber: string;
}

export function SettingsDialog({ isOpen, onClose, onSavePhoneNumber, currentPhoneNumber }: SettingsDialogProps) {
  const [phoneNumber, setPhoneNumber] = useState(currentPhoneNumber);
  const [smsCode, setSmsCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setPhoneNumber(currentPhoneNumber);
    setIsVerified(!!currentPhoneNumber); // If there's a current number, assume it's verified
    setIsCodeSent(false); // Reset code sent state when current number changes
    setSmsCode(''); // Reset code input
  }, [currentPhoneNumber, isOpen]);
  
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Basic phone number formatting (you might want a more robust library for this)
    let input = e.target.value.replace(/\D/g, '');
    if (input.length > 11) input = input.substring(0, 11); // Max 11 digits for BR mobile

    if (input.length > 2) {
      input = `(${input.substring(0, 2)}) ${input.substring(2)}`;
    }
    if (input.length > 9) {
      input = `${input.substring(0, 9)}-${input.substring(9)}`;
    }
    setPhoneNumber(input);
    setIsVerified(false); // New number, needs new verification
    setIsCodeSent(false);
  };

  const handleSendSmsCode = async () => {
    const rawPhoneNumber = phoneNumber.replace(/\D/g, '');
    if (rawPhoneNumber.length < 10) { // Basic validation for BR phone numbers (DDD + 8 or 9 digits)
      toast({
        title: "Número Inválido",
        description: "Por favor, insira um número de telefone válido com DDD.",
        variant: "destructive",
      });
      return;
    }
    
    // --- SIMULATION OF SENDING SMS ---
    setIsVerifying(true); 
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
    
    console.log(`Simulando envio de SMS para: ${phoneNumber}. Código: 123456`);
    toast({
      title: "Código Enviado (Simulação)",
      description: `Um código de verificação foi enviado para ${phoneNumber}. (Use 123456 para testar)`,
    });
    setIsCodeSent(true);
    setIsVerifying(false);
    // --- END SIMULATION ---
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

    // --- SIMULATION OF VERIFYING SMS ---
    setIsVerifying(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call

    if (smsCode === "123456") { // Example verification code
      onSavePhoneNumber(phoneNumber);
      setIsVerified(true);
      toast({
        title: "Número Verificado!",
        description: "Seu número de telefone foi verificado e salvo.",
        variant: "default", // Changed from success as it's not a standard variant
      });
      onClose(); // Close dialog on successful verification
    } else {
      toast({
        title: "Código Inválido",
        description: "O código de verificação está incorreto. Tente novamente.",
        variant: "destructive",
      });
      setIsVerified(false);
    }
    setIsVerifying(false);
    // --- END SIMULATION ---
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Smartphone className="w-5 h-5 mr-2" /> Configurar Número de Telefone
          </DialogTitle>
          <DialogDescription>
            Confirme seu número para agilizar o envio de mensagens SOS via WhatsApp ou SMS pelo celular (requer app LibrasTech no celular).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {isVerified && currentPhoneNumber && (
             <div className="p-3 bg-green-100 border border-green-300 rounded-md text-sm text-green-700 flex items-center">
               <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
               <span>Número verificado: {currentPhoneNumber}</span>
             </div>
          )}

          <div className="space-y-1">
            <Label htmlFor="phoneNumber">Número de Telefone (com DDD)</Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="(XX) XXXXX-XXXX"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              disabled={isCodeSent || isVerifying || isVerified}
            />
          </div>

          {!isCodeSent && !isVerified && (
            <Button onClick={handleSendSmsCode} className="w-full" disabled={isVerifying || phoneNumber.replace(/\D/g, '').length < 10}>
              {isVerifying ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" /> : <Send className="w-4 h-4 mr-2" />}
              Enviar Código de Verificação
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
              <Button onClick={handleVerifySmsCode} className="w-full" disabled={isVerifying || smsCode.length === 0}>
                {isVerifying ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                Verificar Código
              </Button>
               <Button variant="link" size="sm" onClick={() => { setIsCodeSent(false); setSmsCode(''); }} disabled={isVerifying}>
                Alterar número ou reenviar código
              </Button>
            </>
          )}
        </div>

        <DialogFooter className="sm:justify-start">
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
