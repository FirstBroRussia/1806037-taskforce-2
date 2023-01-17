import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsMongoId, IsString } from "class-validator";

export class ChoosePerformerUserIdDto {
  @ApiProperty()
  @Expose()
  @IsMongoId()
  userId: string;

  @ApiProperty()
  @Expose()
  @IsString()
  role?: string;
}
