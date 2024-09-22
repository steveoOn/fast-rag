import { hmac } from '@noble/hashes/hmac';
import { sha256 } from '@noble/hashes/sha256';
import { CustomError } from '@/types';
import { SERVER_SECRET_KEY } from '@/constant';
import { getApiKeyInfoFromCache } from '@/lib/redis/api-key-cache';

export async function validateRedisAPIKey(key: string): Promise<boolean> {
  const apiKeyInfo = await getApiKeyInfoFromCache(key);

  if (!apiKeyInfo || apiKeyInfo.status !== 'active') {
    throw new CustomError('API 密钥不存在或非活动状态', 'API_KEY_INVALID');
  }

  const { clientId, prefix, secret, signature } = apiKeyInfo;

  if (!SERVER_SECRET_KEY) {
    throw new CustomError('服务器密钥未定义', 'SERVER_SECRET_KEY_NOT_DEFINED');
  }

  const dataToSign = `${clientId}:${prefix}:${secret}`;
  const calculatedSignature = Buffer.from(hmac(sha256, SERVER_SECRET_KEY, dataToSign))
    .toString('base64')
    .replace(/[+/]/g, '-')
    .replace(/=/g, '')
    .slice(0, 16);

  if (calculatedSignature !== signature) {
    throw new CustomError('API 密钥验证失败', 'API_KEY_VALIDATION_FAILED');
  }

  return true;
}
