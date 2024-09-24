import PDFParser from 'pdf2json';

interface PDFData {
  Pages: Array<{
    Texts: Array<{
      R: Array<{ T: string }>;
    }>;
  }>;
}

export default function readPdf(content: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on('pdfParser_dataError', (errData: unknown) => reject(errData));
    pdfParser.on('pdfParser_dataReady', (pdfData: unknown) => {
      let text = '';
      for (const page of (pdfData as PDFData).Pages) {
        for (const textItem of page.Texts) {
          text += decodeURIComponent(textItem.R[0].T) + ' ';
        }
        text += '\n\n'; // 添加页面分隔符
      }
      resolve(text.trim());
    });

    pdfParser.parseBuffer(content);
  });
}
