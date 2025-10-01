
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
import { Smartphone, UserCog, CheckCircle, Settings, Users, CalendarIcon, Ear, ShieldCheck } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { UserProfile } from '@/lib/types';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


type TrustedContact = { name: string; phone: string };

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePhoneNumber: (phoneNumber: string) => void;
  currentPhoneNumber: string;
  currentTrustedContacts: TrustedContact[];
  onSaveTrustedContacts: (contacts: TrustedContact[]) => void;
  onSaveProfile: (profile: UserProfile) => void;
  currentUserProfile: UserProfile;
}

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export function SettingsDialog({
  isOpen,
  onClose,
  onSavePhoneNumber,
  currentPhoneNumber,
  currentTrustedContacts,
  onSaveTrustedContacts,
  onSaveProfile,
  currentUserProfile,
}: SettingsDialogProps) {
  const [phoneNumber, setPhoneNumber] = useState(currentPhoneNumber);
  const [contacts, setContacts] = useState<TrustedContact[]>([]);
  const { toast } = useToast();

  // Profile State
  const [name, setName] = useState('');
  const [gender, setGender] = useState<string | undefined>();
  const [documentType, setDocumentType] = useState<string | undefined>();
  const [documentNumber, setDocumentNumber] = useState('');
  const [city, setCity] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>();
  const [bloodType, setBloodType] = useState<string | undefined>();
  const [sendDocuments, setSendDocuments] = useState(true);
  const [isDeaf, setIsDeaf] = useState(false);


  useEffect(() => {
    if (isOpen) {
      // Phone Number
      setPhoneNumber(currentPhoneNumber);

      // Trusted Contacts
      const paddedContacts = [...currentTrustedContacts];
      while (paddedContacts.length < 5) {
        paddedContacts.push({ name: '', phone: '' });
      }
      setContacts(paddedContacts);

      // User Profile
      setName(currentUserProfile.name || '');
      setGender(currentUserProfile.gender);
      setDocumentType(currentUserProfile.documentType);
      setDocumentNumber(currentUserProfile.documentNumber || '');
      setCity(currentUserProfile.city || '');
      if (currentUserProfile.dateOfBirth && typeof currentUserProfile.dateOfBirth === 'string') {
        const [day, month, year] = currentUserProfile.dateOfBirth.split('/');
        if(day && month && year) {
            setDateOfBirth(new Date(parseInt(year), parseInt(month) - 1, parseInt(day)));
        }
      } else if (currentUserProfile.dateOfBirth instanceof Date) {
        setDateOfBirth(currentUserProfile.dateOfBirth);
      } else {
        setDateOfBirth(undefined);
      }
      setBloodType(currentUserProfile.bloodType);
      setSendDocuments(currentUserProfile.sendDocuments ?? true);
      setIsDeaf(currentUserProfile.isDeaf ?? false);
    }
  }, [currentUserProfile, currentPhoneNumber, currentTrustedContacts, isOpen]);

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
  
  const handleProfileSave = () => {
    if (!name.trim() || !gender || !dateOfBirth) {
        toast({
            title: "Campos Obrigatórios",
            description: "Nome, Sexo e Data de Nascimento são obrigatórios.",
            variant: "destructive"
        });
        return;
    }
    onSaveProfile({
      name: name.trim(),
      gender,
      documentType,
      documentNumber: documentNumber.trim(),
      city: city.trim(),
      dateOfBirth,
      bloodType,
      sendDocuments,
      isDeaf
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2" /> Configurações
          </DialogTitle>
          <DialogDescription>Gerencie seus dados, telefone e contatos de confiança.</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-4 -mr-4 custom-scrollbar">
          <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-base font-semibold">
                <div className="flex items-center"><UserCog className="w-5 h-5 mr-2" /> Meus Dados</div>
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="profile-name">Nome Completo</Label>
                    <Input id="profile-name" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Sexo</Label>
                      <RadioGroup onValueChange={setGender} value={gender} className="flex space-x-4 pt-2">
                        <div className="flex items-center space-x-2"><RadioGroupItem value="Feminino" id="set-feminino" /><Label htmlFor="set-feminino">Feminino</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="Masculino" id="set-masculino" /><Label htmlFor="set-masculino">Masculino</Label></div>
                      </RadioGroup>
                    </div>
                     <div className="space-y-2">
                        <Label>Data de Nascimento</Label>
                        <Popover>
                        <PopoverTrigger asChild>
                            <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !dateOfBirth && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateOfBirth ? format(dateOfBirth, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={dateOfBirth} onSelect={setDateOfBirth} initialFocus locale={ptBR} captionLayout="dropdown-buttons" fromYear={1900} toYear={new Date().getFullYear()} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} /></PopoverContent>
                        </Popover>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Tipo de Documento</Label>
                        <RadioGroup onValueChange={setDocumentType} value={documentType} className="flex space-x-4 pt-2">
                        <div className="flex items-center space-x-2"><RadioGroupItem value="RG" id="set-rg" /><Label htmlFor="set-rg">RG</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="CPF" id="set-cpf" /><Label htmlFor="set-cpf">CPF</Label></div>
                        </RadioGroup>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="profile-doc-number">Número do Documento</Label>
                        <Input id="profile-doc-number" value={documentNumber} onChange={(e) => setDocumentNumber(e.target.value)} disabled={!documentType} />
                    </div>
                  </div>
                  
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="profile-city">Cidade</Label>
                        <Input id="profile-city" value={city} onChange={(e) => setCity(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="profile-blood">Tipo Sanguíneo</Label>
                        <Select onValueChange={setBloodType} value={bloodType}>
                            <SelectTrigger id="profile-blood"><SelectValue placeholder="Selecione" /></SelectTrigger>
                            <SelectContent>{bloodTypes.map(type => (<SelectItem key={type} value={type}>{type}</SelectItem>))}</SelectContent>
                        </Select>
                      </div>
                   </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                        <div className='flex items-center'>
                            <ShieldCheck className="w-5 h-5 mr-3 text-primary" />
                            <div>
                                <Label htmlFor="set-send-documents" className="font-semibold">Enviar documento no SOS?</Label>
                            </div>
                        </div>
                        <Switch id="set-send-documents" checked={sendDocuments} onCheckedChange={setSendDocuments} disabled={!documentType || !documentNumber} />
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                        <div className='flex items-center'>
                            <Ear className="w-5 h-5 mr-3 text-primary" />
                            <div>
                                <Label htmlFor="set-is-deaf" className="font-semibold">Você é uma pessoa surda?</Label>
                            </div>
                        </div>
                        <Switch id="set-is-deaf" checked={isDeaf} onCheckedChange={setIsDeaf} />
                    </div>
                   <Button onClick={handleProfileSave} className="w-full">
                     <CheckCircle className="w-4 h-4 mr-2" /> Salvar Perfil
                   </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-base font-semibold">
                <div className="flex items-center"><Smartphone className="w-5 h-5 mr-2" /> Número de Telefone</div>
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                 <DialogDescription className="text-sm text-muted-foreground mb-3">
                    Adicione seu número para incluí-lo automaticamente nas mensagens de emergência.
                </DialogDescription>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="phoneNumber">Seu Telefone (com DDD)</Label>
                    <Input id="phoneNumber" type="tel" placeholder="(XX) XXXXX-XXXX" value={phoneNumber} onChange={handlePhoneNumberChange} />
                  </div>
                  <Button onClick={handleSavePhone} className="w-full">
                    <CheckCircle className="w-4 h-4 mr-2" /> Salvar Número
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-base font-semibold">
                <div className="flex items-center"><Users className="w-5 h-5 mr-2" /> Contatos de Confiança</div>
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                 <DialogDescription className="text-sm text-muted-foreground mb-3">
                    Adicione até 5 pessoas para serem notificadas em caso de emergência.
                </DialogDescription>
                 <div className="space-y-4">
                    {contacts.map((contact, index) => (
                    <div key={index} className="p-3 border rounded-lg space-y-2 bg-muted/50">
                        <h4 className="text-sm font-semibold text-muted-foreground">Contato {index + 1}</h4>
                        <div className="space-y-1">
                            <Label htmlFor={`trustedName-${index}`}>Nome do Contato</Label>
                            <Input id={`trustedName-${index}`} type="text" placeholder="Nome completo" value={contact.name} onChange={(e) => handleContactChange(index, 'name', e.target.value)} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor={`trustedPhone-${index}`}>Telefone (com DDD)</Label>
                            <Input id={`trustedPhone-${index}`} type="tel" placeholder="(XX) XXXXX-XXXX" value={contact.phone} onChange={(e) => handleTrustedPhoneInputChange(index, e)} />
                        </div>
                    </div>
                    ))}
                    <Button onClick={handleSaveTrustedInfo} className="w-full" variant="secondary">
                        <CheckCircle className="w-4 h-4 mr-2" /> Salvar Contatos de Confiança
                    </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>


        <DialogFooter className="sm:justify-start mt-4 pt-4 border-t">
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
