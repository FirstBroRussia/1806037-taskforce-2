import { HttpService } from '@nestjs/axios';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Req, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { AllExceptionsFilter, fillDTO } from '@taskforce/core';
import { CreateReviewBFFDto, CustomerRoleInterceptor, MongoIdValidationPipe, ReviewScoreListDto } from '@taskforce/shared-types';
import { Request } from 'express';
import { MicroserviceUrlEnum } from '../../assets/enum/microservice-url.enum';
import { AuthGuard } from '../../assets/guard/auth.guard';

@Controller('reviews')
@UseFilters(AllExceptionsFilter)
@UseGuards(AuthGuard)
@UseInterceptors(CustomerRoleInterceptor)
export class ReviewController {
  constructor (
    private readonly httpService: HttpService,
  ) {  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create review',
  })
  @Post('user/:performerUserId/task/:taskId')
  @HttpCode(HttpStatus.CREATED)
  public async create(@Req() req: Request & { user }, @Param('performerUserId', MongoIdValidationPipe) performerUserId: string, @Param('taskId', ParseIntPipe) taskId: number, @Body() dto) {
    await this.httpService.axiosRef.post(`${MicroserviceUrlEnum.Task}/task/${taskId}/checkcomplete/performer/${performerUserId}`, { ownerId: req.user.sub });

    const postReviewData: CreateReviewBFFDto = {
      ownerTaskUserId: req.user.sub,
      performerId: performerUserId,
      taskId: taskId,
      review: dto.review,
      score: dto.score,
    };
    const newReview = (await this.httpService.axiosRef.post(`${MicroserviceUrlEnum.Review}`, postReviewData)).data;

    const reviewScoreList = (fillDTO(
      ReviewScoreListDto,
      (await this.httpService.axiosRef.get(`${MicroserviceUrlEnum.Review}/user/${performerUserId}`)).data
      ) as unknown as ReviewScoreListDto[]).map(item => item.score);

    await this.httpService.axiosRef.patch(`${MicroserviceUrlEnum.User}/user/${performerUserId}/updaterating`, reviewScoreList);

    return newReview;
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All reviews by userId',
  })
  @Get('user/:performerUserId')
  @HttpCode(HttpStatus.OK)
  public async getAllReviewByUserId(@Param('performerUserId', MongoIdValidationPipe) performerUserId: string) {
    return (await this.httpService.axiosRef.get(`${MicroserviceUrlEnum.Review}/user/${performerUserId}`)).data;
  }
}
