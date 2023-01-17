import { Expose } from "class-transformer";
import { IsMongoId } from "class-validator";

export class CheckCompleteTaskDto {
  @Expose()
  @IsMongoId()
  public ownerId: string;
}
