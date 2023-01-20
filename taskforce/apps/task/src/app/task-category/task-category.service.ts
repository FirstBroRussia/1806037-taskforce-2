import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TaskCategoryInterface } from '@taskforce/shared-types';
import { TaskCategoryEntity } from '../task-repository/entities/task-category.entity';
import { TaskCategoryRepository } from '../task-repository/task-category.repository';
import { CreateTaskCategoryDto } from './dto/create-task-category.dto';
import { UpdateTaskCategoryDto } from './dto/update-task-category.dto';

@Injectable()
export class TaskCategoryService {
  constructor(
    private readonly taskCategoryRepository: TaskCategoryRepository,
  ) { }

  public async getAll(): Promise<TaskCategoryInterface[]> {
    const result = await this.taskCategoryRepository.find();

    return result;
  }

  public async getById(categoryId: number): Promise<TaskCategoryInterface> {
    const result = await this.taskCategoryRepository.findById(categoryId);

    if (!result) {
      throw new NotFoundException(`Category with this id: ${categoryId} is not found`);
    }

    return result;
  }

  public async getByName(title: string): Promise<TaskCategoryInterface> {
    return await this.taskCategoryRepository.findByName(title);
  }

  public async create(dto: CreateTaskCategoryDto): Promise<TaskCategoryInterface> {
    const { title } = dto;
    const existCategory = await this.taskCategoryRepository.findByName(title);

    if (existCategory) {
      throw new BadRequestException(`Category with this title: "${title}" is already exist`);
    }

    const newCategory = new TaskCategoryEntity(dto);

    const result = await this.taskCategoryRepository.create(newCategory);

    return result;
  }

  public async delete(categoryId: number): Promise<void> {
    await this.getById(categoryId);
    await this.taskCategoryRepository.destroy(categoryId);
  }

  public async update(categoryId: number, dto: UpdateTaskCategoryDto): Promise<TaskCategoryInterface> {
    const { title } = dto;

    await this.getById(categoryId);
    const existCategory = await this.taskCategoryRepository.findByName(title);

    if (existCategory) {
      throw new BadRequestException(`Category with this title: "${title}" is already exist`);
    }

    const updateCategory = new TaskCategoryEntity(dto);

    return await this.taskCategoryRepository.update(categoryId, updateCategory);
  }

}
