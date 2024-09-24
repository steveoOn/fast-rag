import { Chunk, ChunkOptions, Paragraph } from '@/types/doc-process';

/**
 * 将文档按段落分割，并创建包含前后重叠部分的文本块
 * @param text 要分割的文本
 * @param chunkOverlap 块之间的重叠部分
 * @param chunkSize 块的大小
 * @returns 包含块的数组
 */
export function chunkDocumentByParagraph(text: string, { chunkOverlap }: ChunkOptions): Chunk[] {
  // 按段落分割文本
  const paragraphs: Array<Paragraph> = text.split(/\n\s*\n/).reduce((acc, paragraph, index) => {
    const start = index === 0 ? 0 : acc[index - 1].end + 2;
    const size = paragraph.length;
    if (paragraph.trim()) {
      acc.push({
        content: paragraph,
        size,
        start,
        end: start + size,
      });
    }
    return acc;
  }, [] as Paragraph[]);

  const chunks: Chunk[] = [];

  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i];
    let chunkContent = paragraph.content;
    const metadata = {
      start: paragraph.start,
      end: paragraph.end,
      size: paragraph.size,
    };

    // 滑动窗口 前
    if (i > 0) {
      const prevParagraph = paragraphs[i - 1];
      const overlapStart = Math.max(prevParagraph.size - chunkOverlap, 0);
      const prevOverlap = prevParagraph.content.slice(overlapStart);
      chunkContent = prevOverlap + '\n\n' + chunkContent;
      metadata.start = prevParagraph.start + overlapStart;
    }

    // 滑动窗口 后
    if (i < paragraphs.length - 1) {
      const nextParagraph = paragraphs[i + 1];
      const nextOverlap = nextParagraph.content.slice(
        0,
        Math.min(chunkOverlap, nextParagraph.size)
      );
      chunkContent += '\n\n' + nextOverlap;
      metadata.end = nextParagraph.start + nextOverlap.length;
    }

    chunks.push({ content: chunkContent, metadata });
  }

  return chunks;
}
