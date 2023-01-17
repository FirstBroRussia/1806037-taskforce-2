import { HttpService } from '@nestjs/axios';
import { Controller, Get, HttpCode, HttpStatus, Param, Req } from '@nestjs/common';
import { Body, Delete, Put, Query, UseFilters } from '@nestjs/common/decorators';
import { ApiResponse } from '@nestjs/swagger';
import { AllExceptionsFilter } from '@taskforce/core';
import { MongoIdValidationPipe } from '@taskforce/shared-types';
import { Request } from 'express';
import { MicroserviceUrlEnum } from '../../assets/enum/microservice-url.enum';

@Controller('users')
@UseFilters(AllExceptionsFilter)
export class UserController {
  constructor (
    private readonly httpService: HttpService,
  ) {  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Getting a user by id'
  })
  @Get('user/:id')
  @HttpCode(HttpStatus.OK)
  async getUserById(@Req() req: Request, @Param('id', MongoIdValidationPipe) id: string) {
    const { data } = await this.httpService.axiosRef.get(`${MicroserviceUrlEnum.User}/${id}`, {
      headers: { 'Authorization': req.headers['authorization'] },
    });

    return data;
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Updating the user password by id'
  })
  @Put('user/:id/updatepassword')
  @HttpCode(HttpStatus.CREATED)
  async updatePasswordUserById(@Req() req: Request, @Param('id', MongoIdValidationPipe) id: string, @Body() dto) {
    const { data } = await this.httpService.axiosRef.put(`${MicroserviceUrlEnum.User}/${id}/updatepassword`, dto, {
      headers: { 'Authorization': req.headers['authorization'] },
    });

    return data;
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Updating user data by id'
  })
  @Put('user/:id')
  @HttpCode(HttpStatus.CREATED)
  async updateUserById(@Req() req: Request, @Param('id', MongoIdValidationPipe) id: string, @Body() dto) {
    const { data } = await this.httpService.axiosRef.put(`${MicroserviceUrlEnum.User}/${id}`, dto, {
      headers: { 'Authorization': req.headers['authorization'] },
    });

    return data;
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Deleting a user by id'
  })
  @Delete('user/:id')
  @HttpCode(HttpStatus.OK)
  async deleteUserById(@Req() req: Request, @Param('id', MongoIdValidationPipe) id: string) {
    await this.httpService.axiosRef.delete(`${MicroserviceUrlEnum.User}/${id}`, {
      headers: { 'Authorization': req.headers['authorization'] },
    });

    return 'Delete is complete.'
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Getting a list of tasks'
  })
  @Get('user/mytasks')
  @HttpCode(HttpStatus.OK)
  async getMyTasks(@Req() req: Request, @Query() { status }) {
    const resultOne = await this.httpService.axiosRef.get(`${MicroserviceUrlEnum.User}/user/mytasks`, {
      headers: { 'Authorization': req.headers['authorization'] },
    });

    const payload = {
      idsList: resultOne.data,
      status: status,
    };

    const resultTwo = await this.httpService.axiosRef.post(`${MicroserviceUrlEnum.Task}/task/mytasks`, payload, {
      headers: { 'Authorization': req.headers['authorization'] },
    });

    return resultTwo.data;
  }

}
