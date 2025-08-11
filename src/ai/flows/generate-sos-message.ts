
// src/ai/flows/generate-sos-message.ts
'use server';

/**
 * @fileOverview Generates an SOS message containing the user's name, location, emergency type,
 * and optionally phone number, document type, document number, and city.
 *
 * - generateSosMessage - A function that generates the SOS message.
 * - GenerateSosMessageInput - The input type for the generateSosMessage function.
 * - GenerateSosMessageOutput - The return type for the generateSosMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSosMessageInputSchema = z.object({
  userName: z.string().describe('The name of the user sending the SOS message.'),
  location: z.string().describe('The current location of the user.'),
  latitude: z.number().optional().describe('The latitude of the user.'),
  longitude: z.number().optional().describe('The longitude of the user.'),
  emergencyType: z.string().describe('The type of emergency (e.g., Fire, Medical).'),
  subEmergencyType: z.string().describe('The specific sub-type of the emergency (e.g., Roubo, Incêndio).'),
  gender: z.string().optional().describe('The gender of the user.'),
  dateOfBirth: z.string().optional().describe("A data de nascimento do usuário no formato dd/MM/yyyy."),
  userPhoneNumber: z.string().optional().describe('The registered phone number of the user, if available.'),
  documentType: z.string().optional().describe('The type of document provided by the user (e.g., RG, CPF).'),
  documentNumber: z.string().optional().describe('The number of the document provided by the user.'),
  city: z.string().optional().describe('The city of the user.'),
  bloodType: z.string().optional().describe('The blood type of the user.'),
  sendDocumentsConfirmed: z.boolean().optional().describe('Whether the user confirmed sending document info.'),
  isDeaf: z.boolean().optional().describe('Whether the user is deaf.'),
  isDesktop: z.boolean().optional().describe('Whether the user is on a desktop device.'),
  isVictim: z.boolean().optional().describe('Whether the user is the victim.'),
  isBleeding: z.boolean().optional().describe('Whether there is bleeding at the scene.'),
});
export type GenerateSosMessageInput = z.infer<typeof GenerateSosMessageInputSchema>;

const GenerateSosMessageOutputSchema = z.object({
  sosMessage: z.string().describe('The generated SOS message.'),
});
export type GenerateSosMessageOutput = z.infer<typeof GenerateSosMessageOutputSchema>;

export async function generateSosMessage(input: GenerateSosMessageInput): Promise<GenerateSosMessageOutput> {
  return generateSosMessageFlow(input);
}

const emergencyTypeMap: Record<string, string> = {
  Fire: "Bombeiros",
  Medical: "SAMU",
  PublicSafety: "Polícia Militar",
};

const prompt = ai.definePrompt({
  name: 'generateSosMessagePrompt',
  input: {schema: GenerateSosMessageInputSchema},
  output: {schema: GenerateSosMessageOutputSchema},
  prompt: `Você está criando uma mensagem de SOS para o usuário {{userName}}.
{{#if isDeaf}}A mensagem DEVE começar com: "ATENÇÃO: Vítima surda.".{{/if}}
A mensagem deve incluir o nome do usuário, a localização atual, o link do Google Maps e o tipo de emergência detalhado.
A mensagem deve ser concisa e clara, em Português do Brasil. Use no máximo 300 caracteres.

Exemplo de dados:
{{#if isDeaf}}- Alerta: Vítima surda.{{/if}}
- Solicitante: {{userName}} ({{#if isVictim}}Vítima{{else}}Relatando para terceiro{{/if}})
- Localização: {{#if isDesktop}}aproximadamente {{/if}}{{location}}
{{#if latitude}}- Localização no mapa: https://www.google.com/maps?q={{latitude}},{{longitude}}{{/if}}
- Tipo de emergência: {{emergencyType}} - {{subEmergencyType}}
{{#if isBleeding}}{{#if bloodType}}- INFORMAÇÃO CRÍTICA: Há sangramento! Tipo sanguíneo da vítima (se for o solicitante): {{bloodType}}.{{else}}- INFORMAÇÃO CRÍTICA: Há sangramento no local.{{/if}}{{/if}}
{{#if userPhoneNumber}}- Número de contato: {{userPhoneNumber}}{{/if}}
{{#if gender}}- Sexo: {{gender}}{{/if}}
{{#if dateOfBirth}}- Data de Nascimento: {{dateOfBirth}}{{/if}}
{{#if sendDocumentsConfirmed}}{{#if documentType}}- Documento: {{documentType}} - {{documentNumber}}{{/if}}{{/if}}
{{#if city}}- Cidade: {{city}}{{/if}}

Baseado nos dados acima, gere a mensagem SOS.`,
});

const generateSosMessageFlow = ai.defineFlow(
  {
    name: 'generateSosMessageFlow',
    inputSchema: GenerateSosMessageInputSchema,
    outputSchema: GenerateSosMessageOutputSchema,
  },
  async (input) => {
    const translatedEmergencyType = emergencyTypeMap[input.emergencyType] || input.emergencyType;
    const processedInput = {
      ...input,
      emergencyType: translatedEmergencyType,
    };
    const {output} = await prompt(processedInput);
    return output!;
  }
);
