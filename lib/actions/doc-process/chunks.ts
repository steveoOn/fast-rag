interface Chunk {
  content: string;
}

interface ChunkOptions {
  chunkOverlap: number;
}

export function chunkDocumentByParagraph(text: string, { chunkOverlap }: ChunkOptions): Chunk[] {
  // 按段落分割文本
  const paragraphs = text.split(/\n\s*\n/).map((paragraph) => {
    return {
      content: paragraph.trim(),
      size: paragraph.length,
    };
  });

  const chunks: Chunk[] = [];
  let currentChunk = '';

  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i];
    if (!paragraph) continue;
    const prevParagraph = paragraphs[i - 1];
    const nextParagraph = paragraphs[i + 1];

    // 滑动窗口 前
    if (prevParagraph) {
      currentChunk += prevParagraph.content.slice(-chunkOverlap) + paragraph.content;
    }

    // 滑动窗口 后
    if (nextParagraph) {
      currentChunk += nextParagraph.content.slice(0, chunkOverlap);
    }

    chunks.push({ content: currentChunk });
  }

  return chunks;
}
