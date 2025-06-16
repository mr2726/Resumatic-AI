
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useResumeContext } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, RotateCcw, CheckCircle, Loader2, Printer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const getResumeStyles = (): string => {
  // Styles optimized for A4 single-page PDF output
  return `
    body {
      font-family: 'Inter', Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #fff; 
      color: #333;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      width: 210mm; /* A4 width */
      height: 297mm; /* A4 height - optional, content should dictate */
    }

    .resume-container { /* Added a container for better control */
      max-width: 780px; /* Adjusted for A4, allowing for browser margins */
      margin: 15px auto; /* Reduced margin for print */
      background-color: #fff;
    }

    .resume-header {
      text-align: center;
      padding: 20px 10px; /* Reduced padding */
      background-color: #fff;
      border-bottom: 1px solid #ddd; /* Thinner border */
    }

    .resume-header h1 {
      font-family: 'Space Grotesk', Arial, sans-serif;
      font-size: 32px; /* Reduced font size */
      margin: 0;
      font-weight: bold;
      color: #222;
    }

    .resume-header .job-title {
      font-family: 'Inter', Arial, sans-serif;
      font-size: 16px; /* Reduced font size */
      color: #666;
      margin-top: 5px; /* Reduced margin */
    }

    .resume-body {
      display: flex;
      padding: 20px 10px; /* Reduced padding */
    }
    
    .resume-left-column, .resume-right-column {
      flex: 1;
      padding: 0 10px; /* Reduced padding */
    }

    .resume-left-column {
      border-right: 1px solid #ddd;
      padding-right: 15px; 
    }
     .resume-right-column {
      padding-left: 15px; 
    }


    .resume-body h2 { 
      font-family: 'Inter', Arial, sans-serif;
      font-size: 18px; /* Reduced font size */
      margin-top: 0;
      margin-bottom: 8px; /* Reduced margin */
      color: #333;
      border-bottom: 1px solid #ddd; /* Thinner border */
      padding-bottom: 3px; /* Reduced padding */
      font-weight: bold;
    }

    .resume-body h3 { 
      font-family: 'Inter', Arial, sans-serif;
      font-size: 14px; /* Reduced font size */
      margin: 5px 0; /* Reduced margin */
      color: #444;
      font-weight: bold;
    }

    .resume-body ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .resume-body ul li {
      margin: 2px 0; /* Reduced margin */
      font-size: 12px; /* Reduced font size */
      color: #555;
      line-height: 1.4; /* Adjusted line height */
    }

    .contact-label {
      font-weight: bold;
      color: #222;
    }

    .contact-section ul {
      margin-bottom: 10px; /* Add some space after contact list */
    }

    .profile-section p {
      font-size: 12px; /* Reduced font size */
      line-height: 1.5; /* Adjusted line height */
      color: #444;
      margin:0 0 10px 0;
    }

    .education-section > div {
        margin-bottom: 8px; /* Reduced margin */
    }
    .education-section .institution,
    .education-section .dates {
        font-size: 11px; /* Reduced font size */
        color: #555;
        margin: 1px 0; /* Reduced margin */
    }

    .experience-entry {
      margin-bottom: 15px; /* Reduced margin */
      page-break-inside: avoid;
    }

    .experience-entry .dates {
        font-size: 11px; /* Reduced font size */
        color: #666;
        margin-bottom: 1px; /* Reduced margin */
    }

    .experience-entry h3 { /* Job Title */
      margin: 2px 0; /* Reduced margin */
      font-size: 14px; /* Reduced font size */
      color: #333;
    }

    .experience-entry .company { 
      font-size: 12px; /* Reduced font size */
      color: #555;
      margin-bottom: 2px; /* Reduced margin */
    }
    .experience-entry .company strong {
        font-weight: bold;
        color: #333;
    }

    .experience-entry ul {
      margin: 4px 0 0 12px; /* Adjusted margin & indent */
      list-style: disc;
      padding-left: 5px; 
    }

    .experience-entry ul li {
      font-size: 12px; /* Reduced font size */
      line-height: 1.4; /* Adjusted line height */
      color: #444;
      margin-bottom: 2px; /* Reduced margin */
    }

    .resume-right-column .profile-section {
      margin-bottom: 15px; /* Reduced margin */
      page-break-inside: avoid;
    }
    
    .education-section, .skills-section, .contact-section {
        page-break-inside: avoid;
    }

    .skills-section h3 { /* Category */
      margin-top: 8px; /* Reduced margin */
      margin-bottom: 2px; /* Reduced margin */
      font-size: 14px; /* Reduced font size */
      color: #333;
    }
    .skills-section > h3:first-of-type {
        margin-top: 0;
    }

    .skills-section ul li {
      margin: 2px 0; /* Reduced margin */
      font-size: 12px; /* Reduced font size */
      color: #444;
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
  <div class="resume-container">
    ${generatedResumeHtml}
  </div>
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

  const printToPdf = () => {
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
      body { 
        margin: 0; 
        padding: 0; 
        background-color: #fff; 
        -webkit-print-color-adjust: exact; 
        print-color-adjust: exact;
      }
      .resume-container {
        margin: 0; /* Remove margins for print */
        box-shadow: none; /* Remove shadow for print */
      }
    }
  </style>
</head>
<body>
  <div class="resume-container">
    ${generatedResumeHtml}
  </div>
</body>
</html>`;

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.width = '0'; // Can be '100%' or a specific width for debugging layout
    iframe.style.height = '0'; // Can be '100vh' or a specific height for debugging layout
    iframe.style.border = 'none';
    iframe.style.visibility = 'hidden'; // Make it 'visible' for debugging layout issues
    // iframe.style.zIndex = '10000'; // For debugging, bring to front
    document.body.appendChild(iframe);

    iframe.contentDocument!.open();
    iframe.contentDocument!.write(fullHtmlForPdf);
    iframe.contentDocument!.close();

    const printAndRemove = () => {
      try {
        iframe.contentWindow!.focus(); 
        const printSuccessful = iframe.contentWindow!.document.execCommand('print', false, undefined);
        if (!printSuccessful) { // Fallback for browsers that don't return true/false or where execCommand fails for print
             iframe.contentWindow!.print();
        }
      } catch (e) {
        console.error("Error during printing:", e);
        // Fallback if execCommand is blocked or fails
        try {
            iframe.contentWindow!.print();
        } catch (e2) {
             console.error("Secondary print attempt failed:", e2);
             toast({
                title: "Print Error",
                description: "Could not open print dialog. Please try again or download as HTML.",
                variant: "destructive"
             });
        }
      } finally {
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 500); 
      }
    };
    
    // Ensure content is loaded before printing
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
                onClick={printToPdf} 
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

