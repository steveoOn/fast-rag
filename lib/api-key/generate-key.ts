import { hmac } from '@noble/hashes/hmac';
import { sha256 } from '@noble/hashes/sha256';
import { randomBytes } from '@noble/hashes/utils';
import { APIKey } from '@/types/api-key';
import { SERVER_SECRET_KEY } from '@/constant';

export function generateAPIKey(clientId: string): APIKey {
  const prefix = Buffer.from(randomBytes(3)).toString('hex');
  const secret = Buffer.from(randomBytes(16))
    .toString('base64')
    .replace(/[+/]/g, '-')
    .replace(/=/g, '');

  const dataToSign = `${clientId}:${prefix}:${secret}`;

  if (!SERVER_SECRET_KEY) {
    throw new Error('SERVER_SECRET_KEY is not defined');
  }

  const signature = Buffer.from(hmac(sha256, SERVER_SECRET_KEY, dataToSign))
    .toString('base64')
    .replace(/[+/]/g, '-')
    .replace(/=/g, '')
    .slice(0, 16);

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
