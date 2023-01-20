import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommandEventEnum, TaskStatusEnum, UserRoleEnum } from '@taskforce/shared-types';
import { checkUpdateStatusTaskFn } from '../../assets/helper/heplers';
import { TaskCategoryService } from '../task-category/task-category.service';
import { TaskEntity } from '../task-repository/entities/task.entity';
import { TaskRepository } from '../task-repository/task.repository';
import { ReplyPerformerUserIdDto } from './dto/reply-performer-userid.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ChoosePerformerUserIdDto } from './dto/choose-performer-userid.dto';
import { TaskQuery } from '../../assets/query/task.query';
import { createEventForRabbitMq } from '@taskforce/core';
import { ClientProxy } from '@nestjs/microservices';
import { StatusTaskDto } from './dto/status-task.dto';

@Injectable()
export class TaskService {
  constructor (
    private readonly taskRepository: TaskRepository,
    private readonly taskCategoryService: TaskCategoryService,
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
      throw new NotFoundException(`Task with this id: ${taskId} was not found`);
    }

    return existTask as unknown as TaskEntity;
  }

  public async updateTaskById(taskId: number, dto: UpdateTaskDto): Promise<TaskEntity> {
    if (dto.role !== UserRoleEnum.Customer) {
      throw new ForbiddenException(`You are not allowed to create tasks`);
    }

    const existTask = await this.taskRepository.findById(taskId);
    const userId = dto.userId;

    if (!existTask) {
      throw new NotFoundException(`Task with this id: ${taskId} is not found`);
    }
    if (existTask.userId !== userId) {
      throw new ForbiddenException(`This user is not the owner of this task`);
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
      throw new NotFoundException(`Task with this id: ${taskId} is not found`);
    }
    if (existTask.userId !== userId) {
      throw new ForbiddenException(`This user is not the owner of this task`);
    }

    const currentStatus = existTask.status;
    const checkResult =  checkUpdateStatusTaskFn(currentStatus, status);

    if (typeof checkResult !== 'boolean') {
      throw new BadRequestException(checkResult);
    }

    return await this.taskRepository.updateStatus(taskId, status) as unknown as TaskEntity;
  }

  public async choosePerformerUserIdToTaskById(taskId: number, dto: ChoosePerformerUserIdDto): Promise<TaskEntity> {
    if (dto.role !== UserRoleEnum.Performer) {
      throw new ForbiddenException(`You can't take a task to work`);
    }

    const existTask = await this.taskRepository.findById(taskId);

    if (!existTask) {
      throw new NotFoundException(`Task with this id: ${taskId} is not found`);
    }
    if (existTask.status !== TaskStatusEnum.New) {
      throw new ForbiddenException(`Task with this ID: ${taskId} cannot be taken to work`);
    }

    const { userId } = dto;

    if (userId === existTask.currentPerformer) {
      throw new ForbiddenException(`This user: ${userId} has already been selected as the task executor`);
    }

    return await this.taskRepository.choosePerformerUserIdToTaskById(taskId, userId) as unknown as TaskEntity;
  }

  public async addReplyPerformerUserIdToTaskById(taskId: number, dto: ReplyPerformerUserIdDto): Promise<TaskEntity> {
    if (dto.role !== UserRoleEnum.Performer) {
      throw new ForbiddenException(`You can't take a task to work`);
    }

    const existTask = await this.taskRepository.findById(taskId);

    if (!existTask) {
      throw new NotFoundException(`Task with this id: ${taskId} is not found`);
    }

    const { userId } = dto;

    const isTargetReply = existTask.repliedPerformers.find(item => item === userId)

    if (isTargetReply) {
      throw new ForbiddenException(`This user: ${userId} has already responded to this task`);
    }

    return await this.taskRepository.addReplyPerformerToTaskById(taskId, userId) as TaskEntity;
  }

  public async deleteTaskById(taskId: number, userId: string): Promise<void> {
    const existTask = await this.taskRepository.findById(taskId);

    if (existTask.userId !== userId) {
      throw new ForbiddenException(`No access to delete`);
    }
    if (!existTask) {
      throw new NotFoundException(`Task with this id: ${taskId} is not found`);
    }

    return await this.taskRepository.delete(taskId);
  }

  public async checkCompleteTaskIsCurrentPerformerByUserId(taskId: number, ownerId: string, performerUserId: string): Promise<TaskEntity> {
    const existTask = await this.taskRepository.findById(taskId);

    if (!existTask) {
      throw new NotFoundException(`Task with this id: ${taskId} is not found`);
    }
    if (existTask.userId !== ownerId) {
      throw new ForbiddenException(`You are not the owner of the task`);
    }
    if (existTask.currentPerformer !== performerUserId) {
      throw new ForbiddenException(`Current performer is not the executor of this task`);
    }
    if (existTask.status !== TaskStatusEnum.Realized) {
      throw new ForbiddenException(`This task is not COMPLETED`);
    }

    return existTask as TaskEntity;
  }


}
