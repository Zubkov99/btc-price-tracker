import { ConfigService } from '@nestjs/config';
import { Params } from 'nestjs-pino';

export const createPinoLoggerOptions = (configService: ConfigService): Params => {
  const isDev = configService.get<string>('NODE_ENV') === 'development';
  const logLevel = configService.get<string>('LOG_LEVEL') ?? 'info';

  return {
    pinoHttp: {
      level: logLevel,
      ...(isDev && {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'yyyy-mm-dd HH:MM:ss',
            ignore: 'pid,hostname',
          },
        },
      }),
    },
  };
};
