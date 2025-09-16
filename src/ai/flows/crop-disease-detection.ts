
'use server';

/**
 * @fileOverview An AI agent to detect crop diseases from a photo.
 *
 * - detectCropDisease - A function that handles the crop disease detection process.
 * - DetectCropDiseaseInput - The input type for the detectCropdisease function.
 * - DetectCropDiseaseOutput - The return type for the detectCropdisease function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectCropDiseaseInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a crop, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
    language: z.string().describe('The language for the response (e.g., "en" for English, "hi" for Hindi).'),
});
export type DetectCropDiseaseInput = z.infer<typeof DetectCropDiseaseInputSchema>;

const DetectCropDiseaseOutputSchema = z.object({
  diseaseDetected: z.boolean().describe('Whether or not a disease is detected.'),
  diseaseName: z.string().describe('The name of the detected disease, if any.'),
  confidence: z.number().describe('The confidence level of the disease detection (0-1).'),
  suggestedActions: z.string().describe('Suggested actions to take based on the disease detected.'),
});
export type DetectCropDiseaseOutput = z.infer<typeof DetectCropDiseaseOutputSchema>;

export async function detectCropDisease(input: DetectCropDiseaseInput): Promise<DetectCropDiseaseOutput> {
  return detectCropDiseaseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectCropDiseasePrompt',
  input: {schema: DetectCropDiseaseInputSchema},
  output: {schema: DetectCropDiseaseOutputSchema},
  model: 'googleai/gemini-2.5-flash',
  prompt: `You are an AI Crop Disease Detection Expert.

Analyze the following crop photo.

{{media url=photoDataUri}}

You will analyze the photo of the crop and determine if there is a disease present. If there is a disease, you will provide the name of the disease, a confidence level (0-1), and suggested actions to take.

CRITICAL: Your entire response, including the diseaseName and suggestedActions, MUST be in the following language: {{{language}}}.
`,
});

const detectCropDiseaseFlow = ai.defineFlow(
  {
    name: 'detectCropDiseaseFlow',
    inputSchema: DetectCropDiseaseInputSchema,
    outputSchema: DetectCropDiseaseOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      if (!output) {
        throw new Error('AI failed to generate a diagnosis.');
      }
      return output;
    } catch (error) {
      console.error('Error in detectCropDiseaseFlow:', error);
      throw error;
    }
  }
);
