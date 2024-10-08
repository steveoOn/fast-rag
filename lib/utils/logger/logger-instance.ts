import pino from 'pino';

let loggerInstance: pino.Logger | null = null;

export function getLogger(): pino.Logger {
  if (!loggerInstance) {
    loggerInstance = pino({
      level: 'debug',
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
  return loggerInstance;
}
