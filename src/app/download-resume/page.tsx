"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useResumeContext } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText, FileSpreadsheet, RotateCcw, CheckCircle } from 'lucide-react'; // Using FileSpreadsheet as a placeholder for PDF icon
import { useToast } from '@/hooks/use-toast';

export default function DownloadResumePage() {
  const router = useRouter();
  const { generatedResumeHtml, isPaid, resetContext } = useResumeContext();
  const { toast } = useToast();

  useEffect(() => {
    if (!isPaid) {
      toast({
        title: "Access Denied",
        description: "Payment required to access this page.",
        variant: "destructive",
      });
      router.replace('/payment');
    } else if (!generatedResumeHtml) {
      toast({
        title: "No Resume Found",
        description: "Please generate a resume first.",
        variant: "destructive",
      });
      router.replace('/create-resume');
    }
  }, [isPaid, generatedResumeHtml, router, toast]);

  const downloadHtml = () => {
    if (!generatedResumeHtml) return;
    const blob = new Blob([`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>My Resume</title><style>body{font-family: Arial, sans-serif; margin: 20px; line-height: 1.6;} h1,h2,h3{margin-bottom: 0.5em;} ul{padding-left: 20px; margin-bottom: 1em;} p{margin-bottom:1em;}</style></head><body>${generatedResumeHtml}</body></html>`], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Resumatic_AI_Resume.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    toast({ title: "Download Started", description: "Your HTML resume is downloading." });
  };

  const downloadPdf = () => {
    // Placeholder for actual PDF generation
    toast({
      title: "PDF Download (Placeholder)",
      description: "In a full application, this would download a PDF version of your resume. For now, please use the HTML version.",
      variant: "default",
      duration: 5000,
    });
  };

  const handleStartOver = () => {
    resetContext();
    router.push('/');
  };

  if (!isPaid || !generatedResumeHtml) {
    return (
      <div className="flex flex-col items-center justify-center text-center">
        <p className="text-lg text-muted-foreground">Verifying access or loading resume...</p>
         <Link href="/create-resume">
          <Button variant="link" className="mt-4">Go to Resume Creator</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <Card className="shadow-xl text-center">
        <CardHeader>
           <div className="flex justify-center mb-4">
             <CheckCircle className="h-16 w-16 text-green-500" />
           </div>
          <CardTitle className="font-headline text-3xl">
            Congratulations! Your Resume is Ready!
          </CardTitle>
          <CardDescription className="text-lg">
            Thank you for using Resumatic AI. You can now download your professionally crafted resume.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-6 border rounded-lg bg-background">
            <h3 className="font-semibold text-xl mb-4 text-foreground">Download Options</h3>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button onClick={downloadHtml} size="lg" className="flex-1">
                <FileText className="mr-2 h-5 w-5" /> Download as HTML
              </Button>
              <Button onClick={downloadPdf} size="lg" variant="outline" className="flex-1">
                <FileSpreadsheet className="mr-2 h-5 w-5" /> Download as PDF
              </Button>
            </div>
          </div>
          
          <div className="mt-8">
            <p className="text-muted-foreground mb-2">Want to create another resume or start over?</p>
            <Button onClick={handleStartOver} variant="secondary">
              <RotateCcw className="mr-2 h-5 w-5" /> Start Over
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
