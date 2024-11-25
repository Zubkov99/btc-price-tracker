import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BigNumber } from 'bignumber.js';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { CacheService } from '../cache/cache.service';
import { BinanceService } from '../gateways/binance/binance.service';

import { ICalculatePrice, IPrice } from './price.interface';

@Injectable()
export class PriceService {
  private readonly TRACKED_TICKER = 'BTCUSDT';
  private readonly commissionRate: string;

  constructor(
    @InjectPinoLogger(PriceService.name)
    private readonly logger: PinoLogger,
    private readonly cacheService: CacheService<IPrice>,
    private readonly binanceApiService: BinanceService,
    private readonly configService: ConfigService
  ) {
    this.commissionRate = this.configService.get<string>('COMMISSION_RATE');
  }
  public async getPrice(): Promise<IPrice> {
    const price = await this.cacheService.get(this.TRACKED_TICKER);
    if (!price) {
      throw new ServiceUnavailableException("It isn't possible to give the price at the moment, request the price later");
    }
    return price;
  }

  public async updatePrice(): Promise<void> {
    const tickerPrice = await this.binanceApiService.getTickerPrice(this.TRACKED_TICKER);
    const bidPrice = new BigNumber(tickerPrice.bidPrice);
    const askPrice = new BigNumber(tickerPrice.askPrice);
    if (!bidPrice.isFinite() || !askPrice.isFinite()) {
      this.logger.error({
        msg: 'Data received from the external API is not valid, the cache will not be updated',
        bidPrice: tickerPrice.bidPrice,
        askPrice: tickerPrice.askPrice,
      });
      return;
    }
    const price = this.calculatePrice({ bidPrice, askPrice, commissionRate: new BigNumber(this.commissionRate) });
    this.cacheService.set(this.TRACKED_TICKER, { price });
  }

  private calculatePrice({ bidPrice, askPrice, commissionRate }: ICalculatePrice): string {
    const adjustedBid = bidPrice.multipliedBy(new BigNumber(1).minus(commissionRate));
    const adjustedAsk = askPrice.multipliedBy(new BigNumber(1).plus(commissionRate));
    return adjustedBid.plus(adjustedAsk).div(2).toString();
  }
}
