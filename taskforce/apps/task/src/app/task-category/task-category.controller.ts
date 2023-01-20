import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, UseFilters } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AllExceptionsFilter, fillDTO } from '@taskforce/core';
import { CreateTaskCategoryDto } from './dto/create-task-category.dto';
import { UpdateTaskCategoryDto } from './dto/update-task-category.dto';
import { TaskCategoryRdo } from './rdo/task-category.rdo';
import { TaskCategoryService } from './task-category.service';

@ApiTags('categories')
@Controller('categories')
@UseFilters(AllExceptionsFilter)
export class TaskCategoryController {
  constructor(
    private readonly taskCategoryService: TaskCategoryService,
  ) { }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get task categories',
  })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getAll() {
    return fillDTO(
      TaskCategoryRdo,
      await this.taskCategoryService.getAll()
    );
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get task category by id',
  })
  @Get('/:id')
  async get(@Param('id', ParseIntPipe) categoryId: number) {
    return fillDTO(
      TaskCategoryRdo,
      await this.taskCategoryService.getById(categoryId)
    );
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create new task category',
  })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateTaskCategoryDto) {
    console.log(dto);
    return fillDTO(
      TaskCategoryRdo,
      await this.taskCategoryService.create(dto)
    );
  }

  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Delete task category by id',
  })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id', ParseIntPipe) categoryId: number) {
    await this.taskCategoryService.delete(categoryId);

    return `Delete category with id: ${categoryId} is successful`;
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Update task category by id',
  })
  @Put('/:id')
  @HttpCode(HttpStatus.CREATED)
  async update(@Param('id', ParseIntPipe) categoryId: number, @Body() dto: UpdateTaskCategoryDto) {
    return fillDTO(
      TaskCategoryRdo,
      await this.taskCategoryService.update(categoryId, dto)
    );
  }

}
