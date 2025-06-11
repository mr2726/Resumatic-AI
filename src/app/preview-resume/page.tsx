"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useResumeContext } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Lock, Eye } from 'lucide-react';

export default function PreviewResumePage() {
  const router = useRouter();
  const { generatedResumeHtml, jobDescription, userInput, isPaid } = useResumeContext();

  useEffect(() => {
    if (!generatedResumeHtml && !isPaid) { // If no resume and not paid, redirect to create
      router.replace('/create-resume');
    }
  }, [generatedResumeHtml, isPaid, router]);
  
  // If already paid and somehow landed here, redirect to download
  useEffect(() => {
    if (isPaid && generatedResumeHtml) {
      router.replace('/download-resume');
    }
  }, [isPaid, generatedResumeHtml, router]);


  if (!generatedResumeHtml) {
    return (
      <div className="flex flex-col items-center justify-center text-center">
        <p className="text-lg text-muted-foreground">Loading resume or no resume generated...</p>
        <Link href="/create-resume">
          <Button variant="link">Create a new resume</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-3xl flex items-center">
            <Eye className="h-8 w-8 mr-3 text-primary" />
            Preview Your AI-Generated Resume
          </CardTitle>
          <CardDescription className="text-lg">
            Here's a preview of your professionally crafted resume. It's locked for now. Proceed to payment to unlock and download.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div 
            id="resume-preview-container" 
            className="border rounded-lg p-8 bg-white shadow-inner relative overflow-hidden min-h-[500px] aspect-[8.5/11]"
            style={{ 
              userSelect: 'none', 
              WebkitUserSelect: 'none', 
              MozUserSelect: 'none', 
              msUserSelect: 'none' 
            }}
          >
            <div 
              className="prose prose-sm max-w-none" // Using Tailwind Typography for basic styling of HTML
              dangerouslySetInnerHTML={{ __html: generatedResumeHtml }} 
            />
            <div 
              aria-hidden="true"
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{
                backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='100px' width='100px'><text x='0' y='50' fill='rgba(0,0,0,0.05)' font-size='18' transform='rotate(-30 50 50)'>Resumatic AI Preview</text></svg>\")",
                backgroundRepeat: 'repeat',
              }}
            >
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-4 pt-6">
          <p className="text-muted-foreground text-center">
            Your resume is ready! A small one-time payment unlocks the full version for download in HTML and PDF formats.
          </p>
          <Link href="/payment">
            <Button size="lg" className="font-semibold text-lg">
              <Lock className="mr-2 h-5 w-5" />
              Unlock & Proceed to Payment
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
