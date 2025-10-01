
"use client";

import React from 'react';
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
import { HelpCircle, User, Settings, Siren, List, MessageSquare, Send } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TutorialDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TutorialDialog({ isOpen, onClose }: TutorialDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <HelpCircle className="w-6 h-6 mr-2" /> Guia Rápido do LibrasTech
          </DialogTitle>
          <DialogDescription>
            Aprenda a usar o aplicativo para solicitar ajuda em emergências.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-6">
            <div className="space-y-6 text-sm py-4">
                <div className="space-y-2">
                    <h3 className="font-semibold flex items-center"><User className="w-4 h-4 mr-2 text-primary" />1. Cadastro Inicial</h3>
                    <p>Ao abrir o app pela primeira vez, você precisará preencher seu nome e algumas informações básicas. Isso é muito importante para que os serviços de emergência possam te identificar rapidamente.</p>
                    <ul className="list-disc list-inside pl-4 space-y-1 text-muted-foreground">
                        <li>**Nome Completo:** Essencial para identificação.</li>
                        <li>**Dados Opcionais:** Como data de nascimento, documento e tipo sanguíneo. Quanto mais informações, melhor será o atendimento.</li>
                        <li>**Pessoa Surda:** Marque essa opção para que a mensagem de socorro inclua um alerta, facilitando a comunicação com a equipe.</li>
                    </ul>
                </div>
                 <div className="space-y-2">
                    <h3 className="font-semibold flex items-center"><Settings className="w-4 h-4 mr-2 text-primary" />2. Configurações</h3>
                    <p>No canto superior direito, você encontrará o ícone de configurações. Lá, você pode:</p>
                    <ul className="list-disc list-inside pl-4 space-y-1 text-muted-foreground">
                        <li>**Editar seu Perfil:** Atualize suas informações pessoais a qualquer momento.</li>
                        <li>**Salvar seu Telefone:** Para incluí-lo automaticamente nas mensagens.</li>
                        <li>**Adicionar Contatos de Confiança:** Cadastre até 5 pessoas que você poderá notificar rapidamente em uma emergência.</li>
                    </ul>
                </div>
                 <div className="space-y-2">
                    <h3 className="font-semibold flex items-center"><Siren className="w-4 h-4 mr-2 text-primary" />3. Escolhendo a Emergência</h3>
                    <p>Na tela principal, escolha o serviço de emergência correto para sua situação:</p>
                    <ul className="list-disc list-inside pl-4 space-y-1 text-muted-foreground">
                        <li>**Bombeiros:** Para incêndios, resgates, acidentes, etc.</li>
                        <li>**SAMU:** Para problemas de saúde, como infartos ou mal súbito.</li>
                        <li>**Polícia Militar:** Para crimes, violência ou perturbação da ordem.</li>
                    </ul>
                </div>
                 <div className="space-y-2">
                    <h3 className="font-semibold flex items-center"><List className="w-4 h-4 mr-2 text-primary" />4. Detalhando a Ocorrência</h3>
                    <p>Após escolher o serviço, especifique o tipo de ocorrência (ex: "Incêndio em Edificação", "Roubo", "Infarto"). Em seguida, informe quem é a vítima e se há sangramento no local. Esses detalhes são cruciais.</p>
                </div>
                 <div className="space-y-2">
                    <h3 className="font-semibold flex items-center"><MessageSquare className="w-4 h-4 mr-2 text-primary" />5. Gerando a Mensagem SOS</h3>
                    <p>Na tela de revisão, confira todos os seus dados. O app usará sua localização atual. Quando estiver pronto, clique em **"Gerar Mensagem SOS"**.</p>
                </div>
                 <div className="space-y-2">
                    <h3 className="font-semibold flex items-center"><Send className="w-4 h-4 mr-2 text-primary" />6. Enviando o Pedido de Ajuda</h3>
                    <p>Com a mensagem gerada, você terá as seguintes opções:</p>
                    <ul className="list-disc list-inside pl-4 space-y-1 text-muted-foreground">
                        <li>**Enviar p/ Emergência:** Abre o WhatsApp para enviar a mensagem diretamente para o serviço de emergência.</li>
                        <li>**Notificar Contatos:** Botões individuais aparecerão para cada contato de confiança que você salvou. Clique para notificá-los via WhatsApp.</li>
                        <li>**Copiar:** Copia a mensagem para a sua área de transferência.</li>
                    </ul>
                </div>
            </div>
        </ScrollArea>
        <DialogFooter className="sm:justify-end mt-4">
          <DialogClose asChild>
            <Button type="button">
              Entendi
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    