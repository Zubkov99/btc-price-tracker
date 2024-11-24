import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import { PriceService } from '../price/price.service';

import { PriceDTO } from './api.dto';

@Controller('api')
export class ApiController {
  constructor(private readonly priceService: PriceService) {}

  @ApiOperation({
    summary: 'The endpoint exists to get up-to-date information about the price of bitcoin',
  })
  @ApiOkResponse({
    description: 'In response, we send the price of bitcoin at the moment',
    type: PriceDTO,
  })
  @Get('price')
  public async getPrice(): Promise<PriceDTO> {
    return this.priceService.getPrice();
  }
}
