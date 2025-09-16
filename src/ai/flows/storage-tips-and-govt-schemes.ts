
'use server';
/**
 * @fileOverview Provides AI-driven recommendations for storage tips and government schemes to farmers.
 *
 * - getStorageTipsAndGovtSchemes - A function that provides recommendations to farmers.
 * - StorageTipsAndGovtSchemesInput - The input type for the getStorageTipsAndGovtSchemes function.
 * - StorageTipsAndGovtSchemesOutput - The return type for the getStorageTipsAndGovtSchemes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StorageTipsAndGovtSchemesInputSchema = z.object({
  cropName: z.string().describe('The name of the crop for which recommendations are needed.'),
  location: z.string().describe('The location of the farmer.'),
  farmingExperienceYears: z.number().describe('The number of years of farming experience of the farmer.'),
});
export type StorageTipsAndGovtSchemesInput = z.infer<typeof StorageTipsAndGovtSchemesInputSchema>;

const StorageTipsAndGovtSchemesOutputSchema = z.object({
  storageTips: z.array(z.string()).describe('AI-driven recommendations for storing the crop to reduce waste.'),
  govtSchemes: z.array(z.string()).describe('Government schemes relevant to the crop and farmer location.'),
  demandForecast: z.string().describe('A demand forecast for the crop in the near future.'),
});
export type StorageTipsAndGovtSchemesOutput = z.infer<typeof StorageTipsAndGovtSchemesOutputSchema>;

export async function getStorageTipsAndGovtSchemes(
  input: StorageTipsAndGovtSchemesInput
): Promise<StorageTipsAndGovtSchemesOutput> {
  return storageTipsAndGovtSchemesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'storageTipsAndGovtSchemesPrompt',
  input: {schema: StorageTipsAndGovtSchemesInputSchema},
  output: {schema: StorageTipsAndGovtSchemesOutputSchema},
  model: 'googleai/gemini-2.5-flash',
  prompt: `You are an AI assistant providing recommendations to farmers in India.

You will receive the crop name, location, and farming experience of the farmer. Based on this information, you will provide:

1.  storageTips: AI-driven recommendations for storing the crop to reduce waste.
2.  govtSchemes: Government schemes relevant to the crop and farmer location.
3.  demandForecast: A demand forecast for the crop in the near future.

Crop Name: {{{cropName}}}
Location: {{{location}}}
Farming Experience: {{{farmingExperienceYears}}} years

Respond in a JSON format.
`,
});

const storageTipsAndGovtSchemesFlow = ai.defineFlow(
  {
    name: 'storageTipsAndGovtSchemesFlow',
    inputSchema: StorageTipsAndGovtSchemesInputSchema,
    outputSchema: StorageTipsAndGovtSchemesOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      if (!output) {
        throw new Error('AI failed to generate recommendations.');
      }
      return output;
    } catch (error) {
      console.error('Error in storageTipsAndGovtSchemesFlow:', error);
      throw error;
    }
  }
);
