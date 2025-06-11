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
    - \`<h1>\` for the candidate's name (e.g., JANE DOE).
    - \`<p>\` for contact information directly below the name (e.g., Anytown, USA • (555) 123-4567 • jane.doe@email.com).
    - \`<h2>\` for main section titles (e.g., "PROFESSIONAL PROFILE", "WORK EXPERIENCE", "EDUCATION", "SKILLS"). Section titles should be in ALL CAPS.
    - \`<h3>\` for job titles, degree names, or skill categories (e.g., "Software Engineer", "B.S. in Computer Science", "Programming Languages").
    - \`<p>\` for descriptive text, company/institution names with locations and dates.
    - \`<ul>\` and \`<li>\` for bullet points (e.g., responsibilities, achievements, skill lists).
    - Use \`<strong>\` for emphasis on company names, institution names, or important keywords if appropriate.
- Structure the content logically: Contact Info, Professional Profile, Work Experience, Education, Skills.
- Do NOT include \`<html>\`, \`<head>\`, \`<body>\`, or \`<style>\` tags. The output should be the inner HTML content suitable for direct injection into an existing HTML \`<div>\` or \`<body>\` element.
- Ensure the generated HTML is clean, well-formed, and ready for styling with Tailwind CSS 'prose' classes.

Example of expected HTML structure (content will vary based on input):
<h1>JANE DOE</h1>
<p>Anytown, USA • (555) 123-4567 • jane.doe@email.com</p>

<h2>PROFESSIONAL PROFILE</h2>
<p>A highly motivated and results-oriented professional with X years of experience in...</p>

<h2>WORK EXPERIENCE</h2>
<div>
  <h3>Software Engineer</h3>
  <p><strong>Tech Solutions Inc.</strong> | Anytown, USA | 01/2020 – Present</p>
  <ul>
    <li>Developed and maintained web applications using React and Node.js.</li>
    <li>Collaborated with cross-functional teams to deliver high-quality software.</li>
  </ul>
</div>
<div>
  <h3>Junior Developer</h3>
  <p><strong>Web Wizards LLC.</strong> | Anytown, USA | 06/2018 – 12/2019</p>
  <ul>
    <li>Assisted senior developers in coding and testing.</li>
    <li>Contributed to a major product release.</li>
  </ul>
</div>

<h2>EDUCATION</h2>
<div>
  <h3>B.S. in Computer Science</h3>
  <p><strong>University of Anytown</strong> | Anytown, USA | 09/2014 – 05/2018</p>
  <ul>
    <li>Relevant coursework: Data Structures, Algorithms, Web Development.</li>
    <li>GPA: 3.8/4.0 (Optional: Include if strong and recent graduate)</li>
  </ul>
</div>

<h2>SKILLS</h2>
<h3>Programming Languages</h3>
<ul>
  <li>JavaScript</li>
  <li>Python</li>
  <li>Java</li>
</ul>
<h3>Frameworks & Libraries</h3>
<ul>
  <li>React</li>
  <li>Node.js</li>
  <li>Spring Boot</li>
</ul>
<h3>Databases</h3>
<ul>
  <li>MongoDB</li>
  <li>PostgreSQL</li>
</ul>
<h3>Tools</h3>
<ul>
  <li>Git</li>
  <li>Docker</li>
  <li>JIRA</li>
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
