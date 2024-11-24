import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { OutgoingHttpInterceptor } from '../../common/interceptors/outgoing-http.interceptor';

import { IBookTickerPrice } from './binance.interface';

@Injectable()
export class BinanceService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectPinoLogger()
    private readonly logger: PinoLogger,
    private readonly outgoingHttpInterceptor: OutgoingHttpInterceptor
  ) {
    const axiosRef = this.httpService.axiosRef;
    axiosRef.interceptors.request.use(this.outgoingHttpInterceptor.interceptRequest.bind(this.outgoingHttpInterceptor));
    axiosRef.interceptors.response.use(
      this.outgoingHttpInterceptor.interceptResponse.bind(this.outgoingHttpInterceptor),
      this.outgoingHttpInterceptor.interceptError.bind(this.outgoingHttpInterceptor)
    );
  }

  public async getTickerPrice(symbol: string): Promise<IBookTickerPrice> {
    const url = '/api/v3/ticker/bookTicker';
    const response: AxiosResponse<IBookTickerPrice> = await this.httpService.axiosRef.get(url, {
      params: { symbol },
    });
    return response.data;
  }
}
