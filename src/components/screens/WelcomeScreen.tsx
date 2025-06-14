
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Accessibility } from 'lucide-react';

interface WelcomeScreenProps {
  onNameSave: (name: string) => void;
  initialName?: string;
}

export function WelcomeScreen({ onNameSave, initialName = '' }: WelcomeScreenProps) {
  const [name, setName] = useState(initialName);
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
            Sua segurança é nossa prioridade.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center space-y-3 mb-6 pt-2">
            <Avatar className="w-20 h-20">
              <AvatarImage src="https://placehold.co/100x100.png" alt="Avatar em Libras" data-ai-hint="sign language person" />
              <AvatarFallback>
                <Accessibility className="w-10 h-10" />
              </AvatarFallback>
            </Avatar>
            <p className="text-sm text-center text-muted-foreground px-4">
              Insira seu nome para podermos te ajudar com mais segurança.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Seu Nome</Label>
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
               <p id="name-helper-text" className="text-xs text-muted-foreground px-1">Seu nome será usado para personalizar as mensagens de emergência.</p>
            </div>
            <Button type="submit" className="w-full" disabled={!name.trim()}>
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
