import { UserRoleEnum } from "@taskforce/shared-types";
import { ApiProperty } from '@nestjs/swagger';

import { IsDefined, IsEmail, IsEnum, IsISO8601, IsNotEmpty, IsString, MaxLength, MinLength, Validate } from 'class-validator';
import { AdultDateValidator } from "@taskforce/core";
import { UserRoleType } from "libs/shared-types/src/lib/type/user-role.type";

export class CreateUserDto {
  @ApiProperty({
    description: 'The uniq email of user',
    required: true,
    example: 'zhora@yahoo.com'
  })
  @IsEmail()
  @IsNotEmpty()
  @IsDefined()
  public email: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  @MinLength(6, {
    message: 'Password is shorter than 6 characters'
  })
  @MaxLength(12, {
    message: 'Password is longer than 12 characters'
  })
  @IsDefined()
  public password: string;

  @ApiProperty({
    required: true,
    enum: UserRoleEnum,
  })
  @IsEnum(UserRoleEnum, {
    message: `'Customer' or 'Performer'`
  })
  @IsDefined()
  public role: UserRoleType;

  @ApiProperty({
    required: true,
  })
  @IsString()
  @MinLength(3, {
    message: 'Firstname is shorter than 3 characters'
  })
  @MaxLength(50, {
    message: 'Firstname is longer than 50 characters'
  })
  @IsDefined()
  public firstname: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  @MinLength(3, {
    message: 'Lastname is shorter than 3 characters'
  })
  @MaxLength(50, {
    message: 'Lastname is longer than 50 characters'
  })
  @IsDefined()
  public lastname: string;

  @ApiProperty({
    required: true,
  })
  @Validate(AdultDateValidator, {
    message: 'The user is under 18 years of age'
  })
  @IsISO8601()
  @IsDefined()
  public dateBirth: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsDefined()
  public city: string;

  @ApiProperty()
  @IsString()
  public avatar?: string;
}
