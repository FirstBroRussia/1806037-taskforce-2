import { Expose } from "class-transformer";
import { IsMongoId, IsString } from "class-validator";

export class NewTaskNotifyDto {
  @Expose()
  @IsMongoId()
  userId?: string;

  @Expose()
  @IsString()
  title: string;
}
