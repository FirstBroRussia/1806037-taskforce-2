import { Injectable } from "@nestjs/common";
import { CommentEntity } from "./entity/comment.entity";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentQuery } from '../comment/query/comment.query';

@Injectable()
export class DiscussionRepository {
  constructor (
    @InjectModel(CommentEntity.name) private readonly commentModel: Model<CommentEntity>,
  ) { }

  public async create(item: CommentEntity): Promise<CommentEntity> {
    const commentEntityModel = new this.commentModel(item);

    return await commentEntityModel.save();
  }

  public async find(query: CommentQuery, taskId?: number): Promise<CommentEntity[]> {
    const { limit, page } = query;

    return await this.commentModel.find({ taskId: taskId }).limit(limit).skip(limit * (page - 1)).sort({ createdAt: "desc" });
  }

  public async findById(id: string): Promise<CommentEntity> {
    return await this.commentModel.findById(id);
  }

  public async delete(id: string): Promise<CommentEntity> {
    return await this.commentModel.findByIdAndDelete(id);
  }

}
