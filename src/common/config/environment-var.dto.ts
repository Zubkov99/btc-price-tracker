import { IsNumber, IsString, IsOptional, IsPositive, IsIn, IsInt, IsNumberString } from 'class-validator';

export class EnvironmentVarDTO {
  @IsInt()
  @IsPositive()
  APP_PORT: number;

  @IsString()
  APP_HOST: string;

  @IsString()
  BINANCE_API_URL: string;

  @IsNumber()
  @IsPositive()
  UPDATE_FREQUENCY: number;

  @IsNumberString()
  COMMISSION_RATE: string;

  @IsString()
  @IsOptional()
  LOG_LEVEL: string;

  @IsOptional()
  @IsIn(['development', 'production', 'staging', 'test'])
  NODE_ENV?: string;
}
