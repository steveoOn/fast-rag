import { NextResponse } from 'next/server';
import { inArray } from 'drizzle-orm';
import { db } from '@/lib/db';
import { embeddings } from '@/lib/db/schema/schema';
import { handleError, logger } from '@/lib/utils';
import { loadFile, readFile, embedding } from '@/lib/actions';
import { EmbedData, CustomError } from '@/types';

export async function POST(request: Request) {
  try {
    const body: { fileIds: string[]; force?: boolean } = await request.json();
    logger.info(`embedding body: ${JSON.stringify(body)}`);
    /**
     * force
     * true: 对所选文件重新生成向量
     * false: 跳过已生成过向量的文件
     */
    const { fileIds, force } = body;
    if (!fileIds?.length) {
      throw new CustomError('请正确选择文件上传', 'UPLOAD_FILES_ERROR');
    }

    const versionIds: string[] = [];
    const allPromise = fileIds.map(async (fileId: string) => {
      // 下载文档  如果force不为true  则跳过已经embedding 的文件
      const file = await loadFile(fileId, force);

      if (!file) return null;

      logger.info(`files loaded: ${file.name}`);
      // 读取文档内容并chunk
      const chunkRes = await readFile(file);
      const chunks = chunkRes.chunks.map((chunk) => chunk.content);
      // 向量化
      const embed = await embedding(chunks);
      if (chunks.length !== embed.length) return [];

      versionIds.push(file.document_version_id);

      return chunks.map((chunk, index) => ({
        document_version_id: file.document_version_id,
        content: chunk,
        embedding: embed[index],
        document_version: file.version,
      }));
    });

    const allEmbedRes = await Promise.allSettled(allPromise);

    // 过滤成功的数据
    const embedData = allEmbedRes.reduce<EmbedData[]>((acc, result) => {
      if (result.status === 'fulfilled' && result.value) {
        return [...acc, ...result.value];
      }
      return acc;
    }, []);

    logger.info(`embedData length: ${embedData.length}`);

    if (!embedData.length) {
      return NextResponse.json({ data: '所选文件已经做过向量化处理' }, { status: 201 });
    }

    if (force) {
      // 删除向量库中的数据
      await db.delete(embeddings).where(inArray(embeddings.document_version_id, versionIds));
    }

    await db.insert(embeddings).values(embedData);
    logger.info('embedding inserted');
    return NextResponse.json(body, { status: 201 });
  } catch (error) {
    const { message, code, details } = handleError(error);
    console.log(message, code, details);
    const status =
      code === 'VALIDATION_ERROR'
        ? 400
        : code === 'UNEXPECTED_ERROR' || code === 'UNKNOWN_ERROR'
          ? 500
          : 400;
    return NextResponse.json({ error: message, details, code }, { status });
  }
}
