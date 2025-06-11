
"use client";

import { useEffect, useRef } from 'react';
import { useActionState } from 'react'; // Changed from 'react-dom' and renamed
import { useRouter } from 'next/navigation';
import { useResumeContext } from '@/contexts/ResumeContext';
import { submitResumeForm, type ActionResponseState } from './actions';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, AlertCircle } from 'lucide-react';
import { SubmitButton } from '@/components/SubmitButton';

const initialState: ActionResponseState = {
  success: false,
  message: '',
};

export default function CreateResumePage() {
  const router = useRouter();
  const { setJobDescription, setUserInput, setGeneratedResumeHtml } = useResumeContext();
  const [state, formAction] = useActionState(submitResumeForm, initialState); // Changed from useFormState
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success && state.resume) {
      toast({
        title: "Success!",
        description: state.message || "Resume generated successfully.",
      });
      // Retrieve values from form fields because state.fields might not be populated on successful AI call
      const formData = new FormData(formRef.current!);
      setJobDescription(formData.get('jobDescription') as string);
      setUserInput(formData.get('userInput') as string);
      setGeneratedResumeHtml(state.resume);
      router.push('/preview-resume');
    } else if (!state?.success && state?.message && state.message !== "Invalid form data.") { // Show specific error toasts
      toast({
        title: "Error",
        description: state.message,
        variant: "destructive",
      });
    } else if (!state?.success && state?.issues && state.issues.length > 0) { // Show validation error toasts
       state.issues.forEach(issue => {
        toast({
          title: "Validation Error",
          description: issue,
          variant: "destructive",
        });
      });
    }
  }, [state, router, setJobDescription, setUserInput, setGeneratedResumeHtml, toast]);

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-3xl flex items-center">
            <Sparkles className="h-8 w-8 mr-3 text-accent" />
            Create Your AI-Powered Resume
          </CardTitle>
          <CardDescription className="text-lg">
            Provide the job description and some information about yourself. Our AI will do the rest!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={formRef} action={formAction} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="jobDescription" className="text-lg font-semibold">Job Description</Label>
              <Textarea
                id="jobDescription"
                name="jobDescription"
                placeholder="Paste the full job description here..."
                rows={10}
                required
                className="text-base"
                defaultValue={state?.fields?.jobDescription || ""}
              />
              {state?.issues && state.fields?.jobDescription === undefined && // General error for jobDescription if not specific
                state.issues.some(issue => issue.toLowerCase().includes('job')) && (
                <p className="text-sm text-destructive flex items-center mt-1">
                  <AlertCircle className="h-4 w-4 mr-1" /> Please provide a valid job description.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="userInput" className="text-lg font-semibold">About Yourself</Label>
              <Textarea
                id="userInput"
                name="userInput"
                placeholder="Tell us about your skills, interests, relevant experiences, or even a rough draft of your current resume..."
                rows={10}
                required
                className="text-base"
                defaultValue={state?.fields?.userInput || ""}
              />
               {state?.issues && state.fields?.userInput === undefined && // General error for userInput if not specific
                state.issues.some(issue => issue.toLowerCase().includes('your information') || issue.toLowerCase().includes('user input')) && (
                <p className="text-sm text-destructive flex items-center mt-1">
                  <AlertCircle className="h-4 w-4 mr-1" /> Please tell us something about yourself.
                </p>
              )}
            </div>
            
            <SubmitButton className="w-full text-lg py-3" pendingText="Generating Your Resume...">
              Generate Resume
            </SubmitButton>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
