"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useResumeContext } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { CreditCard, Loader2, CheckCircle } from 'lucide-react';
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
    // If already paid, redirect to download
    if (isPaid) {
      router.replace('/download-resume');
    }
  }, [generatedResumeHtml, isPaid, router]);

  const handlePayment = () => {
    setIsLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsPaid(true);
      setIsLoading(false);
      toast({
        title: "Payment Successful!",
        description: "Your resume is now unlocked.",
        action: <CheckCircle className="text-green-500" />,
      });
      router.push('/download-resume');
    }, 2000); // Simulate 2 second payment processing
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
            <CreditCard className="h-8 w-8 mr-3 text-primary" />
            Unlock Your Resume
          </CardTitle>
          <CardDescription className="text-lg">
            A one-time payment of <strong className="text-foreground">$9.99</strong> will grant you full access to download your professionally crafted resume.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">Order Summary</h3>
            <div className="flex justify-between items-center p-3 bg-muted rounded-md">
              <span>AI Generated Resume</span>
              <span className="font-bold text-foreground">$9.99</span>
            </div>
          </div>
          {/* Placeholder for actual payment form elements */}
          <div className="text-center p-4 border border-dashed rounded-md">
            <p className="text-muted-foreground">
              In a real application, a payment form (e.g., Stripe Elements) would be here.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            size="lg" 
            className="w-full font-semibold text-lg" 
            onClick={handlePayment}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing Payment...
              </>
            ) : (
              "Pay $9.99 & Download Resume"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
