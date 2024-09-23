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

    const queryRes = await generateText({
      system: system || `在回答任何问题之前，请先检查你的知识库。`,
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

    const toolRes = queryRes.toolResults[0];

    const questionPrompt = `
              用户的问题：${question};
              知识库中检索到的数据：${toolRes.result}
            `;
    const answer = await streamText({
      system: `
      你是一个乐于助人的助手，检索你的知识库并回答用户的问题，规则如下：
      1、你需要根据知识库中检索到的数据来回答用户的问题。
      2、检索到的数据可能有多条，选择最符合问题的一条来回答，并把选中的这一条数据使用markdown的格式附在答案的最后。
      3、如果没有在知识库中检索到的数据，则回答用户"对不起，在知识库中并未检索到相应的数据。"
      `,
      model,
      messages: [
        {
          role: 'user',
          content: questionPrompt,
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
