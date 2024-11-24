import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { MetricsService } from '../metrics/metrics.service';

@Injectable()
export class OutgoingHttpInterceptor {
  constructor(
    @InjectPinoLogger(OutgoingHttpInterceptor.name)
    private readonly logger: PinoLogger,
    private readonly metricService: MetricsService
  ) {}

  interceptRequest(config: AxiosRequestConfig): AxiosRequestConfig {
    config.headers = config.headers || {};
    config.headers['X-Request-Start'] = Date.now().toString();
    this.logger.debug(`Outgoing request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  }

  interceptResponse(response: AxiosResponse): AxiosResponse {
    const startTime = Number(response.config.headers['X-Request-Start'] || Date.now());
    const duration = Date.now() - startTime;
    const method = response.config.method.toUpperCase();
    const url = response.config.url;
    const status = response.status;

    this.logger.info(`Response from ${url}: ${status} - ${duration}ms`);

    this.metricService.outgoingRequestLatency.observe(
      {
        method,
        status: status.toString(),
        path: url,
      },
      duration / 1000
    );

    return response;
  }

  interceptError(error: AxiosError): Promise<AxiosError> {
    const startTime = Number(error.config.headers['X-Request-Start'] || Date.now());
    const duration = Date.now() - startTime;
    const method = error.config.method.toUpperCase();
    const url = error.config.url;
    const statusCode = error.response ? error.response.status : 'UNKNOWN';

    this.logger.error(`Error when requesting ${url}: ${statusCode} - ${duration}ms`, error.message);

    this.metricService.outgoingRequestLatency.observe(
      {
        method,
        status: statusCode.toString(),
        path: url,
      },
      duration / 1000
    );

    return Promise.reject(error);
  }
}
