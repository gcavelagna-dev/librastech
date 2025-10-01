
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

type TrustedContact = { name: string; phone: string };

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePhoneNumber: (phoneNumber: string) => void;
  currentPhoneNumber: string;
  currentTrustedContacts: TrustedContact[];
  onSaveTrustedContacts: (contacts: TrustedContact[]) => void;
  onEditProfile: () => void;
}

export function SettingsDialog({
  isOpen,
  onClose,
  onSavePhoneNumber,
  currentPhoneNumber,
  currentTrustedContacts,
  onSaveTrustedContacts,
  onEditProfile,
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

  const handleSave = () => {
    // Validate phone number
    const rawPhoneNumber = phoneNumber.replace(/\D/g, '');
    if (rawPhoneNumber.length > 0 && rawPhoneNumber.length < 10) {
      toast({
        title: "Número Inválido",
        description: "Para salvar, insira um número de telefone válido com DDD ou deixe o campo em branco para removê-lo.",
        variant: "destructive",
      });
      return;
    }

    // Validate trusted contacts
    const validContacts = contacts.filter(c => c.name.trim() !== '' || c.phone.trim() !== '');
    for (const contact of validContacts) {
      if (!contact.name.trim() || !contact.phone.trim()) {
        toast({ title: "Dados de Contato Incompletos", description: `Para o contato ${contact.name || 'desconhecido'}, preencha nome e telefone.`, variant: "destructive"});
        return;
      }
      const rawPhone = contact.phone.replace(/\D/g, '');
      if (rawPhone.length < 10) {
        toast({ title: "Número do Contato Inválido", description: `O número para "${contact.name}" parece inválido. Inclua o DDD.`, variant: "destructive" });
        return;
      }
    }
    
    onSavePhoneNumber(phoneNumber);
    onSaveTrustedContacts(validContacts);

    toast({
      title: "Salvo com sucesso!",
      description: "Suas informações foram atualizadas.",
    });
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Configurações</DialogTitle>
          <DialogDescription>
            Gerencie seu número de telefone e contatos de confiança.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
            
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center"><UserCog className="w-5 h-5 mr-2" /> Meu Perfil</h3>
            <p className="text-sm text-muted-foreground">
                Para alterar seu nome, data de nascimento ou outras informações pessoais, clique abaixo.
            </p>
            <Button onClick={onEditProfile} variant="outline" className="w-full">
                Editar Minhas Informações
            </Button>
          </div>
            
          <Separator />
            
          <div className="space-y-4">
             <h3 className="font-semibold flex items-center"><Smartphone className="w-5 h-5 mr-2" /> Meu Telefone</h3>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Seu Telefone (com DDD)</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="(XX) XXXXX-XXXX"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
              />
            </div>
          </div>
          
          <Separator />

          <div className="space-y-4">
            <h3 className="font-semibold">Contatos de Confiança</h3>
            {contacts.map((contact, index) => (
              <div key={index} className="space-y-3 p-3 border rounded-md">
                <p className="text-sm font-medium text-muted-foreground">Contato {index + 1}</p>
                <div className="space-y-2">
                  <Label htmlFor={`trustedName-${index}`}>Nome do Contato</Label>
                  <Input
                    id={`trustedName-${index}`}
                    type="text"
                    placeholder="Nome completo"
                    value={contact.name}
                    onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
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
        </div>
        <DialogFooter className="sm:justify-between">
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSave}>
            <CheckCircle className="w-4 h-4 mr-2" /> Salvar Tudo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
