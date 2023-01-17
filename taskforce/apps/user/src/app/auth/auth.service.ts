import { Inject, Injectable } from '@nestjs/common';
import { comparePassword, createEventForRabbitMq, CustomError } from '@taskforce/core';
import { UserEntityType } from '../../assets/type/types';
import { AuthUserDto } from './dto/auth-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from '../user-repository/user.repository';
import { JwtService } from '@nestjs/jwt/dist';
import { CommandEventEnum, ExceptionEnum, UserRoleEnum } from '@taskforce/shared-types';
import { AuthRepository } from '../auth-repository/auth.repository';
import { AuthUserEntity } from '../auth-repository/entity/auth-user.entity';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  constructor (
    private readonly userRepository: UserRepository,
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    @Inject('RABBITMQ_CLIENT') private readonly rabbitMqClient: ClientProxy,
  ) { }

  public async register(dto: CreateUserDto): Promise<UserEntityType> {
    const existUser = await this.userRepository.findByEmail(dto.email);

    if (existUser) {
      throw new CustomError('User already exists', ExceptionEnum.Conflict);
    }

    const createdUser = await this.userRepository.create(dto);

    if (createdUser.role !== UserRoleEnum.Performer) return createdUser;

    this.rabbitMqClient.emit(
      createEventForRabbitMq(CommandEventEnum.AddSubscriber),
      {
        email: createdUser.email,
        firstname: createdUser.firstname,
        role: createdUser.role,
      },
    );

    return createdUser;
  }

  public async verifyUser(email: string): Promise<UserEntityType> {

    const existUser = await this.userRepository.findByEmail(email);

    if (!existUser) {
      throw new CustomError(`The user with this email: ${email} was not found`, ExceptionEnum.NotFound);
    }

    return existUser;
  }

  public async verifyPassword(password: string, passwordHash: string) {
    const isCheckPassword = comparePassword(password, passwordHash);

    if (!isCheckPassword) {
      throw new CustomError(`Invalid password`, ExceptionEnum.Unauthorized);
    }
  }

  public async login(dto: AuthUserDto) {
    const {email, password} = dto;

      const existUser = await this.verifyUser(email).catch((err) => {
        throw new CustomError(err, ExceptionEnum.NotFound);
      });

      await this.verifyPassword(password, existUser.passwordHash).catch((err) => {
        throw new CustomError(err, ExceptionEnum.Conflict);
      });

    const tokens = {
      access_token: null,
      refresh_token: null,
    };

    const payload = {
      sub: existUser._id,
      email: existUser.email,
      role: existUser.role,
      firstname: existUser.firstname,
      lastname: existUser.lastname,
    };

    const authDataUser = {
      email: existUser.email,
    };

    try {
      const { id } = await this.authRepository.addAuthUser(authDataUser);
      payload['authId'] = id;
      tokens.access_token = await this.jwtService.signAsync(payload);
      tokens.refresh_token = await this.jwtService.signAsync(payload, {
        algorithm: 'HS256',
        expiresIn: '3h',
      });
      await this.authRepository.updateAuthUser({
        id: id,
        refreshToken: tokens.refresh_token,
      });
    } catch (err) {
      const error = err as Error;
      throw new CustomError(error.message, ExceptionEnum.Conflict)
    }

    return tokens;
  }

  public async refreshToken(refreshToken: string) {
    const jwtPayload: JwtPayloadDto = await this.jwtService.verifyAsync(refreshToken).catch((err) => {
      throw new CustomError(err, ExceptionEnum.Conflict);
    });

    const existAuthUsers = await this.authRepository.getAuthUserByEmail(jwtPayload.email) as unknown as AuthUserEntity[];

    const payload = {
      sub: jwtPayload.sub,
      email: jwtPayload.email,
      role: jwtPayload.role,
      firstname: jwtPayload.firstname,
      lastname: jwtPayload.lastname,
    };

    const existAuthUsersAction = existAuthUsers.find(item => {
      if (item.refreshToken === refreshToken) {
        payload['authId'] = item.id;

        return item;
      }
    });

    if (!existAuthUsersAction) {
      throw new CustomError(`This refresh token is invalid.`, ExceptionEnum.Conflict);
    }

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  public async logout(authId: string) {
    return await this.authRepository.removeAuthUser(authId);
  }
}
