import { FileLoaded, FileRead } from '@/types';
import { chunkDocumentByParagraph } from './chunks';
import readTxt from './read-file/read-txt';
import readPdf from './read-file/read-pdf';

const readFileMap = {
  txt: readTxt,
  pdf: readPdf,
};

export async function readFile(file: FileLoaded): Promise<FileRead> {
  const { type, content } = file;
  // @ts-ignore
  const text = await readFileMap[type](content);
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
