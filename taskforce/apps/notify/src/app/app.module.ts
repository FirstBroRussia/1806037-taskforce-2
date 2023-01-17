import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { validateNotifyEnvironments } from '../assets/validate/notify-env.validate';
import { getNotifyMongoDbConfig } from '../config/get-notify-mongodb.config';
import { NotifyRepositoryModule } from './notify-repository/notify-repository.module';
import { EmailSubscriberModule } from './email-subscriber/email-subscriber.module';
import { MailModule } from './mailer/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      envFilePath: './apps/notify/src/environments/.notify.env',
      validate: validateNotifyEnvironments,
    }),
    MongooseModule.forRootAsync(getNotifyMongoDbConfig()),
    MailModule,
    NotifyRepositoryModule,
    EmailSubscriberModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
