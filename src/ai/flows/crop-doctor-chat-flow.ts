
'use server';
/**
 * @fileOverview A chatbot flow for asking follow-up questions to the AI Crop Doctor.
 *
 * - chatWithCropDoctor - A function that handles the chat interaction.
 * - CropDoctorChatInput - The input type for the chatWithCropDoctor function.
 * - CropDoctorChatOutput - The return type for the chatWithCropDoctor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CropDoctorChatInputSchema = z.object({
  diseaseName: z.string().describe('The name of the disease being discussed.'),
  suggestedActions: z.string().describe('The initial suggested actions for the disease.'),
  message: z.string().describe("The user's follow-up question."),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).optional().describe('The chat history between the user and the AI doctor.'),
  language: z.string().describe('The language for the response (e.g., "en" for English, "hi" for Hindi).'),
});
export type CropDoctorChatInput = z.infer<typeof CropDoctorChatInputSchema>;


const CropDoctorChatOutputSchema = z.object({
  reply: z.string().describe('The AI Crop Doctor\'s reply to the user.'),
});
export type CropDoctorChatOutput = z.infer<typeof CropDoctorChatOutputSchema>;


export async function chatWithCropDoctor(input: CropDoctorChatInput): Promise<CropDoctorChatOutput> {
  return chatWithCropDoctorFlow(input);
}


const prompt = ai.definePrompt({
  name: 'chatWithCropDoctorPrompt',
  input: {schema: CropDoctorChatInputSchema},
  output: {schema: CropDoctorChatOutputSchema},
  model: 'googleai/gemini-2.5-flash',
  prompt: `You are an expert AI Crop Doctor specializing in plant diseases.
A user has just received an initial diagnosis and is asking follow-up questions.

Your knowledge is based on this initial diagnosis:
- Disease Name: {{{diseaseName}}}
- Initial Suggested Actions: {{{suggestedActions}}}

Your task is to answer the user's questions clearly and concisely. Provide more details about the disease, clarify the suggested actions, suggest preventative measures, or explain the potential impact if left untreated.
Be helpful, clear, and reassuring.

The user's message is:
"{{{message}}}"

{{#if history}}
This is the previous conversation history, for context:
{{#each history}}
    {{this.role}}: {{this.content}}
{{/each}}
{{/if}}

CRITICAL: Your entire response MUST be in the following language: {{{language}}}.
Your response should be just the reply text, without any extra formatting.
`,
});

const chatWithCropDoctorFlow = ai.defineFlow(
  {
    name: 'chatWithCropDoctorFlow',
    inputSchema: CropDoctorChatInputSchema,
    outputSchema: CropDoctorChatOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      if (!output) {
        throw new Error('AI failed to generate a chat response.');
      }
      return output;
    } catch (error) {
      console.error('Error in chatWithCropDoctorFlow:', error);
      throw error;
    }
  }
);
