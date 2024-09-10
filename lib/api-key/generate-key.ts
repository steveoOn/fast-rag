import crypto from 'crypto';
import { APIKey } from '@/types/api-key';
import { SERVER_SECRET_KEY } from '@/constant';

export function generateAPIKey(clientId: string): APIKey {
  const prefix = crypto.randomBytes(4).toString('hex');
  const secret = crypto.randomBytes(24).toString('base64');

  const dataToSign = `${clientId}:${prefix}:${secret}`;

  if (!SERVER_SECRET_KEY) {
    throw new Error('SERVER_SECRET_KEY is not defined');
  }

  const signature = crypto.createHmac('sha256', SERVER_SECRET_KEY).update(dataToSign).digest('hex');
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
