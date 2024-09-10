import crypto from 'crypto';
import { APIKey } from '@/types/api-key';
import { SERVER_SECRET_KEY } from '@/constant';

export function generateAPIKey(clientId: string): APIKey {
  const prefix = crypto.randomBytes(3).toString('hex'); // 6 characters
  const secret = crypto.randomBytes(16).toString('base64url'); // ~22 characters, URL-safe

  const dataToSign = `${clientId}:${prefix}:${secret}`;

  if (!SERVER_SECRET_KEY) {
    throw new Error('SERVER_SECRET_KEY is not defined');
  }

  const signature = crypto
    .createHmac('sha256', SERVER_SECRET_KEY)
    .update(dataToSign)
    .digest('base64url')
    .slice(0, 16); // ~22 characters truncated to 16, URL-safe

  const fullKey = `${prefix}.${secret}.${signature}`;

  return {
    id: clientId,
    prefix,
    secret,
    signature,
    fullKey,
    expiresAt: null,
    isActive: true,
    createdAt: new Date(),
  };
}
