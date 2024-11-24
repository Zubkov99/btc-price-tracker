import { Module } from '@nestjs/common';

import { PriceModule } from '../price/price.module';

import { ApiController } from './api.controller';

@Module({
  imports: [PriceModule],
  controllers: [ApiController],
})
export class ApiModule {}
