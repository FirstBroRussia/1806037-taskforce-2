import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { getRabbitMqConfig } from '../../config/get-rabbitmq.config';
import { TaskCategoryModule } from '../task-category/task-category.module';
import { TaskRepositoryModule } from '../task-repository/task-repository.module';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

@Module({
  imports: [
    TaskRepositoryModule,
    TaskCategoryModule,
    ClientsModule.registerAsync([
      {
        name: 'RABBITMQ_CLIENT',
        inject: [ConfigService],
        useFactory: getRabbitMqConfig,
      },
    ]),
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
