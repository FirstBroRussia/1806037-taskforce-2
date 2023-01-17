import { Expose } from "class-transformer";
import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateTaskCategoryDto {
  @Expose()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  title: string;
}
