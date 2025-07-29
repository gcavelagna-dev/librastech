
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
import { Smartphone, UserCog, CheckCircle, Settings, Moon, Sun, Edit } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

type Theme = 'light' | 'dark';
type TrustedContact = { name: string; phone: string };

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePhoneNumber: (phoneNumber: string) => void;
  currentPhoneNumber: string;
  currentTrustedContacts: TrustedContact[];
  onSaveTrustedContacts: (contacts: TrustedContact[]) => void;
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  onEditProfile: () => void;
}

export function SettingsDialog({ 
  isOpen, 
  onClose, 
  onSavePhoneNumber, 
  currentPhoneNumber,
  currentTrustedContacts,
  onSaveTrustedContacts,
  currentTheme,
  onThemeChange,
  onEditProfile
}: SettingsDialogProps) {
  const [phoneNumber, setPhoneNumber] = useState(currentPhoneNumber);
  const [contacts, setContacts] = useState<TrustedContact[]>([]);

  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setPhoneNumber(currentPhoneNumber);
      const paddedContacts = [...currentTrustedContacts];
      while (paddedContacts.length < 5) {
        paddedContacts.push({ name: '', phone: '' });
      }
      setContacts(paddedContacts);
    }
  }, [currentPhoneNumber, currentTrustedContacts, isOpen]);
  
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

  const handleContactChange = (index: number, field: 'name' | 'phone', value: string) => {
    const newContacts = [...contacts];
    newContacts[index] = { ...newContacts[index], [field]: value };
    setContacts(newContacts);
  };

  const handleTrustedPhoneInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, '');
    if (input.length > 11) input = input.substring(0, 11);

    if (input.length > 2) {
      input = `(${input.substring(0, 2)}) ${input.substring(2)}`;
    }
    if (input.length > 9) {
      input = `${input.substring(0, 9)}-${input.substring(9)}`;
    }
    handleContactChange(index, 'phone', input);
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
  };
  
  const handleSaveTrustedInfo = () => {
    const validContacts = contacts.filter(c => c.name.trim() !== '' || c.phone.trim() !== '');

    for (const contact of validContacts) {
        if (!contact.name.trim() || !contact.phone.trim()) {
            toast({
                title: "Dados Incompletos",
                description: `Para o contato ${contact.name || 'desconhecido'}, é necessário preencher tanto o nome quanto o telefone.`,
                variant: "destructive"
            });
            return;
        }
        const rawPhone = contact.phone.replace(/\D/g, '');
        if (rawPhone.length < 10) {
           toast({
            title: "Número do Contato Inválido",
            description: `O número para "${contact.name}" parece inválido. Por favor, inclua o DDD.`,
            variant: "destructive",
          });
          return;
        }
    }

    onSaveTrustedContacts(validContacts);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2" /> Configurações
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
            <DialogTitle className="flex items-center text-base font-semibold">
                <UserCog className="w-5 h-5 mr-2" /> Meus Dados
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
                Clique no botão abaixo para editar suas informações pessoais salvas no aplicativo.
            </DialogDescription>
             <Button onClick={onEditProfile} variant="outline" className="w-full">
                <Edit className="w-4 h-4 mr-2" />
                Editar Perfil
            </Button>
        </div>
        
        <Separator className="my-2" />

        <div className="space-y-4 py-2">
            <DialogTitle className="flex items-center text-base font-semibold">
                {currentTheme === 'dark' ? <Moon className="w-5 h-5 mr-2" /> : <Sun className="w-5 h-5 mr-2" />}
                Aparência
            </DialogTitle>
            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <Label htmlFor="dark-mode" className="flex flex-col space-y-1">
                    <span>Modo Noturno</span>
                    <span className="font-normal leading-snug text-muted-foreground">
                        Relaxe seus olhos com um tema mais escuro.
                    </span>
                </Label>
                <Switch
                    id="dark-mode"
                    checked={currentTheme === 'dark'}
                    onCheckedChange={(checked) => onThemeChange(checked ? 'dark' : 'light')}
                    aria-label="Ativar modo noturno"
                />
            </div>
        </div>

        <Separator className="my-2" />

        <div className="space-y-4 py-2">
            <DialogTitle className="flex items-center text-base font-semibold">
              <Smartphone className="w-5 h-5 mr-2" /> Número de Telefone
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Adicione seu número para incluí-lo automaticamente nas mensagens de emergência.
            </DialogDescription>
          
          <div className="space-y-1">
            <Label htmlFor="phoneNumber">Seu Telefone (com DDD)</Label>
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

        <Separator className="my-2" />

        <div className="space-y-4 py-2">
            <DialogTitle className="flex items-center text-base font-semibold">
              <UserCog className="w-5 h-5 mr-2" /> Contatos de Confiança
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Adicione até 5 pessoas para serem notificadas em caso de emergência.
            </DialogDescription>

            <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {contacts.map((contact, index) => (
                <div key={index} className="p-3 border rounded-lg space-y-2 bg-muted/50">
                  <h4 className="text-sm font-semibold text-muted-foreground">Contato {index + 1}</h4>
                   <div className="space-y-1">
                      <Label htmlFor={`trustedName-${index}`}>Nome do Contato</Label>
                      <Input
                        id={`trustedName-${index}`}
                        type="text"
                        placeholder="Nome completo"
                        value={contact.name}
                        onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`trustedPhone-${index}`}>Telefone (com DDD)</Label>
                      <Input
                        id={`trustedPhone-${index}`}
                        type="tel"
                        placeholder="(XX) XXXXX-XXXX"
                        value={contact.phone}
                        onChange={(e) => handleTrustedPhoneInputChange(index, e)}
                      />
                    </div>
                </div>
              ))}
            </div>
          
            <Button onClick={handleSaveTrustedInfo} className="w-full" variant="secondary">
                <CheckCircle className="w-4 h-4 mr-2" />
                Salvar Contatos de Confiança
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
