import { Chunk, ChunkOptions, Paragraph } from '@/types/doc-process';

/**
 * 将文档按段落分割，并创建包含前后重叠部分的文本块
 * @param text 要分割的文本
 * @param chunkOverlap 块之间的重叠部分
 * @param chunkSize 块的大小
 * @returns 包含块的数组
 */
export function chunkDocumentByParagraph(
  text: string,
  { chunkOverlap, chunkSize }: ChunkOptions
): Chunk[] {
  const paragraphs: Array<Paragraph> = text.split(/\n\s*\n/).reduce((acc, paragraph, index) => {
    if (!paragraph.trim()) return acc;

    const size = paragraph.length;
    const lastParagraph = acc[acc.length - 1];

    if (lastParagraph && lastParagraph.size + size + 2 <= chunkSize) {
      // 合并短段落
      lastParagraph.content += '\n\n' + paragraph;
      lastParagraph.size += size + 2;
      lastParagraph.end += size + 2;
    } else {
      // 添加新段落
      const start = lastParagraph ? lastParagraph.end + 2 : 0;
      acc.push({
        content: paragraph,
        size,
        start,
        end: start + size,
      });
    }
    return acc;
  }, [] as Paragraph[]);

  return paragraphs.map((paragraph, i) => {
    const prevParagraph = paragraphs[i - 1];
    const nextParagraph = paragraphs[i + 1];

    const overlapStart = Math.max((prevParagraph?.size ?? 0) - chunkOverlap, 0);
    const prevOverlap = prevParagraph?.content.slice(overlapStart) ?? '';

    const nextOverlap =
      nextParagraph?.content.slice(0, Math.min(chunkOverlap, nextParagraph.size ?? 0)) ?? '';

    const chunkContent = [prevOverlap, paragraph.content, nextOverlap].filter(Boolean).join('\n\n');

    return {
      content: chunkContent,
      metadata: {
        start: prevParagraph ? prevParagraph.start + overlapStart : paragraph.start,
        end: nextParagraph ? nextParagraph.start + nextOverlap.length : paragraph.end,
        size: paragraph.size,
      },
    };
  });
}
