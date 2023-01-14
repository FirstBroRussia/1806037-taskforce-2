import { Expose } from "class-transformer";
import { IsMongoId, IsString } from "class-validator";

export class UserRequestDto {
  @Expose()
  @IsMongoId()
  public userId: string;

  @Expose()
  @IsString()
  public role: string;
}
