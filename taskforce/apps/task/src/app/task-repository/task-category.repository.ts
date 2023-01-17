import { Injectable } from "@nestjs/common";
import { TaskCategoryInterface } from "@taskforce/shared-types";
import { PrismaService } from "../prisma/prisma.service";
import { TaskCategoryEntity } from "./entities/task-category.entity";

@Injectable()
export class TaskCategoryRepository {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }

  public async create(item: TaskCategoryEntity): Promise<TaskCategoryInterface> {
    return this.prismaService.category.create({
      data: { ...item.toObject() },
      include: {
        posts: true,
      }
    });
  }

  public async destroy(id: number): Promise<TaskCategoryInterface> {
    return await this.prismaService.category.delete({
      where: {
       id,
      }
    });
  }

  public findById(id: number): Promise<TaskCategoryInterface | null> {
    return this.prismaService.category.findFirst({
      where: {
        id
      },
      include: {
        posts: true,
      }
    });
  }

  public findByName(title: string): Promise<TaskCategoryInterface | null> {
    return this.prismaService.category.findFirst({
      where: {
        title: title,
      },
      include: {
        posts: true,
      }
    });
  }

  public find(ids: number[] = []): Promise<TaskCategoryInterface[]> {
    return this.prismaService.category.findMany({
      where: {
        id: {
          in: ids.length > 0 ? ids : undefined
        }
      },
      include: {
        posts: true,
      }
    });
  }

  public update(id: number, item: TaskCategoryEntity): Promise<TaskCategoryInterface> {
    return this.prismaService.category.update({
      where: {
        id
      },
      data: { ...item.toObject(), id },
      include: {
        posts: true,
      }
    });
  }
}
