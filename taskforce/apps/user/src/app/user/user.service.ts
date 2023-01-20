import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { comparePassword, getHashPassword, getRatingPerformerUser } from '@taskforce/core';
import { UpdateUserDtoType, UserEntityType } from '../../assets/type/types';
import { RequestUserDataDto } from '../auth/dto/request-user-data.dto';
import { PerformerUserEntity } from '../user-repository/entity/performer-user.entity';
import { UserRepository } from '../user-repository/user.repository';
import { UpdatePasswordUserDto } from './dto/update-password-user.dto';

@Injectable()
export class UserService {
  constructor (
    private readonly userRepository: UserRepository
  ) { }

  public async findUserById(id: string): Promise<UserEntityType> {
    const existUser =  await this.userRepository.findById(id);

    if (!existUser) {
      throw new NotFoundException(`The user with this id: ${id} was not found`);
    }

    return existUser;
  }

  public async updateUserById(id: string, dto: UpdateUserDtoType): Promise<UserEntityType> {
    const existUser =  await this.userRepository.findById(id);

    if (!existUser) {
      throw new NotFoundException(`The user with this id: ${id} was not found`);
    }

    return await this.userRepository.update(id, dto);
  }

  public async updateUserTaskListById(userId: string, taskId: number, emailUser: string): Promise<UserEntityType> {
    const existUser =  await this.userRepository.findById(userId);

    if (existUser.email !== emailUser) {
      throw new ForbiddenException(`No access!`);
    }
    if (!existUser) {
      throw new NotFoundException(`The user with this id: ${userId} was not found`);
    }

    return await this.userRepository.updateTaskList(userId, taskId);
  }

  public async updatePassword(id: string, dto: UpdatePasswordUserDto): Promise<UserEntityType> {
    const {oldPassword, newPassword} = dto;
    const existUser =  await this.userRepository.findById(id);

    if (!existUser) {
      throw new NotFoundException(`The user with this id: ${id} was not found`);
    }

    const isCheckPassword = comparePassword(oldPassword, existUser.passwordHash);

    if (!isCheckPassword) {
      throw new BadRequestException('Invalid old password');
    }

    const newPasswordHash = getHashPassword(newPassword);

    return await this.userRepository.updatePassword(id, newPasswordHash);
  }

  public async deleteUserById(id: string): Promise<void> {
    const existUser = await this.userRepository.findById(id);

    if (!existUser) {
      throw new NotFoundException(`The user with this id: ${id} was not found`);
    }

    return await this.userRepository.delete(id);
  }

  public async getMyTasks(userData: RequestUserDataDto): Promise<(object | number)[]> {
    const { sub } = userData;

    const { tasks } = await this.userRepository.findById(sub);

    return tasks;
  }

  public async updateRatingPerformerUser(userId: string, dto: number[]) {
    const existUser = await this.userRepository.findById(userId) as PerformerUserEntity;

    if (!existUser) {
      throw new NotFoundException(`The user with this id: ${userId} was not found`);
    }

    const ratingScoreSum = dto.reduce((prev, curr) => prev + curr);
    const reviewCount = dto.length;
    const failTaskCount = existUser.failedTasks.length;

    const ratingUser = getRatingPerformerUser(ratingScoreSum, reviewCount, failTaskCount);

    return await this.userRepository.updateRating(userId, ratingUser);
  }

}
