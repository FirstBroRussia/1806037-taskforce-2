import { Inject, Injectable } from '@nestjs/common';
import { CommandEventEnum, ExceptionEnum, TaskStatusEnum, UserRoleEnum } from '@taskforce/shared-types';
import { checkUpdateStatusTaskFn } from '../../assets/helper/heplers';
import { TaskCategoryService } from '../task-category/task-category.service';
import { TaskEntity } from '../task-repository/entities/task.entity';
import { TaskCategoryRepository } from '../task-repository/task-category.repository';
import { TaskRepository } from '../task-repository/task.repository';
import { ReplyPerformerUserIdDto } from './dto/reply-performer-userid.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ChoosePerformerUserIdDto } from './dto/choose-performer-userid.dto';
import { TaskQuery } from '../../assets/query/task.query';
import { createEventForRabbitMq, CustomError } from '@taskforce/core';
import { ClientProxy } from '@nestjs/microservices';
import { StatusTaskDto } from './dto/status-task.dto';

@Injectable()
export class TaskService {
  constructor (
    private readonly taskRepository: TaskRepository,
    private readonly taskCategoryService: TaskCategoryService,
    private readonly taskCategoryRepository: TaskCategoryRepository,
    @Inject('RABBITMQ_CLIENT') private readonly rabbitMqClient: ClientProxy,
  ) { }

  public async create(dto: CreateTaskDto): Promise<TaskEntity> {
    let existCategory = await this.taskCategoryService.getByName(dto.category);

    if (!existCategory) {
      const createCategoryDto = { title: dto.category };
      existCategory = await this.taskCategoryService.create(createCategoryDto);
    }

    const newTask = new TaskEntity(dto, existCategory);

    const createdTask = await this.taskRepository.create(newTask) as unknown as TaskEntity;

    this.rabbitMqClient.emit(
      createEventForRabbitMq(CommandEventEnum.AddTask),
      {
        userId: createdTask.userId,
        title: createdTask.title,
      },
    );

    return createdTask;
  }

  public async get(query: TaskQuery, idsList?: string[], status?: string): Promise<TaskEntity[]> {
    return await this.taskRepository.find(query, idsList, status) as unknown as TaskEntity[];
  }

  public async getTaskById(taskId: number): Promise<TaskEntity | null> {
    const existTask = await this.taskRepository.findById(taskId);

    if (!existTask) {
      throw new CustomError(`Task with this id: ${taskId} was not found`, ExceptionEnum.NotFound);
    }

    return existTask as unknown as TaskEntity;
  }

  public async updateTaskById(taskId: number, dto: UpdateTaskDto): Promise<TaskEntity> {
    if (dto.role !== UserRoleEnum.Customer) {
      throw new CustomError(`You are not allowed to create tasks`, ExceptionEnum.Forbidden);
    }

    const existTask = await this.taskRepository.findById(taskId);
    const userId = dto.userId;

    if (!existTask) {
      throw new CustomError(`Task with this id: ${taskId} is not found`, ExceptionEnum.NotFound);
    }
    if (existTask.userId !== userId) {
      throw new CustomError(`This user is not the owner of this task`, ExceptionEnum.Forbidden);
    }

    let existCategory = await this.taskCategoryService.getByName(dto.category);

    if (!existCategory) {
      const createCategoryDto = { title: dto.category };
      existCategory = await this.taskCategoryService.create(createCategoryDto);
    }

    delete dto.userId;
    delete dto.role;

    return await this.taskRepository.update(taskId, dto, existCategory) as unknown as TaskEntity;
  }

  public async updateStatusTask(taskId: number, dto: StatusTaskDto): Promise<TaskEntity | string> {
    const existTask = await this.taskRepository.findById(taskId);
    const userId = dto.userId;
    const status = dto.statusTask;

    if (!existTask) {
      throw new CustomError(`Task with this id: ${taskId} is not found`, ExceptionEnum.NotFound);
    }
    if (existTask.userId !== userId) {
      throw new CustomError(`This user is not the owner of this task`, ExceptionEnum.Forbidden);
    }

    const currentStatus = existTask.status;
    const checkResult =  checkUpdateStatusTaskFn(currentStatus, status);

    if (typeof checkResult !== 'boolean') {
      throw new CustomError(checkResult, ExceptionEnum.BadRequest);
    }

    return await this.taskRepository.updateStatus(taskId, status) as unknown as TaskEntity;
  }

  public async choosePerformerUserIdToTaskById(taskId: number, dto: ChoosePerformerUserIdDto): Promise<TaskEntity> {
    if (dto.role !== UserRoleEnum.Performer) {
      throw new CustomError(`You can't take a task to work`, ExceptionEnum.Forbidden);
    }

    const existTask = await this.taskRepository.findById(taskId);

    if (!existTask) {
      throw new CustomError(`Task with this id: ${taskId} is not found`, ExceptionEnum.NotFound);
    }
    if (existTask.status !== TaskStatusEnum.New) {
      throw new CustomError(`Task with this ID: ${taskId} cannot be taken to work`, ExceptionEnum.Forbidden);
    }

    const { userId } = dto;

    if (userId === existTask.currentPerformer) {
      throw new CustomError(`This user: ${userId} has already been selected as the task executor`, ExceptionEnum.Forbidden);
    }

    return await this.taskRepository.choosePerformerUserIdToTaskById(taskId, userId) as unknown as TaskEntity;
  }

  public async addReplyPerformerUserIdToTaskById(taskId: number, dto: ReplyPerformerUserIdDto): Promise<TaskEntity> {
    if (dto.role !== UserRoleEnum.Performer) {
      throw new CustomError(`You can't take a task to work`, ExceptionEnum.Forbidden);
    }

    const existTask = await this.taskRepository.findById(taskId);

    if (!existTask) {
      throw new CustomError(`Task with this id: ${taskId} is not found`, ExceptionEnum.NotFound);
    }

    const { userId } = dto;

    const isTargetReply = existTask.repliedPerformers.find(item => item === userId)

    if (isTargetReply) {
      throw new CustomError(`This user: ${userId} has already responded to this task`, ExceptionEnum.Forbidden);
    }

    return await this.taskRepository.addReplyPerformerToTaskById(taskId, userId) as TaskEntity;
  }

  public async deleteTaskById(taskId: number, userId: string): Promise<void> {
    const existTask = await this.taskRepository.findById(taskId);

    if (existTask.userId !== userId) {
      throw new CustomError(`No access to delete`, ExceptionEnum.Forbidden);
    }
    if (!existTask) {
      throw new CustomError(`Task with this id: ${taskId} is not found`, ExceptionEnum.NotFound);
    }

    return await this.taskRepository.delete(taskId);
  }

  public async checkCompleteTaskIsCurrentPerformerByUserId(taskId: number, ownerId: string, performerUserId: string): Promise<TaskEntity> {
    const existTask = await this.taskRepository.findById(taskId);

    if (!existTask) {
      throw new CustomError(`Task with this id: ${taskId} is not found`, ExceptionEnum.NotFound);
    }
    if (existTask.userId !== ownerId) {
      throw new CustomError(`You are not the owner of the task`, ExceptionEnum.Forbidden);
    }
    if (existTask.currentPerformer !== performerUserId) {
      throw new CustomError(`Current performer is not the executor of this task`, ExceptionEnum.Forbidden);
    }
    if (existTask.status !== TaskStatusEnum.Realized) {
      throw new CustomError(`This task is not COMPLETED`, ExceptionEnum.Forbidden);
    }

    return existTask as TaskEntity;
  }


}
