import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, MinLength, MaxLength, IsDefined, IsNotEmpty } from 'class-validator';

export class CreateCommentBFFDto {
  @ApiProperty({
    required: true,
    description: 'Comment text',
  })
  @Expose()
  @IsString()
  @MinLength(10, {
    message: 'The «comment» field has a minimum length of 10 characters',
  })
  @MaxLength(300, {
    message: 'The «comment» field has a maximum length of 300 characters',
  })
  @IsDefined()
  public comment: string;

  @ApiProperty({
    required: true,
    description: 'ID of the task for which the comment is being created',
  })
  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  public taskId: string;

  @ApiProperty({
    required: true,
    description: 'Info about the comment creator'
  })
  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  public userId: string;
}
