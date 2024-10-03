// import { NextResponse } from 'next/server';
// import { upload, addDoc } from '@/lib/actions';
// import { CustomError, FileUploadRes } from '@/types';
// import { extractApiKey, handleError } from '@/lib/utils';

// export async function POST(request: Request) {
//   try {
//     const apiKey = extractApiKey(request);

//     const formData = await request.formData();
//     const keys = [...formData.keys()];
//     const files = keys.map((key) => formData.get(key) as File);

//     if (!files.length) {
//       throw new CustomError('未提供文件', 'MISSING_FILE');
//     }

//     const res = await upload(files, apiKey);
//     const uploadFiles = res.filter((item) => item.success && item.file).map((item) => item.file);

//     const insertRes = await addDoc(uploadFiles as FileUploadRes[], apiKey);
//     return NextResponse.json({ data: insertRes }, { status: 201 });
//   } catch (error) {
//     const { message, code, details } = handleError(error);
//     const status =
//       code === 'UNEXPECTED_ERROR' || code === 'UNKNOWN_ERROR'
//         ? 500
//         : code === 'VALIDATION_ERROR'
//           ? 400
//           : 400;
//     return NextResponse.json({ error: message, details, code }, { status });
//   }
// }

import { upload, addDoc } from '@/lib/actions';
import { CustomError, FileUploadRes } from '@/types';
import { extractApiKey, handleError } from '@/lib/utils';

export async function POST(request: Request) {
  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  const sendProgress = async (percentage: string, fileName: string) => {
    await writer.write(encoder.encode(`data: ${JSON.stringify({ percentage, fileName })}\n\n`));
  };

  try {
    const apiKey = extractApiKey(request);

    const formData = await request.formData();
    const keys = [...formData.keys()];
    const files = keys.map((key) => formData.get(key) as File);

    if (!files.length) {
      throw new CustomError('未提供文件', 'MISSING_FILE');
    }

    upload({ files, apiKey, sendProgress })
      .then(async (res) => {
        const uploadFiles = res
          .filter((item) => item.success && item.file)
          .map((item) => item.file);
        await addDoc(uploadFiles as FileUploadRes[], apiKey);
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
    await writer.write(
      encoder.encode(`data: ${JSON.stringify({ error: message, details, code })}\n\n`)
    );
    await writer.close();
    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  }
}
