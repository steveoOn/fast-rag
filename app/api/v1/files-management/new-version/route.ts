import { NextResponse } from 'next/server';
import { upload, addVersion } from '@/lib/actions';
import { CustomError, FileUploadRes } from '@/types';
import { extractApiKey, handleError } from '@/lib/utils';

export async function POST(request: Request) {
  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const sendProgress = async (percent: string, fileName: string) => {
    await writer.write(encoder.encode(`data: ${JSON.stringify({ percent, fileName })}\n\n`));
  };

  try {
    const apiKey = extractApiKey(request);

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const documentId = formData.get('documentId') as string;

    if (!file) {
      throw new CustomError('未提供文件', 'MISSING_FILE');
    }
    if (!documentId) {
      throw new CustomError('未提供文档ID', 'MISSING_DOCUMENT_ID');
    }

    upload({ files: [{ file: file }], apiKey, sendProgress })
      .then(async (res) => {
        const uploadFiles = res
          .filter((item) => item.success && item.file)
          .map((item) => item.file) as FileUploadRes[];
        await addVersion({ file: uploadFiles[0], apiKey, documentId });
        await writer.write(
          encoder.encode(`data: ${JSON.stringify({ completed: true, files: uploadFiles })}\n\n`)
        );
        await writer.close();
      })
      .catch(async (error) => {
        const { message, code, details } = handleError(error);
        await writer.write(
          encoder.encode(`data: ${JSON.stringify({ error: message, details, code })}\n\n`)
        );
        await writer.close();
      });

    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    const { message, code, details } = handleError(error);
    const status =
      code === 'UNEXPECTED_ERROR' || code === 'UNKNOWN_ERROR'
        ? 500
        : code === 'VALIDATION_ERROR'
          ? 400
          : 400;
    return NextResponse.json({ error: message, details, code }, { status });
  }
}
