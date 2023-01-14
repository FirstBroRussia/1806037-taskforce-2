import { HttpService } from '@nestjs/axios';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Logger, LoggerService, Param, ParseIntPipe, Patch, Post, Put, Query, Req, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { AllExceptionsFilter } from '@taskforce/core';
import { Request } from 'express';
import { MicroserviceUrlEnum } from '../../assets/enum/microservice-url.enum';
import { AuthGuard } from '../../assets/guard/auth.guard';
import { DataTransformInterceptor } from '../../assets/interceptor/data-transform.interceptor';

@Controller('tasks')
@UseFilters(AllExceptionsFilter)
@UseGuards(AuthGuard)
export class TaskController {
  private readonly logger: LoggerService = new Logger(TaskController.name);

  constructor (
    private readonly httpService: HttpService,
  ) {  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create new task',
  })
  @Post('/')
  @UseInterceptors(DataTransformInterceptor)
  @HttpCode(HttpStatus.CREATED)
  public async createTask(@Req() req: Request & { user }, @Body() dto) {
    const { data } = await this.httpService.axiosRef.post(`${MicroserviceUrlEnum.Task}`, dto)
                            .catch(err => { throw err });

    return data;
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get tasks list',
  })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  public async getTasks(@Req() req: Request) {
    const queryString = req.url.replace(req.path, '');
    const { data } = await this.httpService.axiosRef.get(`${MicroserviceUrlEnum.Task}${queryString}`)
                            .catch(err => { throw err });

    return data;
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get task by id',
  })
  @Get('task/:id')
  @HttpCode(HttpStatus.OK)
  public async getTask(@Param('id', ParseIntPipe) taskId: number) {
    const { data } = await this.httpService.axiosRef.get(`${MicroserviceUrlEnum.Task}/task/${taskId}`)
                            .catch(err => { throw err });

    return data;
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Update task by id',
  })
  @Put('task/:id')
  @UseInterceptors(DataTransformInterceptor)
  @HttpCode(HttpStatus.CREATED)
  public async updateTask(@Param('id', ParseIntPipe) taskId: number, @Body() dto) {
    const { data } = await this.httpService.axiosRef.put(`${MicroserviceUrlEnum.Task}/task/${taskId}`, dto)
                            .catch(err => { throw err });

    return data;
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Update status task by id',
  })
  @Put('task/:id/updatestatus')
  @UseInterceptors(DataTransformInterceptor)
  @HttpCode(HttpStatus.CREATED)
  public async updateStatusTask(@Param('id', ParseIntPipe) taskId: number, @Body() dto) {
    const { data } = await this.httpService.axiosRef.put(`${MicroserviceUrlEnum.Task}/task/${taskId}/updatestatus`, dto)
                            .catch(err => { throw err });

    return data;
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Choose the task performer by id',
  })
  @Patch('task/:id/chooseperformer')
  @UseInterceptors(DataTransformInterceptor)
  @HttpCode(HttpStatus.OK)
  async choosePerformerById(@Req() req: Request & { user }, @Param('id', ParseIntPipe) taskId: number, @Body() dto) {
    await this.httpService.axiosRef.put(`${MicroserviceUrlEnum.Task}/task/${taskId}/chooseperformer`, dto)
            .catch(err => { throw err });

    await this.httpService.axiosRef.patch(`${MicroserviceUrlEnum.User}/user/${req.user.sub}/addtask/${taskId}`, null, {
      headers: { 'Authorization': req.headers['authorization'] },
    })
                            .catch(err => { throw err });
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Add reply to task by id',
  })
  @Patch('task/:taskId/addreply')
  @UseInterceptors(DataTransformInterceptor)
  @HttpCode(HttpStatus.CREATED)
  public async addReplyToTask(@Param('taskId', ParseIntPipe) taskId: number, @Body() dto) {
    await this.httpService.axiosRef.patch(`${MicroserviceUrlEnum.Task}/task/${taskId}/addreply`, dto)
                      .catch(err => { throw err });
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete task by id',
  })
  @Delete('task/:id')
  @HttpCode(HttpStatus.OK)
  public async deleteTask(@Req() req: Request & { user }, @Param('id', ParseIntPipe) taskId: number): Promise<string> {
    await this.httpService.axiosRef.delete(`${MicroserviceUrlEnum.Task}/task/${taskId}`, {
      headers: { 'userid': req.user.sub },
    })
                      .catch(err => { throw err });

    return `Delete task with id: ${taskId} is succussful`;
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get my tasks',
  })
  @Post('task/mytasks')
  @HttpCode(HttpStatus.OK)
  public async getMyTasks(@Body() dto) {
    return (await this.httpService.axiosRef.post(`${MicroserviceUrlEnum.Task}/task/mytasks`, dto)
                      .catch(err => { throw err })).data;
  }

}
