import { Injectable } from "@nestjs/common";
import { ReviewEntity } from './entities/review.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ReviewRepository {

  constructor (
    @InjectModel(ReviewEntity.name) private readonly reviewModel: Model<ReviewEntity>,
  ) { }

  public async create(item: ReviewEntity): Promise<ReviewEntity> {
    return await new this.reviewModel(item).save();
  }

  public async findAllReviewByUserId(userId: string): Promise<ReviewEntity[]> {
    return await this.reviewModel.find({
      userId: userId,
    });
  }

}
