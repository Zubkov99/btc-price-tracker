import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';

import { EnvironmentVarDTO } from './environment-var.dto';

export const validate = (config: Record<string, unknown>) => {
  const validatedConfig = plainToClass(EnvironmentVarDTO, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(`Validation failed for environment variables: ${errors.toString()}`);
  }
  return validatedConfig;
};
