import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class CommentBFFDto {
  @ApiProperty({
    description: 'The unique comment id'
  })
  @Transform(({ obj }) => obj._id.toString())
  @Expose()
  public id: string;

  @ApiProperty({
    description: 'Task Id'
  })
  @Expose()
  public taskId: string;

  @ApiProperty({
    description: 'User id'
  })
  @Expose()
  public userId: string;

  @ApiProperty({
    description: 'Comment text'
  })
  @Expose()
  public comment: string;

  @ApiProperty({
    description: 'Creation time'
  })
  @Expose()
  public createdAt: string;
}
