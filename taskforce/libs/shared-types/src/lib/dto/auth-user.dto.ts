import { IsDefined, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AuthUserDto {
  @ApiProperty({
    required: true,
    description: 'User uniq email',
    example: 'user@user.com',
  })
  @IsEmail(
    {},
    { message: '' },
    )
  @IsNotEmpty()
  @IsDefined()
  @Expose()
  public email!: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @Expose()
  public password!: string;
}
