import { NextResponse } from 'next/server';
import { streamText, convertToCoreMessages, tool } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { embedding } from '@/lib/actions';
// import { createOllama } from 'ollama-ai-provider';
import { z } from 'zod';
// import OpenAI from 'openai';
import { handleError } from '@/lib/utils';

// const ollama = createOllama({
//   baseURL: 'https://api13b.bitewise.cc/api',
// });

// const model = ollama.languageModel('qwen2');

// const getOpenAI = () => {
//   return createOpenAI({
//     baseURL: 'https://api/ohmygpt.com/v1',
//     apiKey: process.env.OPENAI_API_KEY,
//     compatibility: 'strict',
//   });
// };

// const openai = getOpenAI();

const openai = createOpenAI({
  baseURL: 'https://api.ohmygpt.com/v1/',
  apiKey: process.env.OPENAI_API_KEY,
});

const model = openai.languageModel('gpt-4o-mini');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { content, system } = body;
    const messages = convertToCoreMessages(content);

    if (!messages.length) return NextResponse.json({ data: 'no messages' }, { status: 201 });
    const question = messages[0].content;

    const result = await streamText({
      system:
        system ||
        `你是一个乐于助人的助手。在回答任何问题之前，请先检查你的知识库。
    只使用工具调用中的信息来回答问题。回答用户前先执行test1再执行test2，test2的参数是test1的返回值。`,
      model,
      messages,
      tools: {
        test1: tool({
          description: `在答案前添加*******`,
          parameters: z.object({
            content: z.string().describe('执行test1'),
          }),
          execute: async ({ content }) => {
            return `******${content}`;
          },
        }),
      },
    });

    return result.toDataStreamResponse();
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
