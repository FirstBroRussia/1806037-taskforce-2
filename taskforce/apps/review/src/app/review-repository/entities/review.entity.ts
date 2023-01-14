import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { ReviewInterface } from '@taskforce/shared-types';
import { Document } from 'mongoose';
import { Schema } from '@nestjs/mongoose';
import { CreateReviewDto } from '../../review/dto/create-review.dto';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ReviewEntity extends Document { }

@Schema({
  collection: 'reviews',
  timestamps: true,
})
export class ReviewEntity implements ReviewInterface, ReviewEntity {
  @Prop({
    required: true,
  })
  ownerTaskUserId: string;

  @Prop({
    required: true,
  })
  performerId: string;

  @Prop({
    required: true,
    unique: true,
  })
  taskId: number;

  @Prop({
    required: true,
  })
  score: number;

  @Prop({
    required: true,
  })
  review: string;

  public fillEntity(dto: CreateReviewDto) {
    const { ownerTaskUserId, performerId, taskId, review, score } = dto;

    this.ownerTaskUserId = ownerTaskUserId;
    this.performerId = performerId;
    this.taskId = taskId;
    this.review = review;
    this.score = score;

    return this;
  }
}

export const ReviewEntitySchema = SchemaFactory.createForClass(ReviewEntity);
