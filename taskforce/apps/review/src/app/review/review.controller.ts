import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseFilters } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AllExceptionsFilter, CustomError, fillDTO, handleHttpError } from '@taskforce/core';
import { ExceptionEnum, MongoIdValidationPipe } from '@taskforce/shared-types';
import { ReviewEntity } from '../review-repository/entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewDto } from './dto/review.dto';
import { ReviewService } from './review.service';

@ApiTags('reviews')
@Controller('reviews')
@UseFilters(AllExceptionsFilter)
export class ReviewController {
  constructor (
    private readonly reviewService: ReviewService,
  ) { }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create review',
  })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  public async create(@Body() dto: CreateReviewDto): Promise<ReviewDto> {
    return fillDTO(ReviewDto, await this.reviewService.create(dto));
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All reviews by userId',
  })
  @Get('user/:performerUserId')
  @HttpCode(HttpStatus.OK)
  public async getAllReviewByUserId(@Param('performerUserId', MongoIdValidationPipe) performerUserId: string): Promise<ReviewEntity[] | void> {
    return await this.reviewService.getAllReviewByUserId(performerUserId)
            .then((result) => {
              if (!result) {
                throw new CustomError(`The comment list for this user: ${performerUserId} was not found.`, ExceptionEnum.NotFound)
              }

              return result;
            })
            .catch((error) => handleHttpError(error))
  }

}
