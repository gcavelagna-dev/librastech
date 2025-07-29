
// src/ai/flows/reverse-geocode-flow.ts
'use server';

/**
 * @fileOverview Converts latitude and longitude coordinates into a human-readable address using Nominatim.
 *
 * - reverseGeocode - A function that handles the reverse geocoding process.
 * - ReverseGeocodeInput - The input type for the reverseGeocode function.
 * - ReverseGeocodeOutput - The return type for the reverseGeocode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReverseGeocodeInputSchema = z.object({
  latitude: z.number().describe('The latitude coordinate.'),
  longitude: z.number().describe('The longitude coordinate.'),
});
export type ReverseGeocodeInput = z.infer<typeof ReverseGeocodeInputSchema>;

const ReverseGeocodeOutputSchema = z.object({
  address: z.string().describe('The formatted street address.'),
});
export type ReverseGeocodeOutput = z.infer<typeof ReverseGeocodeOutputSchema>;

export async function reverseGeocode(input: ReverseGeocodeInput): Promise<ReverseGeocodeOutput> {
  return reverseGeocodeFlow(input);
}

const reverseGeocodeFlow = ai.defineFlow(
  {
    name: 'reverseGeocodeFlow',
    inputSchema: ReverseGeocodeInputSchema,
    outputSchema: ReverseGeocodeOutputSchema,
  },
  async ({ latitude, longitude }) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
    
    try {
      const response = await fetch(url, {
        headers: {
            // Nominatim requires a user-agent
            'User-Agent': 'LibrasTechApp/1.0 (https://librastech.firebaseapp.com)'
        }
      });
      const data = await response.json();

      if (data && data.display_name) {
        return { address: data.display_name };
      } else {
        console.error("Reverse geocoding with Nominatim failed:", data.error);
        // Fallback to coordinates if API fails
        return { address: `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}` };
      }
    } catch (error) {
      console.error("Error calling Nominatim API:", error);
      // Fallback to coordinates on network error
      return { address: `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}` };
    }
  }
);
