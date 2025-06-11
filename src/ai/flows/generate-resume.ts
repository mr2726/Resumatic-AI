// src/ai/flows/generate-resume.ts
'use server';
/**
 * @fileOverview A resume generation AI agent.
 *
 * - generateResume - A function that handles the resume generation process.
 * - GenerateResumeInput - The input type for the generateResume function.
 * - GenerateResumeOutput - The return type for the generateResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateResumeInputSchema = z.object({
  jobDescription: z.string().describe('The job description.'),
  userInput: z.string().describe('Information about the user (skills, interests, etc.)'),
});
export type GenerateResumeInput = z.infer<typeof GenerateResumeInputSchema>;

const GenerateResumeOutputSchema = z.object({
  resume: z.string().describe('The generated resume as an HTML string.'),
});
export type GenerateResumeOutput = z.infer<typeof GenerateResumeOutputSchema>;

export async function generateResume(input: GenerateResumeInput): Promise<GenerateResumeOutput> {
  return generateResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateResumePrompt',
  input: {schema: GenerateResumeInputSchema},
  output: {schema: GenerateResumeOutputSchema},
  prompt: `You are an expert resume writer. Your task is to generate a professional resume formatted as an HTML string.
This resume should be tailored to the provided job description and user information.
If the user's input lacks details for sections like 'Education' or 'Work History', invent plausible and relevant information, using realistic-sounding institutions and company names.

Job Description:
{{{jobDescription}}}

User Input:
{{{userInput}}}

Output Instructions:
- The entire resume must be a single HTML string for the 'resume' field.
- Use semantic HTML tags:
    - \`<h1>\` for the candidate's name.
    - \`<h2>\` for main section titles (e.g., "Summary", "Experience", "Education", "Skills").
    - \`<h3>\` for job titles, degree names, or sub-sections.
    - \`<p>\` for descriptive text, contact information, dates, and company names/locations.
    - \`<ul>\` and \`<li>\` for bullet points (e.g., responsibilities, achievements, skill lists).
    - Use \`<strong>\` for emphasis on company names or important keywords if appropriate.
- Structure the content logically for a standard resume format (e.g., Contact Info, Summary, Experience, Education, Skills).
- Do NOT include \`<html>\`, \`<head>\`, \`<body>\`, or \`<style>\` tags. The output should be the inner HTML content suitable for direct injection into an existing HTML \`<div>\` or \`<body>\` element.
- Ensure the generated HTML is clean, well-formed, and ready for styling with Tailwind CSS 'prose' classes.

Example of expected HTML structure (content will vary based on input):
<h1>Jane Doe</h1>
<p>123 Main Street, Anytown, USA | (555) 123-4567 | jane.doe@email.com</p>
<h2>Summary</h2>
<p>A highly motivated and results-oriented professional with X years of experience in...</p>
<h2>Experience</h2>
<div>
  <h3>Software Engineer</h3>
  <p><strong>Tech Solutions Inc.</strong> | Anytown, USA | Jan 2020 - Present</p>
  <ul>
    <li>Developed and maintained web applications using React and Node.js.</li>
    <li>Collaborated with cross-functional teams to deliver high-quality software.</li>
  </ul>
</div>
<div>
  <h3>Junior Developer</h3>
  <p><strong>Web Wizards LLC.</strong> | Anytown, USA | Jun 2018 - Dec 2019</p>
  <ul>
    <li>Assisted senior developers in coding and testing.</li>
    <li>Contributed to a major product release.</li>
  </ul>
</div>
<h2>Education</h2>
<div>
  <h3>B.S. in Computer Science</h3>
  <p><strong>University of Anytown</strong> | Anytown, USA | Graduated May 2018</p>
  <ul>
    <li>Relevant coursework: Data Structures, Algorithms, Web Development.</li>
    <li>GPA: 3.8/4.0</li>
  </ul>
</div>
<h2>Skills</h2>
<ul>
  <li>Programming Languages: JavaScript, Python, Java</li>
  <li>Frameworks: React, Node.js, Spring Boot</li>
  <li>Databases: MongoDB, PostgreSQL</li>
  <li>Tools: Git, Docker, JIRA</li>
</ul>

Your output for the 'resume' field must be ONLY the HTML string itself, without any surrounding markdown like \`\`\`html ... \`\`\` or explanations.
`,
});

const generateResumeFlow = ai.defineFlow(
  {
    name: 'generateResumeFlow',
    inputSchema: GenerateResumeInputSchema,
    outputSchema: GenerateResumeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
