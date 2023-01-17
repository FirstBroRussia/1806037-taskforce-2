import { Controller, Logger, LoggerService, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { ApiResponse } from '@nestjs/swagger';
import { AllExceptionsFilter } from '@taskforce/core';
import { CommandEventEnum } from '@taskforce/shared-types';
import { CreateEmailSubscriberDto } from './dto/create-email-subscriber.dto';
import { NewTaskNotifyDto } from './dto/new-task-notify.dto';
import { EmailSubscriberService } from './email-subscriber.service';

@Controller()
@UseFilters(AllExceptionsFilter)
export class EmailSubscriberController {
  private readonly logger: LoggerService = new Logger(EmailSubscriberController.name);

  constructor (
    private readonly emailSubscriberService: EmailSubscriberService,
  ) { }

  @ApiResponse({
    description: 'Add subscriber',
  })
  @EventPattern({
    cmd: CommandEventEnum.AddSubscriber,
  })
  @UsePipes(ValidationPipe)
  public async createSubscriber(dto: CreateEmailSubscriberDto) {
    return await this.emailSubscriberService.addSubscriber(dto);
  }

  @ApiResponse({
    description: 'Notify subscribers about a new task',
  })
  @EventPattern({
    cmd: CommandEventEnum.AddTask,
  })
  @UsePipes(ValidationPipe)
  public async notifyAboutTask(dto: NewTaskNotifyDto) {
    return await this.emailSubscriberService.notifyAboutTask(dto);
  }

}
