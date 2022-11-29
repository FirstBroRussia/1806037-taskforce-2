import { Injectable } from '@nestjs/common';
import { ReviewEntity } from '../review-memory/entities/review.entity';
import { ReviewMemoryRepository } from '../review-memory/review-memory.repository';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewService {
  constructor (
    private readonly reviewRepository: ReviewMemoryRepository,
  ) { }

  public async createReview(dto: CreateReviewDto): Promise<ReviewDto> {
    const reviewEntity = new ReviewEntity(dto);

    return this.reviewRepository.create(reviewEntity);
  }

}