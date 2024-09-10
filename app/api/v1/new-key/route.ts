import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createAccessToken } from '@/lib/actions/create-access-token';

const createApiKeySchema = z.object({
  clientId: z.string().min(1, 'Client ID is required'),
  tokenDescription: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clientId, tokenDescription } = createApiKeySchema.parse(body);

    const result = await createAccessToken(clientId, tokenDescription);

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
