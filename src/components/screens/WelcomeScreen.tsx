
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Lock, Droplet, ShieldCheck, Ear } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { ptBR } from 'date-fns/locale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

interface WelcomeScreenProps {
  onNameSave: (
    name: string,
    gender?: string,
    documentType?: string,
    documentNumber?: string,
    city?: string,
    dateOfBirth?: Date,
    bloodType?: string,
    sendDocuments?: boolean,
    isDeaf?: boolean
  ) => void;
  initialName?: string;
  initialGender?: string;
  initialDocumentType?: string;
  initialDocumentNumber?: string;
  initialCity?: string;
  initialDateOfBirth?: string;
  initialBloodType?: string;
  initialSendDocuments?: boolean;
  initialIsDeaf?: boolean;
}

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export function WelcomeScreen({
  onNameSave,
  initialName = '',
  initialGender,
  initialDocumentType,
  initialDocumentNumber = '',
  initialCity = '',
  initialDateOfBirth,
  initialBloodType,
  initialSendDocuments = true,
  initialIsDeaf = false,
}: WelcomeScreenProps) {
  const [name, setName] = useState(initialName);
  const [gender, setGender] = useState<string | undefined>(initialGender);
  const [documentType, setDocumentType] = useState<string | undefined>(initialDocumentType);
  const [documentNumber, setDocumentNumber] = useState(initialDocumentNumber);
  const [city, setCity] = useState(initialCity);
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>();
  const [bloodType, setBloodType] = useState<string | undefined>(initialBloodType);
  const [sendDocuments, setSendDocuments] = useState<boolean>(initialSendDocuments);
  const [isDeaf, setIsDeaf] = useState<boolean>(initialIsDeaf);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (initialName) setName(initialName);
    if (initialGender) setGender(initialGender);
    if (initialDocumentType) setDocumentType(initialDocumentType);
    if (initialDocumentNumber) setDocumentNumber(initialDocumentNumber);
    if (initialCity) setCity(initialCity);
    if (initialDateOfBirth) {
        const [day, month, year] = initialDateOfBirth.split('/');
        if(day && month && year) {
            setDateOfBirth(new Date(parseInt(year), parseInt(month) - 1, parseInt(day)));
        }
    }
    if (initialBloodType) setBloodType(initialBloodType);
    setSendDocuments(initialSendDocuments);
    setIsDeaf(initialIsDeaf);
  }, [initialName, initialGender, initialDocumentType, initialDocumentNumber, initialCity, initialDateOfBirth, initialBloodType, initialSendDocuments, initialIsDeaf]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNameSave(
      name.trim(),
      gender,
      documentType,
      documentNumber.trim(),
      city.trim(),
      dateOfBirth,
      bloodType,
      sendDocuments,
      isDeaf
    );
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-headline text-center">Bem-vindo(a) ao LibrasTech</CardTitle>
          <CardDescription className="text-center">
            Sua segurança é nossa prioridade. Preencha seus dados para uma identificação rápida em emergências.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="Digite seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                aria-describedby="name-helper-text"
              />
              <p id="name-helper-text" className="text-xs text-muted-foreground px-1">
                Seu nome será usado para personalizar as mensagens de emergência.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="space-y-2">
                <Label>Sexo</Label>
                <RadioGroup
                  onValueChange={setGender}
                  value={gender}
                  className="flex space-x-4 pt-2"
                  aria-label="Sexo"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Feminino" id="feminino" />
                    <Label htmlFor="feminino">Feminino</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Masculino" id="masculino" />
                    <Label htmlFor="masculino">Masculino</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label>Tipo de Documento</Label>
                <RadioGroup
                  onValueChange={setDocumentType}
                  value={documentType}
                  className="flex space-x-4 pt-2"
                  aria-label="Tipo de Documento"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="RG" id="rg" />
                    <Label htmlFor="rg">RG</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="CPF" id="cpf" />
                    <Label htmlFor="cpf">CPF</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data de Nascimento</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateOfBirth && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateOfBirth ? format(dateOfBirth, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateOfBirth}
                        onSelect={setDateOfBirth}
                        initialFocus
                        locale={ptBR}
                        captionLayout="dropdown-buttons"
                        fromYear={1900}
                        toYear={new Date().getFullYear()}
                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="bloodType">Tipo Sanguíneo (Opcional)</Label>
                    <Select onValueChange={setBloodType} value={bloodType}>
                        <SelectTrigger id="bloodType">
                            <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                            {bloodTypes.map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="documentNumber">Número do Documento (Opcional)</Label>
                <Input
                  id="documentNumber"
                  type="text"
                  placeholder="Apenas números"
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                  disabled={!documentType}
                  aria-describedby="document-helper-text"
                />
                 <p id="document-helper-text" className="text-xs text-muted-foreground px-1">
                  Ajuda na identificação oficial.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Cidade (Opcional)</Label>
                <Input
                  id="city"
                  type="text"
                  placeholder="Sua cidade"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  aria-describedby="city-helper-text"
                />
                <p id="city-helper-text" className="text-xs text-muted-foreground px-1">
                   Útil para os serviços de emergência.
                </p>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
                <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                     <div className='flex items-center'>
                         <ShieldCheck className="w-5 h-5 mr-3 text-primary" />
                        <div>
                             <Label htmlFor="send-documents" className="font-semibold">Enviar meu documento na mensagem?</Label>
                             <p className="text-xs text-muted-foreground">
                                Confirme para incluir seu RG/CPF na mensagem SOS.
                             </p>
                        </div>
                    </div>
                    <Switch
                        id="send-documents"
                        checked={sendDocuments}
                        onCheckedChange={setSendDocuments}
                        disabled={!documentType || !documentNumber}
                    />
                </div>
                 <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                     <div className='flex items-center'>
                         <Ear className="w-5 h-5 mr-3 text-primary" />
                        <div>
                             <Label htmlFor="is-deaf" className="font-semibold">Você é uma pessoa surda?</Label>
                             <p className="text-xs text-muted-foreground">
                                Marque para alertar os serviços de emergência.
                             </p>
                        </div>
                    </div>
                    <Switch
                        id="is-deaf"
                        checked={isDeaf}
                        onCheckedChange={setIsDeaf}
                    />
                </div>
            </div>

            <div className="!mt-6">
                 <Button
                    type="submit"
                    className="w-full"
                    disabled={!name.trim() || !gender || !dateOfBirth}
                    >
                    Salvar e Continuar
                </Button>
            </div>
          </form>
        </CardContent>
         <CardFooter className="flex flex-col items-start gap-2 text-sm text-muted-foreground">
             <div className="flex items-center text-center text-xs p-3 rounded-lg bg-muted/50 border border-dashed">
                <Lock size={14} className="mr-2 shrink-0" />
                <span>Suas informações são confidenciais e usadas apenas para gerar a mensagem de emergência.</span>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}
