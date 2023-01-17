import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsString, IsDefined, MinLength, MaxLength, Min, Max, IsInt, IsNumber } from 'class-validator';

export class CreateReviewBFFDto {
  @ApiProperty({
    required: true,
    description: 'Creator ID review',
  })
  @Expose()
  @IsString()
  @IsDefined()
  public ownerTaskUserId: string;

  @ApiProperty({
    required: true,
    description: 'Performer user ID',
  })
  @Expose()
  @IsString()
  @IsDefined()
  public performerId: string;

  @ApiProperty({
    required: true,
    description: 'Performer user ID',
  })
  @Expose()
  @IsNumber()
  @IsDefined()
  public taskId: number;

  @ApiProperty({
    required: true,
    description: 'Score for current review',
  })
  @Expose()
  @Type(() => Number)
  @Min(1)
  @Max(5)
  @IsInt()
  public score: number;

  @ApiProperty({
    required: true,
    description: 'Review text',
  })
  @Expose()
  @IsString()
  @MinLength(50, {
    message: 'Review text is shorter than 50 characters'
  })
  @MaxLength(500, {
    message: 'Review text is longer than 500 characters'
  })
  @IsDefined()
  public review: string;

}
