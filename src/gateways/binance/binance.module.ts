import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { CommonModule } from '../../common/common.module';

import { BinanceService } from './binance.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }),
    CommonModule,
  ],
  providers: [BinanceService],
  exports: [BinanceService],
})
export class BinanceModule {}
