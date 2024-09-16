import { NextResponse } from 'next/server';
import { handleError } from '@/lib/utils';
import { embedding, chunkDocumentByParagraph, parsePDFToString, loadFile } from '@/lib/actions';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const files = await loadFile(body.files);
    console.log(files);

    // const filePath: string = `${process.cwd()}/app/api/v1/doc-process/embedding/1.pdf`;

    // const text = fs.readFileSync(
    //   `${process.cwd()}/app/api/v1/doc-process/embedding/doc.txt`,
    //   'utf-8'
    // );

    // const text = await parsePDFToString(filePath);

    // const chunks = chunkDocumentByParagraph(text, {
    //   chunkOverlap: 300,
    //   chunkSize: 1000,
    // });

    // const contents = chunks.map((chunk) => chunk.content);

    // const embeddings = await embedding(contents);

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
