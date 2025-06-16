
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useResumeContext } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, RotateCcw, CheckCircle, Loader2, DownloadCloud } from 'lucide-react'; // Changed Printer to DownloadCloud
import { useToast } from '@/hooks/use-toast';
import html2pdf from 'html2pdf.js';

const getResumeStyles = (): string => {
  // Styles optimized for A4 single-page PDF output
  // Ensure these styles make the content fit on one A4 page.
  return `
    body {
      font-family: 'Inter', Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #fff; 
      color: #333;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      /* width: 210mm; A4 width - html2pdf.js handles this with format:'a4' */
      /* height: 297mm; A4 height - optional, content should dictate */
    }

    .resume-container { 
      width: 100%; /* Use 100% width for html2pdf content element */
      max-width: 190mm; /* Approx A4 width minus some margin, adjust as needed */
      margin: 10mm auto; /* Centering for A4, adjust as needed */
      background-color: #fff;
      box-sizing: border-box;
    }

    .resume-header {
      text-align: center;
      padding: 15px 5px; /* Reduced padding */
      background-color: #fff;
      border-bottom: 1px solid #ddd; /* Thinner border */
    }

    .resume-header h1 {
      font-family: 'Space Grotesk', Arial, sans-serif;
      font-size: 28px; /* Reduced font size */
      margin: 0;
      font-weight: bold;
      color: #222;
    }

    .resume-header .job-title {
      font-family: 'Inter', Arial, sans-serif;
      font-size: 14px; /* Reduced font size */
      color: #666;
      margin-top: 4px; /* Reduced margin */
    }

    .resume-body {
      display: flex;
      padding: 15px 5px; /* Reduced padding */
    }
    
    .resume-left-column, .resume-right-column {
      flex: 1;
      padding: 0 8px; /* Reduced padding */
    }

    .resume-left-column {
      border-right: 1px solid #ddd;
      padding-right: 12px; 
    }
     .resume-right-column {
      padding-left: 12px; 
    }


    .resume-body h2 { 
      font-family: 'Inter', Arial, sans-serif;
      font-size: 16px; /* Reduced font size */
      margin-top: 0;
      margin-bottom: 6px; /* Reduced margin */
      color: #333;
      border-bottom: 1px solid #ddd; /* Thinner border */
      padding-bottom: 2px; /* Reduced padding */
      font-weight: bold;
    }

    .resume-body h3 { 
      font-family: 'Inter', Arial, sans-serif;
      font-size: 13px; /* Reduced font size */
      margin: 4px 0; /* Reduced margin */
      color: #444;
      font-weight: bold;
    }

    .resume-body ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .resume-body ul li {
      margin: 1px 0; /* Reduced margin */
      font-size: 11px; /* Reduced font size */
      color: #555;
      line-height: 1.3; /* Adjusted line height */
    }

    .contact-label {
      font-weight: bold;
      color: #222;
    }

    .contact-section ul {
      margin-bottom: 8px; /* Add some space after contact list */
    }

    .profile-section p {
      font-size: 11px; /* Reduced font size */
      line-height: 1.4; /* Adjusted line height */
      color: #444;
      margin:0 0 8px 0;
    }

    .education-section > div {
        margin-bottom: 6px; /* Reduced margin */
    }
    .education-section .institution,
    .education-section .dates {
        font-size: 10px; /* Reduced font size */
        color: #555;
        margin: 1px 0; /* Reduced margin */
    }

    .experience-entry {
      margin-bottom: 12px; /* Reduced margin */
    }

    .experience-entry .dates {
        font-size: 10px; /* Reduced font size */
        color: #666;
        margin-bottom: 1px; /* Reduced margin */
    }

    .experience-entry h3 { /* Job Title */
      margin: 1px 0; /* Reduced margin */
      font-size: 13px; /* Reduced font size */
      color: #333;
    }

    .experience-entry .company { 
      font-size: 11px; /* Reduced font size */
      color: #555;
      margin-bottom: 1px; /* Reduced margin */
    }
    .experience-entry .company strong {
        font-weight: bold;
        color: #333;
    }

    .experience-entry ul {
      margin: 3px 0 0 10px; /* Adjusted margin & indent */
      list-style: disc;
      padding-left: 4px; 
    }

    .experience-entry ul li {
      font-size: 11px; /* Reduced font size */
      line-height: 1.3; /* Adjusted line height */
      color: #444;
      margin-bottom: 1px; /* Reduced margin */
    }

    .resume-right-column .profile-section {
      margin-bottom: 12px; /* Reduced margin */
    }
    
    .skills-section h3 { /* Category */
      margin-top: 6px; /* Reduced margin */
      margin-bottom: 1px; /* Reduced margin */
      font-size: 13px; /* Reduced font size */
      color: #333;
    }
    .skills-section > h3:first-of-type {
        margin-top: 0;
    }

    .skills-section ul li {
      margin: 1px 0; /* Reduced margin */
      font-size: 11px; /* Reduced font size */
      color: #444;
    }

    /* Ensure page breaks are avoided within these sections if content is too long */
    .education-section, .skills-section, .contact-section, .experience-entry, .profile-section {
        page-break-inside: avoid;
    }
    `;
};


export default function DownloadResumePage() {
  const router = useRouter();
  const { generatedResumeHtml, isPaid, resetContext } = useResumeContext();
  const [isPdfLoading, setIsPdfLoading] = useState(false);
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

  const downloadPdfDirectly = async () => {
    if (!generatedResumeHtml) {
      toast({ title: "Error", description: "No resume content to generate PDF.", variant: "destructive" });
      return;
    }
    setIsPdfLoading(true);
    toast({ title: "Generating PDF...", description: "This may take a few moments." });

    const styles = getResumeStyles();
    const fullHtmlForPdf = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
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
    
    const options = {
      margin: 0, // CSS handles margins via .resume-container
      filename: 'Resumatic_AI_Resume.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'avoid-all'] } // 'avoid-all' tries to prevent elements from breaking, 'css' respects CSS break rules
    };

    try {
      // html2pdf.js uses Promises
      await html2pdf().from(fullHtmlForPdf).set(options).save();
      toast({ title: "PDF Downloaded", description: "Your resume PDF has been downloaded." });
    } catch (error) {
      console.error("Error generating PDF with html2pdf.js:", error);
      toast({
        title: "PDF Generation Failed",
        description: "Could not generate PDF. Please try downloading as HTML or try again.",
        variant: "destructive"
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
                onClick={downloadPdfDirectly} 
                size="lg" 
                variant="outline" 
                className="flex-1"
                disabled={isPdfLoading}
              >
                {isPdfLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating PDF...
                  </>
                ) : (
                  <>
                    <DownloadCloud className="mr-2 h-5 w-5" /> Download as PDF
                  </>
                )}
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

