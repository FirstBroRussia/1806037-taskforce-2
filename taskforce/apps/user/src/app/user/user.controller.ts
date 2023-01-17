import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Put, Req, UseFilters, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AllExceptionsFilter, CustomError, fillDTO, handleHttpError } from '@taskforce/core';
import { ExceptionEnum, MongoIdValidationPipe, UserRoleEnum } from '@taskforce/shared-types';
import { validate, ValidationError } from 'class-validator';
import { Request } from 'express';
import { UpdateUserDtoType, UserEntityType } from '../../assets/type/types';
import { RequestUserDataDto } from '../auth/dto/request-user-data.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CroppedUserDataDto } from './dto/cropped-user-data.dto';
import { CustomerUserDto } from './dto/customer-user.dto';
import { PerformerUserDto } from './dto/performer-user.dro';
import { UpdateCustomerUserDto } from './dto/update-customer-user.dto';
import { UpdatePasswordUserDto } from './dto/update-password-user.dto';
import { UpdatePerformerUserDto } from './dto/update-performer-user.dto';
import { UserService } from './user.service';


@ApiTags('users')
@Controller('users')
@UseFilters(AllExceptionsFilter)
export class UserController {
  constructor (
    private readonly userService: UserService
  ) { }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Getting a user by id'
  })
  @UseGuards(JwtAuthGuard)
  @Get('user/:id')
  @HttpCode(HttpStatus.OK)
  async getUserById(@Param('id', MongoIdValidationPipe) id: string) {
    const existUser = await this.userService.findUserById(id)
                              .catch(err => handleHttpError(err)) as UserEntityType;

    if (existUser.role === UserRoleEnum.Customer) {
      return fillDTO(CustomerUserDto, existUser);
    }
    if (existUser.role === UserRoleEnum.Performer) {
      return fillDTO(PerformerUserDto, existUser);
    }
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Getting a user cropped data by id'
  })
  @Get('user/:id/cropped')
  @HttpCode(HttpStatus.OK)
  async getCroppedDataUserById(@Param('id', MongoIdValidationPipe) id: string) {
    return fillDTO(
      CroppedUserDataDto,
      await this.userService.findUserById(id)
              .catch(err => handleHttpError(err)) as UserEntityType
      );
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Updating the user password by id'
  })
  @UseGuards(JwtAuthGuard)
  @Put('user/:id/updatepassword')
  @HttpCode(HttpStatus.CREATED)
  async updatePasswordUserById(@Param('id', MongoIdValidationPipe) id: string, @Body() dto: UpdatePasswordUserDto) {
    return await this.userService.updatePassword(id, dto)
                  .catch(err => handleHttpError(err));
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Updating user data by id'
  })
  @UseGuards(JwtAuthGuard)
  @Put('user/:id')
  @HttpCode(HttpStatus.CREATED)
  async updateUserById(@Req() req: Request & { user }, @Param('id', MongoIdValidationPipe) id: string, @Body() dto: UpdateUserDtoType) {
    const { email, role } = await this.getUserById(id)
                      .catch(err => handleHttpError(err)) as CustomerUserDto | PerformerUserDto;

    if (req.user.email !== email) {
      throw handleHttpError(new CustomError(`No access!`, ExceptionEnum.Forbidden));
    }

    let updateUserData: UpdateUserDtoType;
    if (role === UserRoleEnum.Customer) {
      updateUserData = fillDTO(UpdateCustomerUserDto, dto);
    }
    if (role === UserRoleEnum.Performer) {
      updateUserData = fillDTO(UpdatePerformerUserDto, dto);
    }

    await validate(updateUserData, { skipMissingProperties: true })
      .then(errors => {
        if (errors.length > 0)
          throw errors;
      })
      .catch(err => handleHttpError(err)) as unknown as ValidationError[];

    const existUser = await this.userService.updateUserById(id, updateUserData)
                                .catch(err => handleHttpError(err)) as UserEntityType;

      if (existUser.role === UserRoleEnum.Customer) {
        return fillDTO(CustomerUserDto, existUser);
      }
      if (existUser.role === UserRoleEnum.Performer) {
        return fillDTO(PerformerUserDto, existUser);
      }
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Add Task ID for user by id'
  })
  @UseGuards(JwtAuthGuard)
  @Patch('user/:userId/addtask/:taskId')
  @HttpCode(HttpStatus.CREATED)
  async updateTaskList(@Req() req: Request & { user }, @Param('userId', MongoIdValidationPipe) userId: string, @Param('taskId', ParseIntPipe) taskId: number) {
    return await this.userService.updateUserTaskListById(userId, taskId, req.user.email);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Deleting a user by id'
  })
  @UseGuards(JwtAuthGuard)
  @Delete('user/:id')
  @HttpCode(HttpStatus.OK)
  async deleteUserById(@Param('id', MongoIdValidationPipe) id: string) {
    await this.userService.deleteUserById(id)
            .catch(err => handleHttpError(err));

    return 'Delete is complete.'
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Getting a list of tasks'
  })
  @UseGuards(JwtAuthGuard)
  @Get('user/mytasks')
  @HttpCode(HttpStatus.OK)
  async getMyTasks(@Req() req: Request) {
    const userData = req.user as RequestUserDataDto;
    return await this.userService.getMyTasks(userData)
                  .catch(err => handleHttpError(err));
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update rating to performer user',
  })
  @Patch('user/:userId/updaterating')
  @HttpCode(HttpStatus.OK)
  async updateRatingPerformerUser(@Param('userId', MongoIdValidationPipe) userId: string, @Body() dto: number[]) {
    return await this.userService.updateRatingPerformerUser(userId, dto)
                  .catch(err => handleHttpError(err));
  }

}
