import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Query, Req, UseFilters } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { AllExceptionsFilter, fillDTO } from '@taskforce/core';
import { CommentService } from './comment.service';
import { CommentDto } from './dto/comment.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentQuery } from './query/comment.query';
import { Request } from 'express';

@ApiTags('comments')
@Controller('comments')
@UseFilters(AllExceptionsFilter)
export class CommentController {
  constructor (
    private readonly commentService: CommentService,
  ) { }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Creating a comment',
  })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  public async create(@Body() dto: CreateCommentDto): Promise<CommentDto> {
    return fillDTO(CommentDto, await this.commentService.create(dto));
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get comments',
  })
  @Get('task/:taskId')
  @HttpCode(HttpStatus.OK)
  public async getComments(@Query() query: CommentQuery, @Param('taskId', ParseIntPipe) taskId?: number): Promise<CommentDto | CommentDto[]> {
    return fillDTO(CommentDto, await this.commentService.getComments(query, taskId));
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete comment by id',
  })
  @Delete('comment/:commentId')
  @HttpCode(HttpStatus.OK)
  public async deleteComment(@Req() req: Request, @Param('commentId') commentId: string): Promise<string> {
    const userId = req.headers['userid'] as string;
    await this.commentService.delete(commentId, userId);

    return 'OK';
  }

}
