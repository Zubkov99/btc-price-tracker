import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { setInterval } from 'node:timers';

@Injectable()
export class TasksSchedulerService {
  constructor(private readonly schedulerRegistry: SchedulerRegistry) {}

  public scheduleTask(name: string, interval: number, callback: () => void): void {
    const task = setInterval(callback, interval);
    this.schedulerRegistry.addInterval(name, task);
  }

  public cancelTask(name: string): void {
    this.schedulerRegistry.deleteInterval(name);
  }
}
