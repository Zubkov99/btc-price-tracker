import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiServiceUnavailableResponse, ApiTags } from '@nestjs/swagger';

import { PriceService } from '../price/price.service';

import { PriceDTO } from './api.dto';
import { ErrorResponseSchema } from './schemas/error-response.schema';

@ApiTags('API')
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
  @ApiServiceUnavailableResponse({
    description: "Internal Server Error. Couldn't provide the price at the moment.",
    type: ErrorResponseSchema,
  })
  @Get('price')
  public async getPrice(): Promise<PriceDTO> {
    return this.priceService.getPrice();
  }
}
