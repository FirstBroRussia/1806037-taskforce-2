import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class CroppedUserDataDto {
  @ApiProperty()
  @Expose()
  public role: string;

  @ApiProperty()
  @Expose()
  public firstname: string;
}
