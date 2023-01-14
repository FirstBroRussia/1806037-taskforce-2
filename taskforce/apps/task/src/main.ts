/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app/app.module';
import { PrismaService } from './app/prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const config = new DocumentBuilder()
                   .setTitle('The «Task» service')
                   .setDescription('«Task» service API')
                   .setVersion('1.0')
                   .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('specification', app, document);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    skipMissingProperties: true,
    transformOptions: {
      exposeUnsetFields: true,
      excludeExtraneousValues: true,
    },
  }));

  const port = process.env.PORT || 3333;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
