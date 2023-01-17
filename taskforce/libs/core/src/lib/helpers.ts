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

export const checkAndGetTags = (tagsStr: string) => {
  let tagsArr = tagsStr.split(' ');
  if (tagsArr.length > 5) {
    throw new CustomError('No more than 5 tags', ExceptionEnum.BadRequest);
  }

  tagsArr = Array.from(new Set(tagsArr));
  tagsArr = tagsArr.map(item => {
    if (item.length < 3 || item.length > 10) {
      throw new CustomError(`The tag length must be at least 3 characters and no more than 10 characters. Target tag: ${item}`, ExceptionEnum.BadRequest);
    }
    if (!(/^[a-zA-Zа-яА-Я]$/).test(item.substr(0, 1))) {
      throw new CustomError(`The tag must start with the letter. Target tag: ${item}`, ExceptionEnum.BadRequest);
    }
    const str = item.toLowerCase();

    return str;
  });

  return tagsArr;
};
