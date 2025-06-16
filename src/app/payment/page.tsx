
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useResumeContext } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { CreditCard, Loader2, CheckCircle, Download } from 'lucide-react'; // Added Download
import { useToast } from '@/hooks/use-toast';

export default function PaymentPage() {
  const router = useRouter();
  const { setIsPaid, generatedResumeHtml, isPaid } = useResumeContext();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // If no resume content, redirect to create page
    if (!generatedResumeHtml) {
      router.replace('/create-resume');
    }
    // If already "paid" (unlocked), redirect to download
    if (isPaid) {
      router.replace('/download-resume');
    }
  }, [generatedResumeHtml, isPaid, router]);

  const handleFreeUnlock = () => {
    setIsLoading(true);
    // Simulate unlocking process
    setTimeout(() => {
      setIsPaid(true);
      setIsLoading(false);
      toast({
        title: "Resume Unlocked!",
        description: "Your resume is now ready for download.",
        action: <CheckCircle className="text-green-500" />,
      });
      router.push('/download-resume');
    }, 1000); // Simulate 1 second unlock
  };
  
  if (!generatedResumeHtml || isPaid) {
     return (
      <div className="flex flex-col items-center justify-center text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Loading or redirecting...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-3xl flex items-center">
            <Download className="h-8 w-8 mr-3 text-primary" /> {/* Changed Icon */}
            Get Your Free Resume
          </CardTitle>
          <CardDescription className="text-lg">
            Your professionally crafted resume is ready. Unlock it now for free to download.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">Summary</h3>
            <div className="flex justify-between items-center p-3 bg-muted rounded-md">
              <span>AI Generated Resume</span>
              <span className="font-bold text-foreground">Free</span>
            </div>
          </div>
          <div className="text-center p-4 border border-dashed rounded-md">
            <p className="text-muted-foreground">
              Click the button below to unlock and download your resume.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            size="lg" 
            className="w-full font-semibold text-lg" 
            onClick={handleFreeUnlock}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Unlocking...
              </>
            ) : (
              "Get Free Resume & Download"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
