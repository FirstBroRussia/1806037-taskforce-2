import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, Query, Req, UseFilters } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AllExceptionsFilter, fillDTO, handleHttpError } from '@taskforce/core';
import { ReplyPerformerUserIdDto } from './dto/reply-performer-userid.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { StatusTaskDto } from './dto/status-task.dto';
import { TaskDto } from './dto/task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskService } from './task.service';
import { ChoosePerformerUserIdDto } from './dto/choose-performer-userid.dto';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { TaskQuery } from '../../assets/query/task.query';
import { MyTasksDto } from './dto/my-tasks.dto';
import { Request } from 'express';
import { CheckCompleteTaskDto } from './dto/check-task-complete.dto';
import { MongoIdValidationPipe } from '@taskforce/shared-types';

@ApiTags('tasks')
@Controller('tasks')
@UseFilters(AllExceptionsFilter)
export class TaskController {
  constructor (
    private readonly taskService: TaskService,
  ) { }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create new task',
  })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  public async createTask(@Body() dto: CreateTaskDto): Promise<TaskDto | string> {
    return fillDTO(
      TaskDto,
      await this.taskService.create(dto)
              .catch(err => handleHttpError(err))
    );
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get tasks list',
  })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  public async getTasks(@Query() query: TaskQuery): Promise<TaskDto | TaskDto[] | string> {
    return fillDTO(
      TaskDto,
      await this.taskService.get(query)
              .catch(err => handleHttpError(err))
    );
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get task by id',
  })
  @Get('task/:id')
  @HttpCode(HttpStatus.OK)
  public async getTask(@Param('id', ParseIntPipe) taskId: number): Promise<TaskDto | string> {
    return fillDTO(
      TaskDto,
      await this.taskService.getTaskById(taskId)
              .catch(err => handleHttpError(err))
    );
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Update task by id',
  })
  @Put('task/:id')
  @HttpCode(HttpStatus.CREATED)
  public async updateTask(@Param('id', ParseIntPipe) taskId: number, @Body() dto: UpdateTaskDto): Promise<TaskDto | string> {
    return fillDTO(
      TaskDto,
      await this.taskService.updateTaskById(taskId, dto)
              .catch(err => handleHttpError(err))
    );
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Update status task by id',
  })
  @Put('task/:id/updatestatus')
  @HttpCode(HttpStatus.CREATED)
  public async updateStatusTask(@Param('id', ParseIntPipe) taskId: number, @Body() dto: StatusTaskDto): Promise<TaskDto | string> {
    return fillDTO(
      TaskDto,
      await this.taskService.updateStatusTask(taskId, dto)
              .catch(err => handleHttpError(err))
    );
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Choose the task performer by id',
  })
  @Put('task/:id/chooseperformer')
  @HttpCode(HttpStatus.OK)
  async choosePerformerById(@Param('id', ParseIntPipe) taskId: number, @Body() dto: ChoosePerformerUserIdDto) {
    return fillDTO(
      TaskDto,
      await this.taskService.choosePerformerUserIdToTaskById(taskId, dto)
              .catch(err => handleHttpError(err))
    );
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Add reply to task by id',
  })
  @Patch('task/:taskId/addreply')
  @HttpCode(HttpStatus.CREATED)
  public async addReplyToTask(@Param('taskId', ParseIntPipe) taskId: number, @Body() dto: ReplyPerformerUserIdDto): Promise<TaskDto | string> {
    return fillDTO(
      TaskDto,
      await this.taskService.addReplyPerformerUserIdToTaskById(taskId, dto)
              .catch(err => handleHttpError(err))
    );
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete task by id',
  })
  @Delete('task/:taskId')
  @HttpCode(HttpStatus.OK)
  public async deleteTask(@Req() req: Request, @Param('taskId', ParseIntPipe) taskId: number): Promise<string> {
    const userId = req.headers['userid'] as string;
    await this.taskService.deleteTaskById(taskId, userId)
            .catch(err => handleHttpError(err));

    return `Delete task with id: ${taskId} is succussful`;
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get my tasks',
  })
  @Post('task/mytasks')
  @HttpCode(HttpStatus.OK)
  public async getMyTasks(@Body() dto: MyTasksDto): Promise<TaskDto[]> {
    const { idsList, status } = dto;

    return fillDTO(
      TaskDto,
      await this.taskService.get(null, idsList, status)
        .catch(err => handleHttpError(err))
    ) as unknown as TaskDto[];
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Check complete task is current performer by user ID',
  })
  @Post('task/:taskId/checkcomplete/performer/:performerUserId')
  @HttpCode(HttpStatus.OK)
  public async checkCompleteTaskIsCurrentPerformerByUserId(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Param('performerUserId', MongoIdValidationPipe) performerUserId: string,
    @Body() dto: CheckCompleteTaskDto
    ): Promise<TaskDto[]> {
      const ownerId = dto.ownerId;
    return fillDTO(
      TaskDto,
      await this.taskService.checkCompleteTaskIsCurrentPerformerByUserId(taskId, ownerId, performerUserId)
        .catch(err => handleHttpError(err))
    ) as unknown as TaskDto[];
  }

}
