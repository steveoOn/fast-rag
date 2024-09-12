import { NextResponse } from 'next/server';
import { createClientWithApiKey } from '@/lib/actions';
import { z } from 'zod';
import { handleError } from '@/lib/utils';

export const runtime = 'edge';

const createClientSchema = z.object({
  clientName: z
    .string()
    .min(1, 'Client name is required')
    .regex(/^[a-zA-Z0-9_-]+$/, '客户端名称格式无效，只能包含英文、数字、下划线和短横线'),
  tokenDescription: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clientName, tokenDescription } = createClientSchema.parse(body);

    const result = await createClientWithApiKey(clientName, tokenDescription);

    return NextResponse.json(result, { status: 201 });
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
