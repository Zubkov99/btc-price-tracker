import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { CommonModule } from '../common/common.module';
import { PriceModule } from '../price/price.module';

import { TasksSchedulerService } from './tasks-scheduler.service';
import { TasksService } from './tasks.service';

@Module({
  imports: [ScheduleModule.forRoot(), PriceModule, CommonModule],
  providers: [TasksService, TasksSchedulerService],
})
export class TasksModule {}
