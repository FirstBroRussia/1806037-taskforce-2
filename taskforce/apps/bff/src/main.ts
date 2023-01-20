import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { NEST_DEFAULT_PORT } from '@taskforce/shared-types';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || NEST_DEFAULT_PORT;

  const config = new DocumentBuilder()
                   .setTitle('The «BFF» service')
                   .setDescription('«BFF» service API')
                   .setVersion('1.0')
                   .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('specification', app, document);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    skipMissingProperties: true,
  }));

  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
