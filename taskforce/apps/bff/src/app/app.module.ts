import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { AuthController } from './auth/auth.controller';
import { HttpModule } from '@nestjs/axios';
import { TaskController } from './task/task.controller';
import { TaskCategoryController } from './task/task-category.controller';
import { AuthGuard } from '../assets/guard/auth.guard';
import { DataTransformInterceptor } from '../assets/interceptor/data-transform.interceptor';
import { DiscussionController } from './discussion/discussion.controller';
import { ReviewController } from './review/review.controller';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [
    UserController,
    AuthController,
    TaskController,
    TaskCategoryController,
    DiscussionController,
    ReviewController,
  ],
  providers: [AuthGuard, DataTransformInterceptor],
})
export class AppModule {}
