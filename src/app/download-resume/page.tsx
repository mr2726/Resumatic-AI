
"use client";

import { useEffect, useState } from 'react'; // Added useState
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useResumeContext } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText, FileSpreadsheet, RotateCcw, CheckCircle, Loader2 } from 'lucide-react'; // Added Loader2
import { useToast } from '@/hooks/use-toast';
import { generatePdfAction } from './actions'; // Added import for server action

const getResumeStyles = (): string => {
  // Styles extracted for reuse in HTML and PDF generation
  return `
    body {
      font-family: 'Inter', Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #eaeaea;
      color: #333;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .resume-header {
      text-align: center;
      padding: 40px 20px;
      background-color: #fff;
      border-bottom: 2px solid #ddd;
    }

    .resume-header h1 {
      font-family: 'Space Grotesk', Arial, sans-serif;
      font-size: 48px;
      margin: 0;
      font-weight: bold;
      color: #222;
    }

    .resume-header .job-title {
      font-family: 'Inter', Arial, sans-serif;
      font-size: 20px;
      color: #666;
      margin-top: 10px;
    }

    .resume-body {
      display: flex;
      margin: 40px auto; /* Keep original margin for HTML viewing */
      max-width: 1200px;
      background-color: #fff;
      padding: 40px;
      border-radius: 10px; /* Keep for HTML viewing */
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Keep for HTML viewing */
    }
    
    /* PDF specific tweaks - these might be overridden by html-to-pdf if it doesn't process media queries well */
    @media print {
      body {
        background-color: #fff; /* White background for printing */
      }
      .resume-body {
        margin: 20px auto;
        max-width: 1000px; /* Adjust for A4/Letter */
        padding: 30px;
        border-radius: 0;
        box-shadow: none;
      }
    }


    .resume-left-column, .resume-right-column {
      flex: 1;
      padding: 20px;
    }

    .resume-left-column {
      border-right: 1px solid #ddd;
    }

    /* Targeting h2 specifically inside .resume-body for better scoping, affects generated HTML */
    .resume-body h2 { 
      font-family: 'Inter', Arial, sans-serif;
      font-size: 24px;
      margin-top: 0;
      margin-bottom: 15px;
      color: #333;
      border-bottom: 2px solid #ddd;
      padding-bottom: 5px;
      font-weight: bold;
    }

    /* Targeting h3 specifically inside .resume-body */
    .resume-body h3 { 
      font-family: 'Inter', Arial, sans-serif;
      font-size: 18px;
      margin: 10px 0;
      color: #444;
      font-weight: bold;
    }

    .resume-body ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .resume-body ul li {
      margin: 5px 0;
      font-size: 16px;
      color: #555;
      line-height: 1.6;
    }

    .contact-label {
      font-weight: bold;
      color: #222;
    }

    .profile-section p {
      font-size: 16px;
      line-height: 1.8;
      color: #444;
      margin:0;
    }

    .education-section > div {
        margin-bottom: 15px;
    }
    .education-section .institution,
    .education-section .dates {
        font-size: 13px;
        color: #555;
        margin: 2px 0;
    }

    .experience-entry {
      margin-bottom: 30px;
    }

    .experience-entry .dates {
        font-size: 13px;
        color: #666;
        margin-bottom: 2px;
    }

    .experience-entry h3 { /* Job Title in experience */
      margin: 5px 0;
      font-size: 18px;
      color: #333;
    }

    .experience-entry .company { /* Company Name and Location */
      font-size: 14px;
      color: #555;
      margin-bottom: 5px;
    }
    .experience-entry .company strong {
        font-weight: bold;
        color: #333;
    }

    .experience-entry ul {
      margin: 10px 0 0 15px;
      list-style: disc;
      padding-left: 5px; 
    }

    .experience-entry ul li {
      font-size: 16px;
      line-height: 1.6;
      color: #444;
      margin-bottom: 3px;
    }

    .resume-right-column .profile-section {
      margin-bottom: 30px;
    }

    .skills-section h3 { /* Category like "Technical Skills" */
      margin-top: 20px;
      margin-bottom: 5px;
      font-size: 18px;
      color: #333;
    }
    .skills-section > h3:first-of-type {
        margin-top: 0;
    }

    .skills-section ul li {
      margin: 5px 0;
      font-size: 16px;
      color: #444;
    }
    `;
};


export default function DownloadResumePage() {
  const router = useRouter();
  const { generatedResumeHtml, isPaid, resetContext } = useResumeContext();
  const { toast } = useToast();
  const [isPdfLoading, setIsPdfLoading] = useState(false);

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

    const styles = getResumeStyles();
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Resume</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
  <style>${styles}</style>
</head>
<body>
  ${generatedResumeHtml}
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Resumatic_AI_Resume.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    toast({ title: "Download Started", description: "Your HTML resume is downloading." });
  };

  const downloadPdf = async () => {
    if (!generatedResumeHtml) {
      toast({ title: "Error", description: "No resume content to generate PDF.", variant: "destructive" });
      return;
    }
    if (isPdfLoading) return;

    setIsPdfLoading(true);
    toast({ title: "Generating PDF...", description: "Please wait a moment. This can take up to 30 seconds." });
    
    const fullHtmlForPdf = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Resume</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
  <style>${getResumeStyles()}</style>
</head>
<body>
  ${generatedResumeHtml}
</body>
</html>`;

    try {
      const result = await generatePdfAction(fullHtmlForPdf, 'Resumatic_AI_Resume.pdf');

      if (result.success && result.data && result.fileName) {
        const byteCharacters = atob(result.data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = result.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        toast({ title: "Success!", description: "Your PDF resume has been downloaded." });
      } else {
        toast({
          title: "PDF Generation Failed",
          description: result.error || "Could not generate PDF. The server might be busy or an error occurred. Please try HTML download or try again later.",
          variant: "destructive",
          duration: 7000,
        });
      }
    } catch (error) {
      console.error("Error calling generatePdfAction:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while generating the PDF.",
        variant: "destructive",
      });
    } finally {
      setIsPdfLoading(false);
    }
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
              <Button 
                onClick={downloadPdf} 
                size="lg" 
                variant="outline" 
                className="flex-1"
                disabled={isPdfLoading}
              >
                {isPdfLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <FileSpreadsheet className="mr-2 h-5 w-5" />}
                {isPdfLoading ? "Generating PDF..." : "Download as PDF"}
              </Button>
            </div>
             {isPdfLoading && <p className="text-sm text-muted-foreground mt-3">PDF generation can take up to 30 seconds.</p>}
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
