import { ApiProperty } from "@nestjs/swagger";
import { TaskStatusEnum } from "@taskforce/shared-types";
import { Expose } from "class-transformer";
import { IsDefined, IsEnum, IsMongoId, IsString } from "class-validator";

export class StatusTaskDto {
  @ApiProperty()
  @Expose()
  @IsMongoId()
  userId?: string;

  @ApiProperty()
  @Expose()
  @IsString()
  role?: string;

  @ApiProperty({
    required: true,
    readOnly: true,
    enum: TaskStatusEnum,
  })
  @Expose()
  @IsEnum(TaskStatusEnum)
  @IsDefined()
  public statusTask: keyof typeof TaskStatusEnum;
}
