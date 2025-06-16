
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useResumeContext } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, FileSpreadsheet, RotateCcw, CheckCircle, Loader2, Printer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const getResumeStyles = (): string => {
  return `
    body {
      font-family: 'Inter', Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #fff; 
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
      margin: 20px auto; 
      max-width: 1000px; 
      background-color: #fff;
      padding: 30px; 
    }
    
    .resume-left-column, .resume-right-column {
      flex: 1;
      padding: 15px; 
    }

    .resume-left-column {
      border-right: 1px solid #ddd;
      padding-right: 25px; 
    }
     .resume-right-column {
      padding-left: 25px; 
    }


    .resume-body h2 { 
      font-family: 'Inter', Arial, sans-serif;
      font-size: 22px; 
      margin-top: 0;
      margin-bottom: 12px;
      color: #333;
      border-bottom: 2px solid #ddd;
      padding-bottom: 4px;
      font-weight: bold;
    }

    .resume-body h3 { 
      font-family: 'Inter', Arial, sans-serif;
      font-size: 17px; 
      margin: 8px 0;
      color: #444;
      font-weight: bold;
    }

    .resume-body ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .resume-body ul li {
      margin: 4px 0;
      font-size: 15px; 
      color: #555;
      line-height: 1.5;
    }

    .contact-label {
      font-weight: bold;
      color: #222;
    }

    .profile-section p {
      font-size: 15px; 
      line-height: 1.7;
      color: #444;
      margin:0;
    }

    .education-section > div {
        margin-bottom: 12px;
    }
    .education-section .institution,
    .education-section .dates {
        font-size: 12px; 
        color: #555;
        margin: 2px 0;
    }

    .experience-entry {
      margin-bottom: 25px;
    }

    .experience-entry .dates {
        font-size: 12px; 
        color: #666;
        margin-bottom: 2px;
    }

    .experience-entry h3 { 
      margin: 4px 0;
      font-size: 17px; 
      color: #333;
    }

    .experience-entry .company { 
      font-size: 13px; 
      color: #555;
      margin-bottom: 4px;
    }
    .experience-entry .company strong {
        font-weight: bold;
        color: #333;
    }

    .experience-entry ul {
      margin: 8px 0 0 15px;
      list-style: disc;
      padding-left: 5px; 
    }

    .experience-entry ul li {
      font-size: 15px; 
      line-height: 1.5;
      color: #444;
      margin-bottom: 3px;
    }

    .resume-right-column .profile-section {
      margin-bottom: 25px;
    }

    .skills-section h3 { 
      margin-top: 15px;
      margin-bottom: 4px;
      font-size: 17px; 
      color: #333;
    }
    .skills-section > h3:first-of-type {
        margin-top: 0;
    }

    .skills-section ul li {
      margin: 4px 0;
      font-size: 15px; 
      color: #444;
    }
    
    .experience-entry, .education-section > div, .skills-section {
        page-break-inside: avoid;
    }
    `;
};


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

  const downloadPdf = () => {
    if (!generatedResumeHtml) {
      toast({ title: "Error", description: "No resume content to generate PDF.", variant: "destructive" });
      return;
    }

    toast({ title: "Preparing PDF...", description: "Your browser's print dialog will open. Please select 'Save as PDF'." });

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
  <style>
    ${getResumeStyles()}
    @media print {
      body { margin: 0; padding: 0; background-color: #fff; } /* Ensure no extra margins from browser */
    }
  </style>
</head>
<body>
  ${generatedResumeHtml}
</body>
</html>`;

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    iframe.style.visibility = 'hidden'; 
    document.body.appendChild(iframe);

    iframe.contentDocument!.open();
    iframe.contentDocument!.write(fullHtmlForPdf);
    iframe.contentDocument!.close();

    const printAndRemove = () => {
      try {
        iframe.contentWindow!.focus(); // Focus on iframe before printing
        iframe.contentWindow!.print();
      } catch (e) {
        console.error("Error during printing:", e);
        toast({
          title: "Print Error",
          description: "Could not open print dialog. Please try again or download as HTML.",
          variant: "destructive"
        });
      } finally {
         // Use setTimeout to ensure print dialog has time to process
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 500); // 500ms delay, adjust if needed
      }
    };
    
    // Ensure content is loaded before printing, especially for images or external resources if any
    if (iframe.contentWindow && iframe.contentWindow.document.readyState === 'complete') {
      printAndRemove();
    } else {
       iframe.onload = printAndRemove;
    }
  };

  const handleStartOver = () => {
    resetContext();
    router.push('/');
  };

  if (!isPaid || !generatedResumeHtml) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
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
          <div className="p-6 border rounded-lg bg-muted/20 dark:bg-muted/50">
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
              >
                <Printer className="mr-2 h-5 w-5" /> Print to PDF
              </Button>
            </div>
             <p className="text-sm text-muted-foreground mt-3">For PDF, your browser's print dialog will appear. Choose "Save as PDF".</p>
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
