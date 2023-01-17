import { Module } from '@nestjs/common';
import { TaskModule } from './task/task.module';
import { PrismaModule } from './prisma/prisma.module';
import { TaskRepositoryModule } from './task-repository/task-repository.module';
import { TaskCategoryModule } from './task-category/task-category.module';
import { ConfigModule } from '@nestjs/config';
import { validateTaskModuleEnvironments } from '../assets/validate/task-env.validate';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      envFilePath: './apps/task/src/environments/.tasks.env',
      validate: validateTaskModuleEnvironments,
    }),
    PrismaModule,
    TaskRepositoryModule,
    TaskModule,
    TaskCategoryModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
