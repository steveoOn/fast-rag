import { getLogger } from './logger-instance';
import { Logger } from 'pino';

let logger: Logger;

if (process.env.VERCEL) {
  // Vercel 生产环境配置
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { logflarePinoVercel } = require('pino-logflare');

  const { stream, send } = logflarePinoVercel({
    apiKey: process.env.LOGFLARE_API_KEY,
    sourceToken: process.env.LOGFLARE_SOURCE_TOKEN,
  });

  logger = getLogger().child(
    {
      browser: {
        transmit: {
          level: 'info',
          send: send,
        },
      },
      base: {
        env: process.env.VERCEL_ENV,
        revision: process.env.VERCEL_GITHUB_COMMIT_SHA,
      },
    },
    stream
  );
} else if (process.env.NODE_ENV === 'production') {
  // Docker生产环境配置
  logger = getLogger().child({
    base: {
      env: process.env.NODE_ENV,
    },
  });
} else {
  // 本地开发环境配置
  logger = getLogger();
}

export { logger };
