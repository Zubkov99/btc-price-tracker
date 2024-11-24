import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import ms from 'ms';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { LockJob } from '../common/decorators/lock-job.decorator';
import { MetricsService } from '../common/metrics/metrics.service';
import { PriceService } from '../price/price.service';

import { TasksSchedulerService } from './tasks-scheduler.service';

export class TasksService implements OnModuleInit, OnModuleDestroy {
  private readonly updatePriceIntervalId: string = 'update-price-job';

  public onModuleInit(): void {
    const updatePriceDuration = this.configService.get<number>('UPDATE_FREQUENCY', ms('10s'));
    this.taskSchedulerService.scheduleTask(this.updatePriceIntervalId, updatePriceDuration, () => this.updatePriceTask());
    void this.updatePriceTask();
  }

  public onModuleDestroy(): void {
    this.taskSchedulerService.cancelTask(this.updatePriceIntervalId);
  }

  constructor(
    @InjectPinoLogger(TasksService.name)
    private readonly logger: PinoLogger,
    private readonly priceManagerService: PriceService,
    private readonly configService: ConfigService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly metricService: MetricsService,
    private readonly taskSchedulerService: TasksSchedulerService
  ) {}

  @LockJob()
  private async updatePriceTask(): Promise<void> {
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
