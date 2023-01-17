import { Expose } from "class-transformer";
import { IsArray, IsString } from "class-validator";

export class MyTasksDto {
  @Expose()
  @IsArray()
  public idsList: string[];

  @Expose()
  @IsString()
  public status: string;
}
