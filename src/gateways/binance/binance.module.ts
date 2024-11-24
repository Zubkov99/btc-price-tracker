import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CommonModule } from '../../common/common.module';

import { BinanceService } from './binance.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [],
      useFactory: async (configService: ConfigService) => ({
        maxRedirects: 5,
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        baseURL: configService.get<string>('BINANCE_API_URL') ?? 'https://api.binance.com',
      }),
      inject: [ConfigService],
    }),
    CommonModule,
  ],
  providers: [BinanceService],
  exports: [BinanceService],
})
export class BinanceModule {}
