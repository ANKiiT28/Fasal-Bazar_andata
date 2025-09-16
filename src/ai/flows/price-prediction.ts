
'use server';
/**
 * @fileOverview An AI-powered price prediction engine for crops.
 *
 * - predictFuturePrice - A function that predicts the future price for a given crop.
 * - PredictFuturePriceInput - The input type for the predictFuturePrice function.
 * - PredictFuturePriceOutput - The return type for the predictFuturePrice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const PredictFuturePriceInputSchema = z.object({
  cropName: z.string().describe('The name of the crop.'),
  historicalData: z.array(z.object({
      month: z.string(),
      price: z.number()
  })).describe('An array of historical price data for the last 6 months.')
});
export type PredictFuturePriceInput = z.infer<typeof PredictFuturePriceInputSchema>;

const PredictFuturePriceOutputSchema = z.object({
  predictedPrice: z.number().describe('The predicted price for the next month.'),
  justification: z.string().describe('A brief justification for the prediction.'),
});
export type PredictFuturePriceOutput = z.infer<typeof PredictFuturePriceOutputSchema>;

export async function predictFuturePrice(input: PredictFuturePriceInput): Promise<PredictFuturePriceOutput> {
  return predictFuturePriceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictFuturePricePrompt',
  input: {schema: PredictFuturePriceInputSchema},
  output: {schema: PredictFuturePriceOutputSchema},
  model: 'googleai/gemini-2.5-flash',
  prompt: `You are an AI agricultural market analyst. Based on the historical price data for the last 6 months, predict the price for the next month.

Crop Name: {{{cropName}}}

Historical Data (Price per kg):
{{#each historicalData}}
- {{{this.month}}}: Rs. {{{this.price}}}
{{/each}}

Analyze the trend and provide a predicted price for next month. Also, provide a short justification for your prediction based on the trend.
`,
});

const predictFuturePriceFlow = ai.defineFlow(
  {
    name: 'predictFuturePriceFlow',
    inputSchema: PredictFuturePriceInputSchema,
    outputSchema: PredictFuturePriceOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      if (!output) {
        throw new Error('AI failed to generate a price prediction.');
      }
      return output;
    } catch (error) {
      console.error('Error in predictFuturePriceFlow:', error);
      throw error;
    }
  }
);
