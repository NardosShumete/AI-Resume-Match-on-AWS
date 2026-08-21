import type { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api';

export const renderPdfPreview = async (pdf: PDFDocumentProxy): Promise<string | null> => {
  try {
    const page = await pdf.getPage(1);
    
    // Use a reasonable scale to maintain quality without creating a massive image
    const viewport = page.getViewport({ scale: 1.5 });
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) {
      console.error('Canvas 2D context not supported');
      return null;
    }
    
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    const renderContext: any = {
      canvasContext: context,
      viewport: viewport,
    };
    
    await page.render(renderContext).promise;
    
    // Compress slightly for memory efficiency
    return canvas.toDataURL('image/jpeg', 0.8);
  } catch (error) {
    console.error('Failed to render PDF preview:', error);
    return null;
  }
};
