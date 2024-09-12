import pino from 'pino';

let logger;

if (process.env.VERCEL) {
  // Vercel 生产环境配置
  const { logflarePinoVercel } = require('pino-logflare');

  const { stream, send } = logflarePinoVercel({
    apiKey: process.env.LOGFLARE_API_KEY,
    sourceToken: process.env.LOGFLARE_SOURCE_TOKEN,
  });

  logger = pino(
    {
      browser: {
        transmit: {
          level: 'info',
          send: send,
        },
      },
      level: 'info',
      base: {
        env: process.env.VERCEL_ENV,
        revision: process.env.VERCEL_GITHUB_COMMIT_SHA,
      },
    },
    stream
  );
} else {
  // 本地开发环境配置
  logger = pino({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    },
    base: {
      env: process.env.NODE_ENV,
    },
  });
}

export { logger };
