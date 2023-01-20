/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NEST_DEFAULT_PORT } from '@taskforce/shared-types';

import { AppModule } from './app/app.module';
import { getRabbitMqConfigForEmailSubscriber } from './config/get-rabbitmq-for-email-subscriber.config';
import { NotifyEnvInterface } from './config/notify-env.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || NEST_DEFAULT_PORT;

  const config = new DocumentBuilder()
                   .setTitle('The «Notify» service')
                   .setDescription('«Notify» service API')
                   .setVersion('1.0')
                   .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('specification', app, document);


  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    transformOptions: {
      excludeExtraneousValues: true,
    },
  }));

  const configService = app.get<ConfigService<NotifyEnvInterface>>(ConfigService);
  app.connectMicroservice(getRabbitMqConfigForEmailSubscriber(configService));

  await app.startAllMicroservices();
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
