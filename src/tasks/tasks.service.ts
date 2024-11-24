import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import ms from 'ms';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { setInterval } from 'node:timers';

import { LockJob } from '../common/decorators/lock-job.decorator';
import { MetricsService } from '../common/metrics/metrics.service';
import { PriceService } from '../price/price.service';

export class TasksService implements OnModuleInit, OnModuleDestroy {
  private readonly updatePriceIntervalId: string = 'update-price-job';

  public onModuleInit(): void {
    void this.updatePrice();
    this.startJob();
  }

  public onModuleDestroy(): void {
    this.stopJob();
  }

  constructor(
    @InjectPinoLogger(TasksService.name)
    private readonly logger: PinoLogger,
    private readonly priceManagerService: PriceService,
    private readonly configService: ConfigService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly metricService: MetricsService
  ) {}

  private startJob(): void {
    const updatePriceDuration = this.configService.get<number>('UPDATE_FREQUENCY', ms('10s'));
    const updatePriceInterval = setInterval(() => this.updatePrice(), updatePriceDuration);
    this.schedulerRegistry.addInterval(this.updatePriceIntervalId, updatePriceInterval);
  }

  private stopJob(): void {
    this.schedulerRegistry.deleteInterval(this.updatePriceIntervalId);
  }

  @LockJob()
  private async updatePrice(): Promise<void> {
    try {
      await this.priceManagerService.updatePrice();
      this.metricService.priceUpdateHeartbeat.inc();
      this.logger.info('The task of updating the price has been completed successfully');
    } catch (err: unknown) {
      this.metricService.updatePriceJobErrorCounter.inc();
      this.logger.error({ err, msg: 'Error occurred during the task of updating the price' });
    }
  }
}
