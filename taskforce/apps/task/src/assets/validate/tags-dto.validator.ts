import { CustomError } from '@taskforce/core';
import { ExceptionEnum } from '@taskforce/shared-types';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint()
export class TagsValidator implements ValidatorConstraintInterface {
  validate(tags: string[]) {
    if (tags.length > 5) {
      throw new CustomError('No more than 5 tags', ExceptionEnum.BadRequest);
    }

    tags = Array.from(new Set(tags));
    tags.forEach(item => {
      if (item.length < 3 || item.length > 10) {
        throw new CustomError(`The tag length must be at least 3 characters and no more than 10 characters. Target tag: ${item}`, ExceptionEnum.BadRequest);
      }
      if (!(/^[a-zA-Zа-яА-Я]$/).test(item.substr(0, 1))) {
        throw new CustomError(`The tag must start with the letter. Target tag: ${item}`, ExceptionEnum.BadRequest);
      }
    })

    return true;
  }

}
