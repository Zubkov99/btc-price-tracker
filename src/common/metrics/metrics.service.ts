import { Injectable } from '@nestjs/common';
import { collectDefaultMetrics, Counter, Histogram, Registry } from 'prom-client';

@Injectable()
export class MetricsService {
  public readonly incomingRequestLatency: Histogram<string>;
  public readonly outgoingRequestLatency: Histogram<string>;
  public readonly priceUpdateHeartbeat: Counter<string>;
  public readonly updatePriceJobErrorCounter: Counter<string>;

  private readonly registry: Registry;

  constructor() {
    this.registry = new Registry();

    collectDefaultMetrics({ register: this.registry });

    this.incomingRequestLatency = new Histogram({
      name: 'btc_price_tracker_incoming_http_request_latency_seconds',
      help: 'Latency of incoming HTTP requests in seconds',
      labelNames: ['method', 'status', 'path'],
      buckets: [0.01, 0.02, 0.03, 0.05, 0.1, 0.2, 0.3, 0.5, 1, 2, 3, 5, 8, 10, 15],
      registers: [this.registry],
    });

    this.outgoingRequestLatency = new Histogram({
      name: 'btc_price_tracker_outgoing_http_request_latency_seconds',
      help: 'Latency of outgoing HTTP requests in seconds',
      labelNames: ['method', 'status', 'path'],
      buckets: [0.01, 0.02, 0.03, 0.05, 0.1, 0.2, 0.3, 0.5, 1, 2, 3, 5, 8, 10, 15],
      registers: [this.registry],
    });

    this.priceUpdateHeartbeat = new Counter({
      name: 'btc_price_tracker_price_update_heartbeat_total',
      help: 'Number of heartbeat events for the price update service',
      registers: [this.registry],
    });

    this.updatePriceJobErrorCounter = new Counter({
      name: 'btc_price_tracker_price_update_error_total',
      help: 'Total number of errors encountered while executing update price tasks',
      registers: [this.registry],
    });
  }

  public async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }
}
