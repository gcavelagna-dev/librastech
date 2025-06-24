
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
import { Smartphone, UserCog, CheckCircle } from 'lucide-react';
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
  const [trustedName, setTrustedName] = useState(currentTrustedContactName);
  const [trustedPhone, setTrustedPhone] = useState(currentTrustedContactPhoneNumber);

  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setPhoneNumber(currentPhoneNumber);
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

  const handleSavePhone = () => {
    const rawPhoneNumber = phoneNumber.replace(/\D/g, '');
    if (rawPhoneNumber.length > 0 && rawPhoneNumber.length < 10) { 
      toast({
        title: "Número Inválido",
        description: "Para salvar, insira um número de telefone válido com DDD ou deixe o campo em branco para removê-lo.",
        variant: "destructive",
      });
      return;
    }
    onSavePhoneNumber(phoneNumber);
    // A toast de sucesso é exibida pelo componente pai (page.tsx)
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
    // A toast de sucesso é exibida pelo componente pai (page.tsx)
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
            Adicione seu número de telefone para incluí-lo automaticamente nas mensagens de emergência.
          </DialogDescription>
          
          <div className="space-y-1">
            <Label htmlFor="phoneNumber">Seu Número de Telefone (com DDD)</Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="(XX) XXXXX-XXXX"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
            />
          </div>
          <Button onClick={handleSavePhone} className="w-full">
            <CheckCircle className="w-4 h-4 mr-2" />
            Salvar Número
          </Button>
        </div>

        <Separator className="my-4" />

        {/* Trusted Contact Section */}
        <div className="space-y-4 py-2">
          <DialogHeader>
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
