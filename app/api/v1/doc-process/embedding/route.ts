import { NextResponse } from 'next/server';
import fs from 'fs';
import { handleError } from '@/lib/utils';
import { chunkDocumentByParagraph } from '@/lib/actions/doc-process/chunks';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log(body);

    const text = fs.readFileSync(
      `${process.cwd()}/app/api/v1/doc-process/embedding/doc.txt`,
      'utf-8'
    );
    const chunks = chunkDocumentByParagraph(text, {
      chunkOverlap: 300,
    });

    console.log(chunks.length);

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
