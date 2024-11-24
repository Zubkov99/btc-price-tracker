import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

import { ApiModule } from './api/api.module';
import { CommonModule } from './common/common.module';
import { validate } from './common/config/validate-config-env';
import { createPinoLoggerOptions } from './common/logger.factory';
import { PriceModule } from './price/price.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      imports: [],
      providers: [],
      inject: [ConfigService],
      useFactory: createPinoLoggerOptions,
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
