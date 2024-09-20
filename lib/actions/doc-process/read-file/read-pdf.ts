import PDFParser from 'pdf2json';

export default function readPdf(content: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on('pdfParser_dataError', (errData: any) => reject(errData.parserError));
    pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
      let text = '';
      for (let page of pdfData.Pages) {
        for (let textItem of page.Texts) {
          text += decodeURIComponent(textItem.R[0].T) + ' ';
        }
        text += '\n\n'; // 添加页面分隔符
      }
      resolve(text.trim());
    });

    pdfParser.parseBuffer(content);
  });
}
