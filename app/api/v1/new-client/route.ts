import { NextResponse } from 'next/server';
import { createClientWithApiKey } from '@/lib/actions/create-client';
import { z } from 'zod';

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

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.error();
  }
}
