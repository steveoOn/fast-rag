import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { embeddings } from '@/lib/db/schema/schema';
import { handleError, logger } from '@/lib/utils';
import { loadFile, readFile, embedding } from '@/lib/actions';
import { EmbedData } from '@/types';

export async function POST(request: Request) {
  try {
    const body: { files: string[] } = await request.json();
    logger.info(`embedding body: ${JSON.stringify(body)}`);
    const { files } = body;

    const allPromise = files.map(async (fileId: string) => {
      // 下载文档
      const file = await loadFile(fileId);
      logger.info(`files loaded: ${file.name}`);
      // 读取文档内容并chunk
      const chunkRes = await readFile(file);
      const chunks = chunkRes.chunks.map((chunk) => chunk.content);
      // 向量化
      const embed = await embedding(chunks);

      if (chunks.length !== embed.length) return [];

      return chunks.map((chunk, index) => ({
        document_version_id: file.document_version_id,
        content: chunk,
        embedding: embed[index],
        document_version: file.version,
      }));
    });

    const allEmbedRes = await Promise.allSettled(allPromise);

    const embedData = allEmbedRes.reduce<EmbedData[]>((acc, result) => {
      if (result.status === 'fulfilled') {
        return [...acc, ...result.value];
      }
      return acc;
    }, []);

    logger.info(`embedData length: ${embedData.length}`);
    await db.insert(embeddings).values(embedData);
    logger.info('embedding inserted');
    return NextResponse.json(body, { status: 201 });
  } catch (error) {
    const { message, code, details } = handleError(error);
    const status =
      code === 'VALIDATION_ERROR'
        ? 400
        : code === 'UNEXPECTED_ERROR' || code === 'UNKNOWN_ERROR'
          ? 500
          : 400;
    return NextResponse.json({ error: message, details, code }, { status });
  }
}
