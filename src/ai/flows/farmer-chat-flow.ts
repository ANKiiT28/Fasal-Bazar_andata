
'use server';
/**
 * @fileOverview A chatbot flow for interacting with a virtual farmer.
 *
 * - chatWithFarmer - A function that handles the chat interaction.
 * - ChatWithFarmerInput - The input type for the chatWithFarmer function.
 * - ChatWithFarmerOutput - The return type for the chatWithFarmer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatWithFarmerInputSchema = z.object({
  cropName: z.string().optional().describe('The name of the crop being discussed.'),
  farmerName: z.string().describe("The name of the farmer the user is chatting with."),
  message: z.string().describe("The user's message to the farmer."),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).optional().describe('The chat history between the user and the farmer.'),
  cropDetails: z.object({
    price: z.number(),
    isOrganic: z.boolean(),
    freshness: z.string(),
    variety: z.string(),
  }).optional().describe('Details about the specific crop listing.')
});
export type ChatWithFarmerInput = z.infer<typeof ChatWithFarmerInputSchema>;


const ChatWithFarmerOutputSchema = z.object({
  reply: z.string().describe('The farmer\'s reply to the user.'),
});
export type ChatWithFarmerOutput = z.infer<typeof ChatWithFarmerOutputSchema>;


export async function chatWithFarmer(input: ChatWithFarmerInput): Promise<ChatWithFarmerOutput> {
  return chatWithFarmerFlow(input);
}


const prompt = ai.definePrompt({
  name: 'chatWithFarmerPrompt',
  input: {schema: ChatWithFarmerInputSchema},
  output: {schema: ChatWithFarmerOutputSchema},
  model: 'googleai/gemini-2.5-flash',
  prompt: `You are a helpful and friendly AI assistant for an Indian farmer named {{{farmerName}}}.
Your goal is to answer questions from a potential buyer about the farmer's produce.
Be conversational, helpful, and answer their questions about the produce. Keep your answers concise and to the point.

{{#if cropDetails}}
Here is the information about the crop you are discussing:
- Crop Name: {{{cropName}}}
- Variety: {{{cropDetails.variety}}}
- Price: Rs. {{{cropDetails.price}}} per kg
- Organic: {{#if cropDetails.isOrganic}}Yes{{else}}No{{/if}}
- Freshness: {{{cropDetails.freshness}}}
Use the information above to answer the buyer's questions. You can also answer general questions about availability and quality.
{{else}}
The user is starting a general conversation with you. Answer their questions about the farmer's produce, availability, and quality.
If they ask about a specific crop, you can say that you don't have the details for that specific listing right now but can answer general questions.
{{/if}}

If the user asks a question you cannot answer, or if they seem unsatisfied, you should politely offer to connect them directly with the farmer. For example: "I can't answer that, but I can connect you with farmer {{{farmerName}}}. Would you like to start a live chat or call them?"

The user's message is:
"{{{message}}}"

{{#if history}}
This is the previous conversation history, for context:
{{#each history}}
    {{this.role}}: {{this.content}}
{{/each}}
{{/if}}

Your response should be just the reply text, without any extra formatting.
`,
});

const chatWithFarmerFlow = ai.defineFlow(
  {
    name: 'chatWithFarmerFlow',
    inputSchema: ChatWithFarmerInputSchema,
    outputSchema: ChatWithFarmerOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      if (!output) {
        throw new Error('AI failed to generate a chat response.');
      }
      return output;
    } catch (error) {
      console.error('Error in chatWithFarmerFlow:', error);
      throw error;
    }
  }
);
