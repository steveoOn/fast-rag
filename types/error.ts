import { z } from 'zod';

export const ErrorResponseSchema = z.object({
  message: z.string(),
  code: z.string(),
  details: z.string().optional(),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

export class CustomError extends Error {
  code: string;
  details?: string;

  constructor(message: string, code: string, details?: string) {
    super(message);
    this.name = 'CustomError';
    this.code = code;
    this.details = details;
  }

  toResponse(): ErrorResponse {
    return {
      message: this.message,
      code: this.code,
      details: this.details,
    };
  }
}
