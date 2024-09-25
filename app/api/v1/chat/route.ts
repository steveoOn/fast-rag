import { NextResponse } from 'next/server';
import { streamText, convertToCoreMessages, tool } from 'ai';
import { z } from 'zod';
import { createOpenAI } from '@ai-sdk/openai';
import { queryEmbeddings } from '@/lib/actions';
import { handleError, extractApiKey, validateClient } from '@/lib/utils';
import { CustomError } from '@/types';

const openai = createOpenAI({
  baseURL: 'https://api.ohmygpt.com/v1/',
  apiKey: process.env.OPENAI_API_KEY,
});

const model = openai.languageModel('gpt-4o-2024-08-06');

export async function POST(request: Request) {
  try {
    const apiKey = extractApiKey(request);
    const client = await validateClient(apiKey);
    if (!client) {
      throw new CustomError('非法请求', 'UN_AUTH_REQUEST');
    }

    const body = await request.json();
    const { docs, docVersions } = body;
    const messages = convertToCoreMessages(body.messages);

    if (!messages.length) {
      throw new CustomError('请正确提问', 'QUESTION_ERROR');
    }

    const answer = await streamText({
      system: `You are a helpful assistant. Check your knowledge base before answering any questions.
      Only respond to questions using information from tool calls.
      If no relevant information is found in the tool calls, respond, "Sorry, I don't know."`,
      model,
      messages: messages,
      tools: {
        getInformation: tool({
          description: `Retrieve relevant information from the knowledge base based on the user's input.`,
          parameters: z.object({
            content: z.string().describe("The user's question or input"),
          }),
          execute: async ({ content }) => {
            console.log('content', content);
            const queryRes = await queryEmbeddings({
              question: content,
              clientId: client.id,
              docs,
              docVersions,
            });
            console.log('queryRes', queryRes);
            return queryRes;
          },
        }),
      },
      maxToolRoundtrips: 2,
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
