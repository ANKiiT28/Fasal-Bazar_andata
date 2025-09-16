
'use server';

/**
 * @fileOverview Provides AI-driven demand forecasts for crops, helping farmers plan planting and harvesting.
 *
 * - getDemandForecast - A function that returns the demand forecast for a given crop.
 * - DemandForecastInput - The input type for the getDemandForecast function.
 * - DemandForecastOutput - The return type for the getDemandForecast function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const DemandForecastInputSchema = z.object({
  crop: z.string().describe('The crop for which to forecast demand.'),
  location: z.string().describe('The location where the crop is grown.'),
});
export type DemandForecastInput = z.infer<typeof DemandForecastInputSchema>;

const DemandForecastOutputSchema = z.object({
  forecast: z
    .string()
    .describe('The demand forecast for the crop in the specified location.'),
});
export type DemandForecastOutput = z.infer<typeof DemandForecastOutputSchema>;

export async function getDemandForecast(input: DemandForecastInput): Promise<DemandForecastOutput> {
  return demandForecastFlow(input);
}

const prompt = ai.definePrompt({
  name: 'demandForecastPrompt',
  input: {schema: DemandForecastInputSchema},
  output: {schema: DemandForecastOutputSchema},
  model: 'googleai/gemini-2.5-flash',
  prompt: `You are an AI assistant that provides demand forecasts for crops.

  Provide a demand forecast for {{crop}} in {{location}} for the next week.
  The forecast should be a short sentence, including a percentage change.
  For example: "Tomatoes demand expected +15% next week."`,
});

const demandForecastFlow = ai.defineFlow(
  {
    name: 'demandForecastFlow',
    inputSchema: DemandForecastInputSchema,
    outputSchema: DemandForecastOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      if (!output) {
        throw new Error('AI failed to generate a demand forecast.');
      }
      return output;
    } catch (error) {
      console.error('Error in demandForecastFlow:', error);
      throw error;
    }
  }
);
