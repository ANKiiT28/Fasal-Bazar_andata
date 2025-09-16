
'use server';
/**
 * @fileOverview An AI-powered fair price suggestion engine for crops.
 *
 * - suggestFairPrice - A function that suggests a fair price for a given crop.
 * - SuggestFairPriceInput - The input type for the suggestFairPrice function.
 * - SuggestFairPriceOutput - The return type for the suggestFairPrice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestFairPriceInputSchema = z.object({
  cropName: z.string().describe('The name of the crop.'),
  cropVariety: z.string().describe('The variety of the crop.'),
  location: z.string().describe('The city where the crop is being sold.'),
  quantity: z.number().describe('The quantity of the crop being sold (e.g., in kg).'),
  unit: z.string().describe('The unit of measurement for the crop quantity (e.g., kg, tons).'),
  quality: z.string().describe('A description of the crop quality (e.g., fresh, organic, grade A).'),
});
export type SuggestFairPriceInput = z.infer<typeof SuggestFairPriceInputSchema>;

const SuggestFairPriceOutputSchema = z.object({
  fairPrice: z.number().describe('The suggested fair price for the crop.'),
  reasoning: z.string().describe('The reasoning behind the suggested price.'),
});
export type SuggestFairPriceOutput = z.infer<typeof SuggestFairPriceOutputSchema>;

export async function suggestFairPrice(input: SuggestFairPriceInput): Promise<SuggestFairPriceOutput> {
  return suggestFairPriceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestFairPricePrompt',
  input: {schema: SuggestFairPriceInputSchema},
  output: {schema: SuggestFairPriceOutputSchema},
  model: 'googleai/gemini-2.5-flash',
  prompt: `You are an AI-powered agricultural pricing expert. Based on the following information, suggest a fair price for the crop.

Crop Name: {{{cropName}}}
Crop Variety: {{{cropVariety}}}
Location: {{{location}}}
Quantity: {{{quantity}}} {{{unit}}}
Quality: {{{quality}}}

Consider current market prices, demand, and other relevant factors to determine a fair price. Provide a brief reasoning for your suggestion.

Output the fairPrice as a number.
`,
});

const suggestFairPriceFlow = ai.defineFlow(
  {
    name: 'suggestFairPriceFlow',
    inputSchema: SuggestFairPriceInputSchema,
    outputSchema: SuggestFairPriceOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      if (!output) {
        throw new Error('AI failed to generate a price suggestion.');
      }
      return output;
    } catch (error) {
      console.error('Error in suggestFairPriceFlow:', error);
      // Re-throw the error to be handled by the calling client component
      throw error;
    }
  }
);
