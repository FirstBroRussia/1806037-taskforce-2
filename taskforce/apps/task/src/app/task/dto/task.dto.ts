import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TaskDto {
  @ApiProperty()
  @Expose()
  public id: string;

  @ApiProperty()
  @Expose()
  public userId!: string;

  @ApiProperty()
  @Expose()
  public status: string;

  @ApiProperty()
  @Expose()
  title!: string;

  @ApiProperty()
  @Expose()
  description!: string;

  @ApiProperty()
  @Expose()
  category!: string;

  @ApiProperty()
  @Expose()
  price?: number;

  @ApiProperty()
  @Expose()
  lifeTime?: Date;

  @ApiProperty()
  @Expose()
  image?: string;

  @ApiProperty()
  @Expose()
  address?: string;

  @ApiProperty()
  @Expose()
  tags?: string[];

  @ApiProperty()
  @Expose()
  public currentPerformer: string;

  @ApiProperty()
  @Expose()
  public repliedPerformers: string[];

  @ApiProperty()
  @Expose()
  public createdAt: Date;

  @ApiProperty()
  @Expose()
  public updatedAt: Date[];
}
