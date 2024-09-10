import { logger } from '../logger';
import { ErrorResponse, CustomError } from '@/types';

export function handleError(error: unknown): ErrorResponse {
  if (error instanceof CustomError) {
    logger.error('🚗 Custom Error:', {
      message: error.message,
      code: error.code,
      details: error.details,
      stack: error.stack,
    });

    return {
      message: error.message,
      code: error.code,
    };
  }

  if (error instanceof Error) {
    logger.error('🚗 Error:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
    });

    return {
      message: '操作失败',
      code: 'UNKNOWN_ERROR',
    };
  }

  logger.error('🚗 Unknown Error:', error);

  return {
    message: '未知错误',
    code: 'UNKNOWN_ERROR',
  };
}
