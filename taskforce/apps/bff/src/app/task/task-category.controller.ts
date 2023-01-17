import { HttpService } from '@nestjs/axios';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, UseFilters, UseGuards } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { AllExceptionsFilter } from '@taskforce/core';
import { MicroserviceUrlEnum } from '../../assets/enum/microservice-url.enum';
import { AuthGuard } from '../../assets/guard/auth.guard';

@Controller('categories')
@UseFilters(AllExceptionsFilter)
@UseGuards(AuthGuard)
export class TaskCategoryController {
  constructor (
    private readonly httpService: HttpService,
  ) {  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get task categories',
  })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getAll() {
    const { data } = await this.httpService.axiosRef.get(`${MicroserviceUrlEnum.Categories}`);

    return data;
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get task category by id',
  })
  @Get('/:categoryId')
  async get(@Param('categoryId', ParseIntPipe) categoryId: number) {
    const { data } = await this.httpService.axiosRef.get(`${MicroserviceUrlEnum.Categories}/${categoryId}`);

    return data;
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create new task category',
  })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto) {
    const { data } = await this.httpService.axiosRef.post(`${MicroserviceUrlEnum.Categories}`, dto);

    return data;
  }

  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Delete task category by id',
  })
  @Delete('/:categoryId')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('categoryId', ParseIntPipe) categoryId: number) {
    await this.httpService.axiosRef.delete(`${MicroserviceUrlEnum.Categories}/${categoryId}`);

    return `Delete category with id: ${categoryId} is successful`;
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Update task category by id',
  })
  @Put('/:categoryId')
  @HttpCode(HttpStatus.CREATED)
  async update(@Param('categoryId', ParseIntPipe) categoryId: number, @Body() dto) {
    const { data } = await this.httpService.axiosRef.put(`${MicroserviceUrlEnum.Categories}/${categoryId}`, dto);

    return data;
  }

}
