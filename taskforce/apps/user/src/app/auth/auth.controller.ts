import { Controller, Post, HttpCode, HttpStatus, Body, UseGuards, Req, UseFilters, Get, UseInterceptors } from '@nestjs/common';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { AllExceptionsFilter, fillDTO } from '@taskforce/core';
import { AuthService } from './auth.service';
import { JwtTokensDto } from './dto/jwt-tokens.dto';
import { AuthUserDto } from './dto/auth-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { JwtAccessTokenDto } from './dto/jwt-access-token.dto';
import { RefreshTokenMeta } from './metadata/refresh-token.metadata';
import { LogoutMeta } from './metadata/logout.metadata';
import { UserEntityType } from '../../assets/type/types';
import { CreatedUserDto } from './dto/created-user.dto';

@ApiTags('auth')
@Controller('auth')
@UseFilters(AllExceptionsFilter)
export class AuthController {
  constructor (
    private readonly authService: AuthService,
  ) { }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The new user has been successfull created'
  })
  @Post('register')
  @UseInterceptors(FileInterceptor('avatar'))
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateUserDto) {
    return fillDTO(
      CreatedUserDto,
      await this.authService.register(dto) as UserEntityType
      );
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user has logged in'
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: AuthUserDto) {
    return fillDTO(JwtTokensDto,
      await this.authService.login(dto)
    );
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Request for a new token based on the refresh token'
  })
  @RefreshTokenMeta()
  @UseGuards(JwtAuthGuard)
  @Post('refreshtoken')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Req() req: Request) {
    const refreshToken = req.headers['authorization'].split(' ')[1];

    return fillDTO(JwtAccessTokenDto,
      await this.authService.refreshToken(refreshToken)
    );
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user logged out'
  })
  @LogoutMeta()
  @UseGuards(JwtAuthGuard)
  @Get('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request) {
    const authId = req.user['authId'];
    await this.authService.logout(authId);

    return 'OK';
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Check token'
  })
  @UseGuards(JwtAuthGuard)
  @Get('checktoken')
  @HttpCode(HttpStatus.OK)
  async checkToken(@Req() req: Request) {
    return req.user;
  }

}
