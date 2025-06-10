// src/ai/flows/generate-sos-message.ts
'use server';

/**
 * @fileOverview Generates an SOS message containing the user's name and location.
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
  prompt: `Você está criando uma mensagem de SOS para o usuário {{userName}}. A mensagem deve incluir o nome do usuário, a localização atual e o tipo de emergência. A mensagem deve ser concisa e clara, em Português do Brasil.  Use no máximo 200 caracteres.

Nome do usuário: {{userName}}
Localização: {{location}}
Tipo de emergência: {{emergencyType}}

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
