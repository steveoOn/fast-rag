import { NextResponse } from 'next/server';
import { createClientWithApiKey } from '@/lib/actions/create-client';
import { z } from 'zod';
import { handleError } from '@/lib/utils/error/handle-error';
import { logger } from '@/lib/utils';

const createClientSchema = z.object({
  clientName: z.string().min(1, 'Client name is required'),
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

    return NextResponse.json(body, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    const handledError = handleError(error);
    return NextResponse.json({ error: handledError }, { status: 500 });
  }
}
