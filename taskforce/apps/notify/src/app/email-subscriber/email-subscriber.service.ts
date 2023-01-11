import { Injectable, Logger, LoggerService } from '@nestjs/common';
import { CustomError } from '@taskforce/core';
import { ExceptionEnum } from '@taskforce/shared-types';
import { SUBSCRIBERS_LIMIT_COUNT } from '../../assets/constant/constants';
import { MailService } from '../mailer/mail.service';
import { EmailSubscriberEntity } from '../notify-repository/entity/email-subscriber.entity';
import { NotifyRepository } from '../notify-repository/notify.repository';
import { CreateEmailSubscriberDto } from './dto/create-email-subscriber.dto';
import { NewTaskNotifyDto } from './dto/new-task-notify.dto';

@Injectable()
export class EmailSubscriberService {
  private readonly logger: LoggerService = new Logger(EmailSubscriberService.name);

  constructor (
    private readonly notifyRepository: NotifyRepository,
    private readonly mailService: MailService,
  ) { }

  public async addSubscriber(dto: CreateEmailSubscriberDto): Promise<EmailSubscriberEntity> {
    const { email } = dto;
    const existSubscriber = await this.notifyRepository.findByEmail(email);

    if (existSubscriber) {
      throw new CustomError('The subscriber with same email already exists', ExceptionEnum.Conflict);
    }

    const createdSubscriber = await this.notifyRepository.create(new EmailSubscriberEntity().fillEntity(dto));

    return await this.mailService.sendNotifyNewSubscriber(createdSubscriber);
  }

  public async notifyAboutTask(dto: NewTaskNotifyDto) {
    const subscribersCount = await this.notifyRepository.count();

    for (let limit = SUBSCRIBERS_LIMIT_COUNT; limit < subscribersCount + SUBSCRIBERS_LIMIT_COUNT; limit += SUBSCRIBERS_LIMIT_COUNT) {
      const subscribersList = await this.notifyRepository.find(limit, limit - SUBSCRIBERS_LIMIT_COUNT);

      for (const item of subscribersList) {
        const body = {
          email: item.email,
          username: item.firstname,
          taskTitle: dto.title,
        };

        await this.mailService.sendNotifyNewTask(body);
      }
    }
  }
}
