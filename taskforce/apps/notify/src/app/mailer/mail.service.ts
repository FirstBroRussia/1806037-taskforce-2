import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { NOTIFY_SUBJECT_TEXT } from '../../assets/constant/constants';
import { CreateEmailSubscriberDto } from '../email-subscriber/dto/create-email-subscriber.dto';
import { NotifySubscriberAboutNewTaskDto } from '../email-subscriber/dto/notify-subscriber-about-new-task.dto';
import { NotifyRepository } from '../notify-repository/notify.repository';

@Injectable()
export class MailService {
  constructor (
    private readonly mailerService: MailerService,
    private readonly notifyRepository: NotifyRepository,
  ) { }

  public async sendNotifyNewSubscriber(dto: CreateEmailSubscriberDto) {
    const { email, firstname } = dto;

    const options: ISendMailOptions = {
      to: email,
      subject: NOTIFY_SUBJECT_TEXT,
      template: './add-subscriber',
      context: {
        firstname,
        email
      },
    };

    return await this.mailerService.sendMail(options);
  }

  public async sendNotifyNewTask(dto: NotifySubscriberAboutNewTaskDto) {
    const { email, username, taskTitle } = dto;

    const options: ISendMailOptions = {
      to: email,
      subject: NOTIFY_SUBJECT_TEXT,
      template: './add-task',
      context: {
        firstname: username,
        taskTitle,
      },
    };

    return await this.mailerService.sendMail(options);
  }
}
