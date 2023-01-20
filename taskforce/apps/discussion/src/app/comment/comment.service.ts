import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { DiscussionRepository } from '../discussion-repository/discussion.repository';
import { CommentEntity } from '../discussion-repository/entity/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentQuery } from './query/comment.query';

@Injectable()
export class CommentService {
  constructor (
    private readonly discussRepository: DiscussionRepository,
  ) { }

  public async create(dto: CreateCommentDto): Promise<CommentEntity> {
    const comment = new CommentEntity().fillEntity(dto);

    return await this.discussRepository.create(comment);
  }

  public async getComments(query: CommentQuery, taskId?: number): Promise<CommentEntity[]> {
    return await this.discussRepository.find(query, taskId);
  }

  public async getCommentById(taskId: string): Promise<CommentEntity | null> {
    return await this.discussRepository.findById(taskId);
  }

  public async delete(commentId: string, userId: string): Promise<CommentEntity> {
    const existComment = await this.getCommentById(commentId);

    if (!existComment) {
      throw new NotFoundException(`Comment with this id: ${commentId} is not found.`);
    }

    if (existComment.userId !== userId) {
      throw new ForbiddenException(`Not access to delete a comment.`);
    }

    return await this.discussRepository.delete(commentId);
  }

}
