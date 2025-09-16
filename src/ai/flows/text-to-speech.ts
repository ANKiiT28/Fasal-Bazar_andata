
'use server';
/**
 * @fileOverview A text-to-speech flow using Genkit.
 *
 * - textToSpeech - A function that converts text to speech audio.
 * - TextToSpeechInput - The input type for the textToSpeech function.
 * - TextToSpeechOutput - The return type for the textToSpeech function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import wav from 'wav';

const TextToSpeechInputSchema = z.object({
  text: z.string().describe('The text to be converted to speech.'),
  language: z.enum(['en', 'hi']).describe('The language of the text (en or hi).'),
});
export type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;

const TextToSpeechOutputSchema = z.object({
  audioDataUri: z.string().nullable().describe('The synthesized audio as a WAV data URI, or null if generation failed.'),
});
export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;


export async function textToSpeech(input: TextToSpeechInput): Promise<TextToSpeechOutput> {
  return textToSpeechFlow(input);
}


async function toWav(pcmData: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels: 1,
      sampleRate: 24000,
      bitDepth: 16,
    });

    const buffers: any[] = [];
    writer.on('data', (chunk) => buffers.push(chunk));
    writer.on('end', () => resolve(Buffer.concat(buffers).toString('base64')));
    writer.on('error', reject);
    writer.end(pcmData);
  });
}


const textToSpeechFlow = ai.defineFlow(
  {
    name: 'textToSpeechFlow',
    inputSchema: TextToSpeechInputSchema,
    outputSchema: TextToSpeechOutputSchema,
  },
  async ({ text, language }) => {
    
    // Valid voices for gemini-2.5-flash-preview-tts include 'Algenib' (Male), 'Achernar' (Female) for en
    // and specific 'hi-IN-*' voices are not directly mapped. We will use a standard female voice for 'en' and a male for 'hi' for variety.
    const voiceName = language === 'hi' ? 'Algenib' : 'Achernar';

    try {
      const { media } = await ai.generate({
        model: 'googleai/gemini-2.5-flash-preview-tts',
        prompt: text,
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
              voiceConfig: {
                  prebuiltVoiceConfig: { voiceName }
              }
          },
        },
      });

      if (!media) {
        throw new Error('TTS generation failed: No media returned.');
      }
      
      // The model returns raw PCM data, we need to convert it to a WAV file
      // to make it playable in the browser.
      const pcmBuffer = Buffer.from(media.url.substring(media.url.indexOf(',') + 1), 'base64');
      const wavBase64 = await toWav(pcmBuffer);

      return {
        audioDataUri: `data:audio/wav;base64,${wavBase64}`,
      };
    } catch (error: any) {
        const errorMessage = error.message || '';
        if(errorMessage.includes('503') || errorMessage.includes('429')) {
            console.warn(`TTS service unavailable (rate limit or overload). Skipping audio generation. Error: ${errorMessage}`);
            return { audioDataUri: null };
        }
        // For other errors, re-throw them so they can be properly debugged.
        console.error("An unexpected error occurred during TTS generation:", error);
        throw error;
    }
  }
);
