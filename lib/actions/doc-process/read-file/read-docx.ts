import { XMLParser } from 'fast-xml-parser';
import { extractTextFromParsedXml, findImageReferences } from './parse-office/parse-docx';
import AdmZip from 'adm-zip';

interface DocumentContent {
  text: string;
  images: { [id: string]: Buffer };
}

export default async function readDocx(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const zip = new AdmZip(buffer);
      const xmlParser = new XMLParser();
      const content: DocumentContent = { text: '', images: {} };

      // 解析主文档
      const documentXml = zip.getEntry('word/document.xml');
      if (documentXml) {
        const xmlContent = documentXml.getData().toString('utf8');
        const parsedXml = xmlParser.parse(xmlContent);

        // 提取文本（这里需要根据实际XML结构调整）
        content.text = extractTextFromParsedXml(parsedXml);

        // 查找图片引用
        const imageRefs = findImageReferences(parsedXml);

        // 提取图片
        imageRefs.forEach((ref) => {
          const imagePath = `word/${ref}`;
          const imageEntry = zip.getEntry(imagePath);
          if (imageEntry) {
            content.images[ref] = imageEntry.getData();
          }
        });
      }

      resolve(content.text);
    } catch (error) {
      reject(error);
    }
  });
}
