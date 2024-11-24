import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PriceDTO {
  @ApiProperty({ example: '90000' })
  @Expose()
  price: string;
}
