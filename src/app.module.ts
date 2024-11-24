import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

import { ApiModule } from './api/api.module';
import { CommonModule } from './common/common.module';
import { validate } from './common/config/validate-config-env';
import { PriceModule } from './price/price.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      providers: [],
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isDev = configService.get<string>('NODE_ENV') === 'development';
        const logLevel = configService.get<string>('LOG_LEVEL') ?? 'info';

        const pinoHttpOptions = {
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
        };

        return {
          pinoHttp: pinoHttpOptions,
        };
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    ApiModule,
    PriceModule,
    TasksModule,
    CommonModule,
  ],
})
export class AppModule {}
