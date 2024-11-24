import { Module } from '@nestjs/common';

import { CacheModule } from '../cache/cache.module';
import { BinanceModule } from '../gateways/binance/binance.module';

import { PriceService } from './price.service';

@Module({
  imports: [CacheModule, BinanceModule],
  providers: [PriceService],
  exports: [PriceService],
})
export class PriceModule {}
