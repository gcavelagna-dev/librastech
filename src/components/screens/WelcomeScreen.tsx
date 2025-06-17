
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface WelcomeScreenProps {
  onNameSave: (name: string) => void;
  initialName?: string;
}

export function WelcomeScreen({ onNameSave, initialName = '' }: WelcomeScreenProps) {
  const [name, setName] = useState(initialName);
  const [documentType, setDocumentType] = useState<string | undefined>(undefined);
  const [documentNumber, setDocumentNumber] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (initialName) {
      setName(initialName);
    }
  }, [initialName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      // For now, only the name is passed up.
      // Document type and number are managed locally.
      // If you need to save them, we can adjust onNameSave or add a new callback.
      onNameSave(name.trim());
    }
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
            Sua segurança é nossa prioridade. Insira seus dados para identificação em emergências.
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
              <Label>Tipo de Documento</Label>
              <RadioGroup
                onValueChange={setDocumentType}
                value={documentType}
                className="flex space-x-4"
                aria-label="Tipo de Documento"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="rg" id="rg" />
                  <Label htmlFor="rg">RG</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cpf" id="cpf" />
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

            <Button 
              type="submit" 
              className="w-full" 
              disabled={!name.trim() || (!!documentType && !documentNumber.trim())}
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
