import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { OutgoingHttpInterceptor } from '../../common/interceptors/outgoing-http.interceptor';

import { IBookTickerPrice } from './types';

@Injectable()
export class BinanceService {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectPinoLogger()
    private readonly logger: PinoLogger,
    private readonly outgoingHttpInterceptor: OutgoingHttpInterceptor
  ) {
    this.baseUrl = this.configService.get<string>('BINANCE_API_URL') ?? 'https://api.binance.com';
    const axiosRef = this.httpService.axiosRef;
    axiosRef.interceptors.request.use(this.outgoingHttpInterceptor.interceptRequest.bind(this.outgoingHttpInterceptor));
    axiosRef.interceptors.response.use(
      this.outgoingHttpInterceptor.interceptResponse.bind(this.outgoingHttpInterceptor),
      this.outgoingHttpInterceptor.interceptError.bind(this.outgoingHttpInterceptor)
    );
  }

  public async getTickerPrice(symbol: string): Promise<IBookTickerPrice> {
    const url = `${this.baseUrl}/api/v3/ticker/bookTicker`;
    const response: AxiosResponse<IBookTickerPrice> = await this.httpService.axiosRef.get(url, {
      params: { symbol },
    });
    return response.data;
  }
}
