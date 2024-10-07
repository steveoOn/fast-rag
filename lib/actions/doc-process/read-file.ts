import { FileLoaded, FileRead } from '@/types';
import { document_type } from '@/lib/db/schema/schema';
import { chunkDocumentByParagraph } from './chunks';
import readTxt from './read-file/read-txt';
import readPdf from './read-file/read-pdf';
import readDocx from './read-file/read-docx';
import readPptx from './read-file/read-pptx';

const readFileMap: Partial<
  Record<(typeof document_type.enumValues)[number], (content: Buffer) => Promise<string>>
> = {
  txt: readTxt,
  pdf: readPdf,
  docx: readDocx,
  pptx: readPptx,
};

export async function readFile(file: FileLoaded): Promise<FileRead> {
  const { type, content } = file;
  const readFunction = readFileMap[type];
  if (!readFunction) {
    throw new Error(`不支持的文件类型: ${type}`);
  }
  // 将 ArrayBuffer 转换为 Buffer
  const buffer = Buffer.from(content);
  const text = await readFunction(buffer);
  const chunks = chunkDocumentByParagraph(text, {
    chunkOverlap: 200,
    chunkSize: 1000,
  });

  return {
    ...file,
    text,
    chunks,
  };
}
