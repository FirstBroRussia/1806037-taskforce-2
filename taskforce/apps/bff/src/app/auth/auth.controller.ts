import { HttpService } from '@nestjs/axios';
import { Body, Controller, Get, HttpCode, HttpStatus, Logger, LoggerService, Post, Req, UseFilters, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiResponse } from '@nestjs/swagger';
import { AllExceptionsFilter } from '@taskforce/core';
import { AuthUserDto } from '@taskforce/shared-types';
import { Request } from 'express';
import { MicroserviceUrlEnum } from '../../assets/enum/microservice-url.enum';


@Controller('auth')
@UseFilters(AllExceptionsFilter)
export class AuthController {
  private readonly logger: LoggerService = new Logger(AuthController.name);

  constructor (
    private readonly httpService: HttpService,
  ) {  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The new user has been successfull created'
  })
  @Post('register')
  @UseInterceptors(FileInterceptor('avatar'))
  @HttpCode(HttpStatus.CREATED)
  async create(@Req() req: Request & { file }, @Body() dto) {
    const { data } = await this.httpService.axiosRef.post(`${MicroserviceUrlEnum.Auth}/register`, dto,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return data;
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user has logged in'
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: AuthUserDto) {
    const { data } = await this.httpService.axiosRef.post(`${MicroserviceUrlEnum.Auth}/login`, dto);

    return data;
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Request for a new token based on the refresh token'
  })
  @Post('refreshtoken')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Req() req: Request) {
    const { data } = await this.httpService.axiosRef.post(`${MicroserviceUrlEnum.Auth}/refreshtoken`, null, {
      headers: { 'Authorization': req.headers['authorization'] },
    });

    return data;
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user logged out'
  })
  @Get('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request) {
    await this.httpService.axiosRef.get(`${MicroserviceUrlEnum.Auth}/logout`, {
      headers: { 'Authorization': req.headers['authorization'] },
    });

    return 'OK';
  }

}
