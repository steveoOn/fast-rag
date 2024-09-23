import { NextResponse } from 'next/server';
import { streamText, convertToCoreMessages, tool, generateText } from 'ai';
import { z } from 'zod';
import { createOpenAI } from '@ai-sdk/openai';
import { queryEmbeddings } from '@/lib/actions';
import { handleError } from '@/lib/utils';

const openai = createOpenAI({
  baseURL: 'https://api.ohmygpt.com/v1/',
  apiKey: process.env.OPENAI_API_KEY,
});

const model = openai.languageModel('gpt-4o-2024-08-06');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { content, system } = body;
    const messages = convertToCoreMessages(content);

    if (!messages.length) return NextResponse.json({ data: 'no messages' }, { status: 201 });
    const question = messages[0].content as string;

    // const queryRes = await queryEmbeddings(question);

    const queryRes = await generateText({
      system:
        system ||
        `你是一个乐于助人的助手。
        在回答任何问题之前，请先检查你的知识库。
        只使用工具调用中的信息来回答问题。
        如果在工具调用中没有找到相关信息，请回答“对不起，我不知道。”`,
      model,
      messages,
      tools: {
        getInformation: tool({
          description: `从知识库中查询数据用以回答用户的问题`,
          parameters: z.object({
            content: z.string().describe('用户的问题'),
          }),
          execute: async ({ content }) => {
            const queryRes = await queryEmbeddings(content);

            return queryRes;
          },
        }),
      },
    });

    const systemPrompt = `
              用户的问题：${question};
              用户的问题总结：${content};
              知识库中检索到的数据：${queryRes}
            `;
    const answer = await streamText({
      system: systemPrompt,
      model,
      messages: [
        {
          role: 'user',
          content: systemPrompt,
        },
      ],
    });

    return answer.toDataStreamResponse();
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
