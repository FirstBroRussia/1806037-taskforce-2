import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsString, MaxLength, MinLength } from "class-validator";

export class UpdatePasswordUserDto {
  @ApiProperty()
  @Expose({name: 'old_password'})
  @IsString()
  public oldPassword: string;

  @ApiProperty()
  @Expose({name: 'new_password'})
  @IsString()
  @MinLength(6, {
    message: 'Password is shorter than 6 characters'
  })
  @MaxLength(12, {
    message: 'Password is longer than 12 characters'
  })
  public newPassword: string;
}