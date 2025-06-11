"use server";

import { generateResume, type GenerateResumeInput } from "@/ai/flows/generate-resume";
import { z } from "zod";

const ResumeFormSchema = z.object({
  jobDescription: z.string().min(50, { message: "Job description must be at least 50 characters." }),
  userInput: z.string().min(20, { message: "Your information must be at least 20 characters." }),
});

export interface ActionResponseState {
  message?: string;
  fields?: Record<string, string>;
  issues?: string[];
  resume?: string;
  success: boolean;
}

export async function submitResumeForm(
  prevState: ActionResponseState | undefined,
  formData: FormData
): Promise<ActionResponseState> {
  const jobDescription = formData.get("jobDescription") as string;
  const userInput = formData.get("userInput") as string;

  const validatedFields = ResumeFormSchema.safeParse({
    jobDescription,
    userInput,
  });

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    const issues = Object.values(fieldErrors).flat();
    return {
      success: false,
      message: "Invalid form data.",
      fields: { jobDescription, userInput },
      issues: issues.length > 0 ? issues : undefined,
    };
  }

  try {
    const aiInput: GenerateResumeInput = { 
      jobDescription: validatedFields.data.jobDescription, 
      userInput: validatedFields.data.userInput 
    };
    const result = await generateResume(aiInput);
    
    if (result && result.resume) {
      return { 
        success: true, 
        resume: result.resume, 
        message: "Resume generated successfully!" 
      };
    } else {
      return { 
        success: false, 
        message: "AI failed to generate resume. Please try again.",
        fields: { jobDescription, userInput },
      };
    }
  } catch (error) {
    console.error("Error generating resume:", error);
    return { 
      success: false, 
      message: "An unexpected error occurred. Please try again.",
      fields: { jobDescription, userInput },
    };
  }
}
