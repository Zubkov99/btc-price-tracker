import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseSchema {
  @ApiProperty({ example: 503, description: 'HTTP status code' })
  statusCode: number;

  @ApiProperty({
    example: "It isn't possible to give the price at the moment, request the price later",
    description: 'Error message',
  })
  message: string;
}
