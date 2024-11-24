import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';

import { ApiModule } from './api/api.module';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const swaggerConfig = new DocumentBuilder().setTitle('BTC price tracker').setVersion('1.0.0').build();
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const apiSwagger: OpenAPIObject = SwaggerModule.createDocument(app, swaggerConfig, { include: [ApiModule] });

  SwaggerModule.setup('docs', app, apiSwagger);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('APP_PORT', 3000);
  const host = configService.get<string>('APP_HOST', '0.0.0.0');
  const logger = app.get(Logger);

  app.useLogger(logger);
  await app.listen(port, host);

  logger.log(`The service is running on host: ${host} and port: ${port}`);
}

void bootstrap();
