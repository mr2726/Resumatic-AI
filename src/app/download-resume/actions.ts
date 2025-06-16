
// src/app/download-resume/actions.ts
'use server';

import puppeteer from 'puppeteer';

interface PdfGenerationResponse {
  success: boolean;
  data?: string; // Base64 encoded PDF
  error?: string;
  fileName?: string;
}

export async function generatePdfAction(
  htmlToConvert: string,
  fileName: string = 'Resumatic_AI_Resume.pdf'
): Promise<PdfGenerationResponse> {
  let browser;
  try {
    // Launch Puppeteer.
    // The 'args' are important for running in restricted environments like Vercel.
    browser = await puppeteer.launch({
      headless: true, // Ensure headless is true for server environments
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });
    const page = await browser.newPage();

    // Set the HTML content for the page.
    // waitUntil: 'networkidle0' can help ensure all resources (like fonts from Google) are loaded.
    await page.setContent(htmlToConvert, { waitUntil: 'networkidle0' });
    
    // Generate PDF.
    // We can specify format, margins, etc.
    // 'A4' is a common paper size.
    // printBackground: true ensures that background colors and images are included.
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm',
      },
    });

    await browser.close();
    browser = null; // Ensure browser is nullified after closing

    const base64Pdf = pdfBuffer.toString('base64');

    return {
      success: true,
      data: base64Pdf,
      fileName: fileName,
    };
  } catch (error: any) {
    console.error('Error in generatePdfAction (Puppeteer):', error);
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error('Error closing browser after an error:', closeError);
      }
    }
    return {
      success: false,
      error: `PDF Generation Failed: ${error.message || 'An unexpected error occurred during PDF generation using Puppeteer. Please try HTML download.'}`,
    };
  }
}
