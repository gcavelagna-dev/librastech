
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { ptBR } from 'date-fns/locale';

interface WelcomeScreenProps {
  onNameSave: (name: string, gender?: string, documentType?: string, documentNumber?: string, city?: string, dateOfBirth?: Date) => void;
  initialName?: string;
  initialGender?: string;
  initialDocumentType?: string;
  initialDocumentNumber?: string;
  initialCity?: string;
  initialDateOfBirth?: string;
}

export function WelcomeScreen({
  onNameSave,
  initialName = '',
  initialGender,
  initialDocumentType,
  initialDocumentNumber = '',
  initialCity = '',
  initialDateOfBirth
}: WelcomeScreenProps) {
  const [name, setName] = useState(initialName);
  const [gender, setGender] = useState<string | undefined>(initialGender);
  const [documentType, setDocumentType] = useState<string | undefined>(initialDocumentType);
  const [documentNumber, setDocumentNumber] = useState(initialDocumentNumber);
  const [city, setCity] = useState(initialCity);
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (initialName) setName(initialName);
    if (initialGender) setGender(initialGender);
    if (initialDocumentType) setDocumentType(initialDocumentType);
    if (initialDocumentNumber) setDocumentNumber(initialDocumentNumber);
    if (initialCity) setCity(initialCity);
    if (initialDateOfBirth) setDateOfBirth(new Date(initialDateOfBirth));
  }, [initialName, initialGender, initialDocumentType, initialDocumentNumber, initialCity, initialDateOfBirth]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // A verificação do botão desabilitado já garante que os dados estão preenchidos
    onNameSave(
      name.trim(),
      gender,
      documentType,
      documentNumber.trim(),
      city.trim(),
      dateOfBirth
    );
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-headline text-center">Bem-vindo ao LibrasTech</CardTitle>
          <CardDescription className="text-center">
            Sua segurança é nossa prioridade. Preencha todos os seus dados para uma identificação completa em emergências.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Seu Nome Completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="Digite seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="text-base"
                aria-describedby="name-helper-text"
              />
              <p id="name-helper-text" className="text-xs text-muted-foreground px-1">
                Seu nome será usado para personalizar as mensagens de emergência.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Sexo</Label>
              <RadioGroup
                onValueChange={setGender}
                value={gender}
                className="flex space-x-4"
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
                    captionLayout="dropdown-buttons"
                    fromYear={1920}
                    toYear={new Date().getFullYear()}
                    locale={ptBR}
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                  />
                </PopoverContent>
              </Popover>
               <p id="dob-helper-text" className="text-xs text-muted-foreground px-1">
                Sua idade pode ser uma informação crucial em uma emergência.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Tipo de Documento</Label>
              <RadioGroup
                onValueChange={setDocumentType}
                value={documentType}
                className="flex space-x-4"
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

            <div className="space-y-2">
              <Label htmlFor="documentNumber">Número do Documento</Label>
              <Input
                id="documentNumber"
                type="text"
                placeholder="Digite o número do documento"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                className="text-base"
                disabled={!documentType}
                aria-describedby="document-helper-text"
              />
               <p id="document-helper-text" className="text-xs text-muted-foreground px-1">
                Seu documento pode ajudar na identificação pelas autoridades.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                type="text"
                placeholder="Digite sua cidade"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="text-base"
                aria-describedby="city-helper-text"
              />
              <p id="city-helper-text" className="text-xs text-muted-foreground px-1">
                Sua cidade pode ser útil para os serviços de emergência.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={!name.trim() || !gender || !documentType || !documentNumber.trim() || !city.trim() || !dateOfBirth}
            >
              Salvar e Continuar
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          {/* Pode adicionar algo no rodapé se necessário */}
        </CardFooter>
      </Card>
    </div>
  );
}
