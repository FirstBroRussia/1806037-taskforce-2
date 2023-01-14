import { TaskCategoryInterface, TaskStatusEnum } from '@taskforce/shared-types';
import { CreateTaskDto } from '../../task/dto/create-task.dto';

export class TaskEntity {
  id: number;

  userId: string;

  title: string;

  status: keyof typeof TaskStatusEnum;

  description: string;

  category: TaskCategoryInterface;

  price?: number;

  lifeTime?: Date;

  image?: string;

  address?: string;

  tags?: string[];

  repliedPerformers: string[];

  currentPerformer: string;

  createdAt: Date;

  updatedAt: Date;

  constructor (dto: CreateTaskDto, category: TaskCategoryInterface) {
    this.fillEntity(dto, category);
  }

  private async fillEntity(dto: CreateTaskDto, category: TaskCategoryInterface) {
    const { userId, title, description, price, lifeTime, image, address, tags } = dto;

    this.userId = userId;
    this.title = title;
    this.description = description;
    this.category = category;
    this.price = price;
    this.lifeTime= lifeTime;
    this.image = image;
    this.address = address;
    this.tags = tags;

    this.status = TaskStatusEnum.New;
  }

  public toObject() {
    return {
      ...this,
     };
  }

}
