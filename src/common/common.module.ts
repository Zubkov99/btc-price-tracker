import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { IncomingHttpInterceptor } from './interceptors/incoming-http.interceptor';
import { OutgoingHttpInterceptor } from './interceptors/outgoing-http.interceptor';
import { MetricsController } from './metrics/metrics.controller';
import { MetricsService } from './metrics/metrics.service';

@Module({
  providers: [
    MetricsService,
    {
      provide: APP_INTERCEPTOR,
      useClass: IncomingHttpInterceptor,
    },
    OutgoingHttpInterceptor,
  ],
  controllers: [MetricsController],
  exports: [OutgoingHttpInterceptor, MetricsService],
})
export class CommonModule {}
