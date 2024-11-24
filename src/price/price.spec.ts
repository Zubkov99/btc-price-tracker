import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { BigNumber } from 'bignumber.js';
import { getLoggerToken, PinoLogger } from 'nestjs-pino';

import { CacheService } from '../cache/cache.service';
import { IBookTickerPrice } from '../gateways/binance/binance.interface';
import { BinanceService } from '../gateways/binance/binance.service';

import { IPrice } from './price.interface';
import { PriceService } from './price.service';

describe('PriceService', () => {
  let service: PriceService;
  let cacheService: CacheService<IPrice>;
  let binanceService: BinanceService;
  let logger: PinoLogger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PriceService,
        {
          provide: getLoggerToken(PriceService.name),
          useValue: {
            info: jest.fn(),
            error: jest.fn(),
            debug: jest.fn(),
          },
        },
        {
          provide: CacheService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
        {
          provide: BinanceService,
          useValue: {
            getTickerPrice: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('0.0001'),
          },
        },
        {
          provide: getLoggerToken(PriceService.name),
          useValue: {
            info: jest.fn(),
            error: jest.fn(),
            debug: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(PriceService);
    cacheService = module.get(CacheService);
    binanceService = module.get(BinanceService);
    logger = module.get(getLoggerToken(PriceService.name));
  });

  it('should calculate mid price correctly', async () => {
    const trackedTicker = service['TRACKED_TICKER'];
    const commissionRate = service['commissionRate'];

    const tickerPrice: IBookTickerPrice = {
      symbol: trackedTicker,
      bidPrice: '10000',
      bidQty: '1',
      askPrice: '10100',
      askQty: '1',
    };

    (binanceService.getTickerPrice as jest.Mock).mockResolvedValue(tickerPrice);

    await service.updatePrice();

    const expectedBid = new BigNumber('10000').multipliedBy(new BigNumber(1).minus(commissionRate));
    const expectedAsk = new BigNumber('10100').multipliedBy(new BigNumber(1).plus(commissionRate));
    const expectedMidPrice = expectedBid.plus(expectedAsk).div(2).toString();

    expect(cacheService.set).toHaveBeenCalledWith(trackedTicker, { price: expectedMidPrice });
  });

  it('should return price data from cache', async () => {
    const priceData: IPrice = { price: '10050' };
    (cacheService.get as jest.Mock).mockResolvedValue(priceData);

    const result = await service.getPrice();

    expect(result).toEqual(priceData);
  });

  it('should not update the cache when bidPrice and askPrice are invalid', async () => {
    const trackedTicker = service['TRACKED_TICKER'];

    const tickerPrice: IBookTickerPrice = {
      symbol: trackedTicker,
      bidPrice: 'invalid',
      bidQty: '1',
      askPrice: 'invalid',
      askQty: '1',
    };

    (binanceService.getTickerPrice as jest.Mock).mockResolvedValue(tickerPrice);
    (cacheService.get as jest.Mock).mockResolvedValue(undefined);

    await service.updatePrice();

    expect(cacheService.set).not.toHaveBeenCalled();

    expect(logger.error).toHaveBeenCalledWith({
      msg: 'Data received from the external API is not valid, the cache will not be updated',
      bidPrice: 'invalid',
      askPrice: 'invalid',
    });
  });
});
