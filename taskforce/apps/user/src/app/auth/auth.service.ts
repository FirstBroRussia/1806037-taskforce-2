import { Injectable, Logger, LoggerService } from '@nestjs/common';
import { comparePassword, CustomError } from '@taskforce/core';
import { UserEntityType } from '../../assets/type/types';
import { AuthUserDto } from './dto/auth-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from '../user-repository/user.repository';
import { JwtService } from '@nestjs/jwt/dist';
import { JwtRefreshTokenDto } from './dto/jwt-refresh-token.dto';
import { ExceptionEnum } from '@taskforce/shared-types';
import { AuthRepository } from '../auth-repository/auth.repository';
import { AuthUserEntity } from '../auth-repository/entity/auth-user.entity';
import { JwtPayloadDto } from './dto/jwt-payload.dto';

@Injectable()
export class AuthService {
  private readonly logger: LoggerService = new Logger(AuthService.name);

  constructor (
    private readonly userRepository: UserRepository,
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) { }

  public async register(dto: CreateUserDto): Promise<UserEntityType | Error> {
    const existUser = await this.userRepository.findByEmail(dto.email);

    if (existUser) {
      throw new CustomError('User already exists', ExceptionEnum.Conflict);
    }

    return await this.userRepository.create(dto);
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

    // const refreshToken = await this.jwtService.signAsync(payload, {
    //   algorithm: 'HS256',
    //   expiresIn: '3h',
    // }).catch((err) => {
    //     throw new CustomError(err, ExceptionEnum.Conflict);
    // });

    // TODO
    // Добавляем данного пользователя в БД для авторизованных
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


    if (!existAuthUsers.find(item => {
      if (item.refreshToken === refreshToken) {
        payload['authId'] = item.id;
        return item;
      }
    })) {
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
