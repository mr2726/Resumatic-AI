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
  resume: z.string().describe('The generated resume as an HTML string, structured according to the provided example.'),
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
It must strictly follow the HTML structure and class names provided in the example below.
If the user's input lacks details for sections, invent plausible and relevant information, using realistic-sounding institutions and company names.

Job Description:
{{{jobDescription}}}

User Input:
{{{userInput}}}

Output Instructions:
- The entire resume must be a single HTML string for the 'resume' field.
- Do NOT include \`<html>\`, \`<head>\`, \`<body>\`, or \`<style>\` tags. The output should be only the inner HTML content starting from <div class="resume-header">.
- Ensure the generated HTML is clean, well-formed, and ready for styling with the provided class names.
- Use the exact class names and structure as shown in the HTML example.

HTML Structure Example:

<div class="resume-header">
  <h1>CANDIDATE NAME</h1>
  <p class="job-title">WEB & GRAPHIC DESIGNER</p>
</div>

<div class="resume-body">
  <div class="resume-left-column">
    <section class="contact-section">
      <h2>CONTACT</h2>
      <ul>
        <li><span class="contact-label">Phone:</span> (555) 123-4567</li>
        <li><span class="contact-label">Email:</span> candidate.email@example.com</li>
        <li><span class="contact-label">Website:</span> www.candidatewebsite.com</li>
        <li><span class="contact-label">Address:</span> City, State, Zip</li>
      </ul>
    </section>

    <section class="education-section">
      <h2>EDUCATION</h2>
      <div>
        <h3>MASTER OF SCIENCE</h3>
        <p class="institution">University Name - City, Country</p>
        <p class="dates">YYYY - YYYY</p>
      </div>
      <div>
        <h3>BACHELOR OF SCIENCE</h3>
        <p class="institution">University Name - City, Country</p>
        <p class="dates">YYYY - YYYY</p>
      </div>
      <!-- Add more education entries if applicable -->
    </section>

    <section class="skills-section">
      <h2>SKILLS</h2>
      <!-- Create categories as <h3> and list skills as <li> -->
      <h3>Technical Skills</h3>
      <ul>
        <li>JavaScript</li>
        <li>React</li>
        <li>Node.js</li>
      </ul>
      <h3>Software</h3>
      <ul>
        <li>Photoshop</li>
        <li>Illustrator</li>
      </ul>
      <!-- Add more skill categories and skills as appropriate -->
    </section>
  </div>

  <div class="resume-right-column">
    <section class="profile-section">
      <h2>PROFILE</h2>
      <p>A highly motivated and results-oriented professional with X years of experience in... Briefly summarize key qualifications and career goals. Tailor this to the job description.</p>
    </section>

    <section class="experience-section">
      <h2>EXPERIENCE</h2>
      <div class="experience-entry">
        <p class="dates">Month YYYY – Present (or Month YYYY)</p>
        <h3>JOB TITLE</h3>
        <p class="company"><strong>Company Name</strong> - City, State</p>
        <ul>
          <li>Responsibility or achievement 1.</li>
          <li>Responsibility or achievement 2.</li>
          <li>Responsibility or achievement 3.</li>
        </ul>
      </div>
      <div class="experience-entry">
        <p class="dates">Month YYYY – Month YYYY</p>
        <h3>PREVIOUS JOB TITLE</h3>
        <p class="company"><strong>Previous Company Name</strong> - City, State</p>
        <ul>
          <li>Responsibility or achievement 1.</li>
          <li>Responsibility or achievement 2.</li>
        </ul>
      </div>
      <!-- Add more experience entries as applicable -->
    </section>
  </div>
</div>

Your output for the 'resume' field must be ONLY the HTML string itself, without any surrounding markdown like \`\`\`html ... \`\`\` or explanations.
Focus on accurate content generation based on user input and realistic placeholder details where needed, fitting them into the HTML structure above.
The job title in the header should be adapted based on the job description or user input if appropriate, otherwise use a relevant default.
Candidate Name should be generated.
Contact details like phone, email, website, address should be plausible placeholders if not provided by user.
Dates for education and experience should be plausible.
Company names and institutions should be realistic.
Profile section should be a concise summary.
Experience bullet points should be action-oriented.
Skills should be categorized.
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
