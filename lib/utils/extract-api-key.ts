import { CustomError } from '@/types';

export function extractApiKey(request: Request): string {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new CustomError('未提供有效的 Authorization header', 'MISSING_AUTHORIZATION_HEADER');
  }

  const apiKey = authHeader.split('Bearer ')[1];
  if (!apiKey) {
    throw new CustomError('未提供 API KEY', 'MISSING_API_KEY');
  }

  return apiKey;
}
