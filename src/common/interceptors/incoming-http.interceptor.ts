import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { MetricsService } from '../metrics/metrics.service';

export class IncomingHttpInterceptor implements NestInterceptor {
  constructor(
    @InjectPinoLogger(IncomingHttpInterceptor.name)
    private readonly logger: PinoLogger,

    private readonly metricsService: MetricsService
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;

    if (url === '/metrics') {
      return next.handle();
    }

    return next.handle().pipe(
      tap(() => {
        const status = context.switchToHttp().getResponse().statusCode;
        const duration = Date.now() - startTime;

        this.logger.info(`${method} ${url} ${status} - ${duration}ms`);

        this.metricsService.incomingRequestLatency.observe(
          {
            method,
            status: status.toString(),
            path: url,
          },
          duration / 1000
        );
      }),
      catchError((err) => {
        const status = err.status || 500;
        const duration = Date.now() - startTime;

        this.logger.error(`${method} ${url} ${status} - ${duration}ms`, err.message);

        this.metricsService.incomingRequestLatency.observe(
          {
            method,
            status: status.toString(),
            path: url,
          },
          duration / 1000
        );

        return throwError(() => err);
      })
    );
  }
}
