
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
  emergencyType: z.string().describe('The type of emergency (e.g., Fire, Medical).'),
  gender: z.string().optional().describe('The gender of the user.'),
  userPhoneNumber: z.string().optional().describe('The registered phone number of the user, if available.'),
  documentType: z.string().optional().describe('The type of document provided by the user (e.g., RG, CPF).'),
  documentNumber: z.string().optional().describe('The number of the document provided by the user.'),
  city: z.string().optional().describe('The city of the user.'),
});
export type GenerateSosMessageInput = z.infer<typeof GenerateSosMessageInputSchema>;

const GenerateSosMessageOutputSchema = z.object({
  sosMessage: z.string().describe('The generated SOS message.'),
});
export type GenerateSosMessageOutput = z.infer<typeof GenerateSosMessageOutputSchema>;

export async function generateSosMessage(input: GenerateSosMessageInput): Promise<GenerateSosMessageOutput> {
  return generateSosMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSosMessagePrompt',
  input: {schema: GenerateSosMessageInputSchema},
  output: {schema: GenerateSosMessageOutputSchema},
  prompt: `Você está criando uma mensagem de SOS para o usuário {{userName}}.
A mensagem deve incluir o nome do usuário, a localização atual e o tipo de emergência.
{{#if gender}}Sexo: {{gender}}.{{/if}}
{{#if userPhoneNumber}}Inclua também o número de telefone registrado: {{userPhoneNumber}}.{{/if}}
{{#if documentType}}Tipo de Documento: {{documentType}}.{{/if}}
{{#if documentNumber}}Número do Documento: {{documentNumber}}.{{/if}}
{{#if city}}Cidade: {{city}}.{{/if}}
A mensagem deve ser concisa e clara, em Português do Brasil. Use no máximo 250 caracteres.

Nome do usuário: {{userName}}
Localização: {{location}}
Tipo de emergência: {{emergencyType}}
{{#if gender}}Sexo: {{gender}}{{/if}}
{{#if userPhoneNumber}}Número de contato: {{userPhoneNumber}}{{/if}}
{{#if documentType}}Documento: {{documentType}} - {{documentNumber}}{{/if}}
{{#if city}}Cidade: {{city}}{{/if}}

Mensagem SOS:`,
});

const generateSosMessageFlow = ai.defineFlow(
  {
    name: 'generateSosMessageFlow',
    inputSchema: GenerateSosMessageInputSchema,
    outputSchema: GenerateSosMessageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
