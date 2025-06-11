// src/ai/flows/autofill-resume-details.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow for automatically filling in missing details
 *  in a resume, such as education and work history, if the user provides insufficient information.
 *
 * - autoFillResumeDetails - A function that takes user-provided resume details and generates
 *   additional realistic education and work history details using AI.
 * - AutoFillResumeDetailsInput - The input type for the autoFillResumeDetails function.
 * - AutoFillResumeDetailsOutput - The return type for the autoFillResumeDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutoFillResumeDetailsInputSchema = z.object({
  jobDescription: z
    .string()
    .describe('The job description for which the resume is being created.'),
  userDetails: z
    .string()
    .describe(
      'Details about the user, including skills, interests, and any work or education history they have provided.'
    ),
});
export type AutoFillResumeDetailsInput = z.infer<typeof AutoFillResumeDetailsInputSchema>;

const AutoFillResumeDetailsOutputSchema = z.object({
  educationDetails: z
    .string()
    .describe('AI-generated realistic education details for the resume.'),
  workHistoryDetails: z
    .string()
    .describe('AI-generated realistic work history details for the resume.'),
});
export type AutoFillResumeDetailsOutput = z.infer<typeof AutoFillResumeDetailsOutputSchema>;

export async function autoFillResumeDetails(
  input: AutoFillResumeDetailsInput
): Promise<AutoFillResumeDetailsOutput> {
  return autoFillResumeDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'autoFillResumeDetailsPrompt',
  input: {schema: AutoFillResumeDetailsInputSchema},
  output: {schema: AutoFillResumeDetailsOutputSchema},
  prompt: `You are an AI resume assistant tasked with filling in missing
  details in a user's resume. The user has provided the following job
  description:

  {{jobDescription}}

  And the following details about themselves:

  {{userDetails}}

  If the user has not provided sufficient education or work history,
  generate realistic and plausible details to supplement their resume.
  Make the education and work history sound professional and relevant to the job description.
  Do not repeat any details already provided by the user.

  Output the education details as educationDetails, and work history as workHistoryDetails.
  Ensure that each of educationDetails and workHistoryDetails is a single string.
`,
});

const autoFillResumeDetailsFlow = ai.defineFlow(
  {
    name: 'autoFillResumeDetailsFlow',
    inputSchema: AutoFillResumeDetailsInputSchema,
    outputSchema: AutoFillResumeDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
