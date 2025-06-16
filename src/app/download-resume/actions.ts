
// src/app/download-resume/actions.ts
'use server';

import fs from 'fs';
import path from 'path';
import os from 'os';
// html-to-pdf is an older library and might have issues in serverless environments
// if PhantomJS (its dependency) is not available or configured.
const htmlToPdf = require('html-to-pdf');

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
  const tempDir = os.tmpdir();
  const uniqueId = Date.now();
  const tempHtmlPath = path.join(tempDir, `resume-html-${uniqueId}.html`);
  const tempPdfPath = path.join(tempDir, `resume-pdf-${uniqueId}.pdf`);

  try {
    await fs.promises.writeFile(tempHtmlPath, htmlToConvert, 'utf8');

    await new Promise<void>((resolve, reject) => {
      htmlToPdf.convertHTMLFile(
        tempHtmlPath,
        tempPdfPath,
        (error: any, successInfo: any) => {
          if (error) {
            console.error('html-to-pdf conversion error object:', error);
            if (error.message && error.message.toLowerCase().includes('phantomjs')) {
              reject(new Error('PDF Generation Failed: PhantomJS, a required component, was not found or failed. Please try HTML download.'));
            } else {
              reject(new Error(`PDF Generation Failed: Conversion error - ${error.message || 'Unknown error during conversion'}. Please try HTML download.`));
            }
          } else {
            if (fs.existsSync(tempPdfPath)) {
              resolve();
            } else {
              console.error('html-to-pdf reported success, but PDF file not found at:', tempPdfPath);
              console.error('html-to-pdf successInfo (if any):', successInfo);
              reject(new Error('PDF Generation Failed: Output file was not created by the converter. This often indicates an issue with PhantomJS, especially on platforms like Vercel. Please try HTML download.'));
            }
          }
        }
      );
    });

    const pdfBuffer = await fs.promises.readFile(tempPdfPath);
    const base64Pdf = pdfBuffer.toString('base64');

    return {
      success: true,
      data: base64Pdf,
      fileName: fileName,
    };
  } catch (error: any) {
    console.error('Error in generatePdfAction catch block:', error);
    let detailedErrorMessage = error.message || 'An unexpected error occurred during PDF generation.';
    if (error.code === 'ENOENT' && error.path === tempPdfPath) {
      detailedErrorMessage = `PDF Generation Failed: Could not find the generated PDF file. This usually means the conversion process itself failed (e.g., due to PhantomJS issues on the server). Please try HTML download.`;
    }
    return {
      success: false,
      error: detailedErrorMessage,
    };
  } finally {
    try {
      if (fs.existsSync(tempHtmlPath)) {
        await fs.promises.unlink(tempHtmlPath);
      }
      if (fs.existsSync(tempPdfPath)) {
        await fs.promises.unlink(tempPdfPath);
      }
    } catch (cleanupError) {
      console.error('Error cleaning up temporary files:', cleanupError);
    }
  }
}
