
// src/ai/flows/reverse-geocode-flow.ts
'use server';

/**
 * @fileOverview Converts latitude and longitude coordinates into a human-readable address.
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
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      throw new Error("Google Maps API key is not configured.");
    }
    
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK' && data.results[0]) {
        return { address: data.results[0].formatted_address };
      } else {
        console.error("Reverse geocoding failed:", data.status, data.error_message);
        // Fallback to coordinates if API fails
        return { address: `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}` };
      }
    } catch (error) {
      console.error("Error calling Geocoding API:", error);
      // Fallback to coordinates on network error
      return { address: `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}` };
    }
  }
);
