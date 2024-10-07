import { XMLParser } from 'fast-xml-parser';
import { extractTextFromSlide } from './parse-office/parse-pptx';
import AdmZip from 'adm-zip';

export default async function readPptx(buffer: Buffer): Promise<string> {
  const zip = new AdmZip(buffer);
  const xmlParser = new XMLParser({ ignoreAttributes: false });
  let text = '';

  // 读取 presentation.xml 获取幻灯片顺序
  const presentationEntry = zip.getEntry('ppt/presentation.xml');
  if (!presentationEntry) {
    throw new Error('无法读取 presentation.xml');
  }
  const presentationXml = presentationEntry.getData().toString('utf8');
  const presentation = xmlParser.parse(presentationXml);
  const slideIds = presentation['p:presentation']['p:sldIdLst']['p:sldId'];

  // 读取每个幻灯片的内容
  for (const slideId of slideIds) {
    const slideEntry = zip.getEntry(`ppt/slides/slide${slideId['@_r:id'].replace('rId', '')}.xml`);
    if (slideEntry) {
      const slideXml = slideEntry.getData().toString('utf8');
      const xmlParser = new XMLParser({ ignoreAttributes: false });
      const slide = xmlParser.parse(slideXml);
      const t = extractTextFromSlide(slide);
      if (t) {
        text += t + '\n\n';
      }
    }
  }

  return text.trim();
}
