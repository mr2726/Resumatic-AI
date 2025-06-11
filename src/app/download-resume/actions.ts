
// src/app/download-resume/actions.ts
'use server';

import fs from 'fs';
import path from 'path';
import os from 'os';
// Предполагается, что библиотека html-to-pdf доступна через require
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
        (error: any, success: any) => {
          if (error) {
            console.error('html-to-pdf conversion error:', error);
            // Попытка предоставить более подробную ошибку, если PhantomJS отсутствует
            if (error.message && error.message.includes('PhantomJS not found')) {
                reject(new Error('Failed to convert HTML to PDF. PhantomJS might be missing on the server.'));
            } else {
                reject(new Error('Failed to convert HTML to PDF. Check server logs for details.'));
            }
          } else {
            resolve();
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
    console.error('Error in generatePdfAction:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred during PDF generation.',
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
