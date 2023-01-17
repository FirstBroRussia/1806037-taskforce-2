import { HttpService } from '@nestjs/axios';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Logger, LoggerService, Param, ParseIntPipe, Post, Req, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { AllExceptionsFilter } from '@taskforce/core';
import { CommentBFFDto, CreateCommentBFFDto, MongoIdValidationPipe } from '@taskforce/shared-types';
import { Request } from 'express';
import { MicroserviceUrlEnum } from '../../assets/enum/microservice-url.enum';
import { AuthGuard } from '../../assets/guard/auth.guard';
import { DataTransformInterceptor } from '../../assets/interceptor/data-transform.interceptor';

@Controller('comments')
@UseFilters(AllExceptionsFilter)
export class DiscussionController {
  private readonly logger: LoggerService = new Logger(DiscussionController.name);

  constructor (
    private readonly httpService: HttpService,
  ) {  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Creating a comment',
  })
  @Post('/')
  @UseGuards(AuthGuard)
  @UseInterceptors(DataTransformInterceptor)
  @HttpCode(HttpStatus.CREATED)
  public async create(@Body() dto: CreateCommentBFFDto) {
    const { taskId } = dto;
    await this.httpService.axiosRef.get(`${MicroserviceUrlEnum.Task}/task/${taskId}`);

    const { data } = await this.httpService.axiosRef.post(`${MicroserviceUrlEnum.Comment}`, dto);

    return data;
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get comments',
  })
  @Get('task/:taskId')
  @HttpCode(HttpStatus.OK)
  public async getComments(@Req() req: Request, @Param('taskId', ParseIntPipe) taskId: number) {
    const queryString = req.url.replace(req.path, '');
    const { data } = await this.httpService.axiosRef.get(`${MicroserviceUrlEnum.Comment}/task/${taskId}${queryString}`);

    const commentList = data as CommentBFFDto[];
    for (const item of commentList) {
      const { data } = await this.httpService.axiosRef.get(`${MicroserviceUrlEnum.User}/user/${item.userId}/cropped`, {

      });
      item.userId = data;
    }

    return commentList;
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete comment by id',
  })
  @Delete('comment/:commentId')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  public async deleteComment(@Req() req: Request & { user }, @Param('commentId', MongoIdValidationPipe) commentId: string): Promise<string> {
    await this.httpService.axiosRef.delete(`${MicroserviceUrlEnum.Comment}/comment/${commentId}`, {
      headers: { 'userid': req.user.sub },
     });

    return 'Delete is complete';
  }

}
