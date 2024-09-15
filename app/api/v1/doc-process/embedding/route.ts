import { NextResponse } from 'next/server';
import { handleError } from '@/lib/utils';
import { parsePDFToString } from '@/lib/actions/doc-process/read-pdf';
import { chunkDocumentByParagraph } from '@/lib/actions/doc-process/chunks';
import { embedding } from '@/lib/actions/doc-process/embedding';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log(body);

    const filePath: string = `${process.cwd()}/app/api/v1/doc-process/embedding/1.pdf`;

    // const text = fs.readFileSync(
    //   `${process.cwd()}/app/api/v1/doc-process/embedding/doc.txt`,
    //   'utf-8'
    // );

    const text = await parsePDFToString(filePath);

    const chunks = chunkDocumentByParagraph(text, {
      chunkOverlap: 300,
      chunkSize: 1000,
    });

    console.log(chunks.length);

    const contents = chunks.map((chunk) => chunk.content);
    try {
      const embeddings = await embedding(contents);
      console.log(embeddings);
    } catch (error) {
      console.log(error);
    }

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
