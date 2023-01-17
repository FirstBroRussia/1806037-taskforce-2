import { ClassConstructor, plainToInstance } from "class-transformer";
import { ConflictException, BadRequestException, UnauthorizedException, NotFoundException, ForbiddenException, NotImplementedException } from '@nestjs/common';
import { ExceptionEnum } from '@taskforce/shared-types';
import { CustomError } from '@taskforce/core';
import { CommandEventEnum } from '@taskforce/shared-types';

export const fillDTO = <T, V>(someDto: ClassConstructor<T>, plainObject: V) => {
  return plainToInstance(someDto, plainObject, { excludeExtraneousValues: true });
};

export const fillObject = <T, V>(someDto: ClassConstructor<T>, plainObject: V) => {
  return plainToInstance(someDto, plainObject);
};

export function getMongoConnectionString({username, password, host, port, databaseName, authDatabase}): string {
  return `mongodb://${username}:${password}@${host}:${port}/${databaseName}?authSource=${authDatabase}`;
}

export function handleHttpError(error: CustomError) {
  const { message, errorType } = error;

  switch (errorType) {
    case ExceptionEnum.BadRequest: throw new BadRequestException(message);
    case ExceptionEnum.Unauthorized: throw new UnauthorizedException(message);
    case ExceptionEnum.NotFound: throw new NotFoundException(message);
    case ExceptionEnum.Forbidden: throw new ForbiddenException(message);
    case ExceptionEnum.Conflict: throw new ConflictException(message);
    case ExceptionEnum.NotImplemented: throw new NotImplementedException(message);
    default: throw new Error(message);
  }
}

export const createEventForRabbitMq = (command: keyof typeof CommandEventEnum) => {
  return { cmd: command };
};

export const getRatingPerformerUser = (ratingScoreSum: number, reviewsCount: number, failTaskCount: number) => {
  return ratingScoreSum / (reviewsCount + failTaskCount);
};
